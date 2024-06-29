<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\Generic\UserResource;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\User;
use App\Utils\Utils;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use League\CommonMark\Extension\CommonMark\Node\Inline\Code;
use function PHPUnit\Framework\isEmpty;

class InitialGroupsLdap
{
    const SUPER_ADMIN = "Super Admin";
    const ADMIN = "Administrador de Sistema";
    const COMISSION_CCP = "Comissão Científico-Pedagógica";
    const PEDAGOGIC = "Conselho Pedagógico";
    const COORDINATOR = "Coordenador de Curso";
    const BOARD = "Direção";
    const GOP = "GOP";
    const TEACHER = "Docente";
    const RESPONSIBLE_PEDAGOGIC = "Responsável Conselho Pedagógico";
    const RESPONSIBLE = "Responsável Unidade Curricular";
    const STUDENT = "Estudante";
}


class LoginController extends Controller
{

    protected function credentials(Request $request)
    {
        return [
            'email' => $request->email,
            'password' => $request->password
        ];
    }

    public function login(LoginRequest $request)
    {
        Log::channel('users_login')->info('Login requested: [ Email: ' . $request->email . ' ]');
        $response = Http::asForm()->post('https://www.dei.estg.ipleiria.pt/servicos/projetos/validateLogin.php', [
            'a' => $request->email,
            'b' => $request->password
        ]);
        if(!$response->successful()){
            return response()->json("There was a problem login in. Please try again later",Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        if($response->body()!= "true") {
            if (!Auth::attempt($this->credentials($request))) {
                return response()->json("Unauthorized.",Response::HTTP_UNAUTHORIZED);
            }
            $user = Auth::user();
            $user->refresh();
        }
        else {
//            if(!$user = User::where('email', 'like', "%$request->email%")->first()){
                //change academicYearCode to 2023/24 format (change accordingly to the webservice argument)

            $selectedYear = AcademicYear::where('selected', true)->first();
            if($selectedYear){
                $activeYear = $selectedYear->id;
            } else {
                $activeYear = 0;
            }
            $academicYearCode = substr($selectedYear->code,0,4). "/" .substr($selectedYear->code,4,6);
            if(preg_match('/[0-9]{7}/', $request->email)){
                $response = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo='. $academicYearCode .'&num_aluno='.$request->email.'&formato=json');
                $student_data = $response->body();
                $student_units = json_decode($student_data);
                $enrroled_UCS = '';

                if(!empty($student_units)){
                    $user= User::firstOrCreate([
                        "email" => $request->email . '@my.ipleiria.pt',
                        "name" => $request->email,
                        "enabled" => true,
                        "password" => "",
                    ]);

                    foreach ($student_units as $unit){
                        $courseUnit = CourseUnit::where('code', $unit->CD_DISCIP)->where("academic_year_id",$activeYear)->first()->id;
                        if( !in_array($courseUnit, explode(',',$enrroled_UCS))){
                            $enrroled_UCS .= ($enrroled_UCS === '' ? '' : ',') . $courseUnit;
                        }
                    }

                    if($user->groups->count()!=0){
                        $user->groups()->syncWithoutDetaching(Group::isStudent()->get());
                    }
                    $group = Group::isStudent()->first();
                    $currentGroup = [
                        'key' => $group->id,
                        'text' => $group->code,
                        'value' => $group->name_pt
                    ];

                    $scopes =  $group->permissions()->where('group_permissions.enabled', true)
                        ->groupBy('permissions.code')->pluck('permissions.code')->values()->toArray();

                    $accessToken = $user->createToken('authToken', $scopes)->accessToken;

                    $utils = new Utils();
                    return response()->json([
                        'user'          => $user,
                        'accessToken'   => $accessToken,
                        'academicYear'  => $utils->getFullYearsAcademicYear($selectedYear ? $selectedYear->display : 0),
                        'currentGroup'  => $currentGroup,
                        'courseUnits'   =>$enrroled_UCS
                    ], Response::HTTP_OK)->withCookie('academic_year', $activeYear )->withCookie('selectedGroup',$group->id)
                        ->withCookie('courseUnits',$enrroled_UCS);
                }
                else {
                    return response()->json("Unauthorized.", Response::HTTP_UNAUTHORIZED);
                }
            }
            else {
                //TODO change to the correct webservice and fix docente exists validation
                //Necessario teste pelo prof
                $user = User::where('email', 'like', "%$request->email%")->first();
                if(!$user) {
                    'https://www.dei.estg.ipleiria.pt/servicos/projetos/get_turnos.php?anoletivo='. $selectedYear->code .'&username='. $request->email . '&formato=json';
                    $response = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo=' . $academicYearCode . '&login=' . $request->email . '&formato=json');
                    $docente_data = json_decode($response->body());
                    $user = User::create([
                        "email" => $request->email,
                        "name" => $request->email,
                        "enabled" => true,
                        "password" => "",
                    ]);
                    $docenteUcs = [];
                    foreach ($docente_data as $unit){
                        $courseUnit = CourseUnit::where('code', $unit->codigoUC)->where("academic_year_id",$activeYear)->first()->id;
                        if( !in_array($courseUnit, $docenteUcs)){
                            $docenteUcs[] = $courseUnit;
                            Log::channel('sync_test')->info($docenteUcs);
                        }
                    }
                    $user->courseUnits()->sync($docenteUcs);
                    $user->groups()->syncWithoutDetaching(Group::isTeacher()->get());
                    $user->save();
                }
            }
        }

        if (!$user->enabled) {
            return response()->json("Unauthorized.", Response::HTTP_UNAUTHORIZED);
        }

        $currentGroup = [
            'key' => $user->groups()->first()->id,
            'text' => $user->groups()->first()->code,
            'value' => $user->groups()->first()->name_pt
        ];
        $scopes =  $user->groups()->first()->permissions()->where('group_permissions.enabled', true)->groupBy('permissions.code')->pluck('permissions.code')->values()->toArray();
        $accessToken = $user->createToken('authToken', $scopes)->accessToken;
        $selectedYear = AcademicYear::where('selected', true)->first();
        if($selectedYear){
            $activeYear = $selectedYear->id;
        } else {
            $activeYear = 0;
        }

        $utils = new Utils();
        return response()->json([
            'user'          => new UserResource($user),
            'accessToken'   => $accessToken,
            'academicYear'  => $utils->getFullYearsAcademicYear($selectedYear ? $selectedYear->display : 0),
            'currentGroup'  =>$currentGroup
        ], Response::HTTP_OK)->withCookie('academic_year', $activeYear )->withCookie('selectedGroup',$user->groups()->first()->id);
    }


    public function logout(Request $request)
    {
        $group = Group::where('id', $request->cookie('selectedGroup'))->first()->code;
        if(str_contains($group,InitialGroups::STUDENT) && Auth::guard('api')->user()->groups->count() == 0){
            User::where('email', Auth::guard('api')->user()->email)->forceDelete();
        }

        Auth::guard('api')->user()->token()->revoke();
        Auth::guard('api')->user()->token()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}

