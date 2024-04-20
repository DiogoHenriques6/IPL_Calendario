<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\Generic\UserResource;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Group;
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
            if (Auth::attempt($this->credentials($request))) {
                $user = Auth::user();
                $user->refresh();
            }
            else
                return response()->json("Unauthorized.",Response::HTTP_UNAUTHORIZED);
        }
        else {
            //$user = User::where('email', 'like', "%$request->email%")->first();

            if(!$user = User::where('email', 'like', "%$request->email%")->first()){

                //has 9 numbers
                //change academicYearCode to 2023/24 format (change accordingly to the webservice argument)
                $academicYear= AcademicYear::where('selected', true)->first();
                $academicYearCode = substr($academicYear->code,0,4). "/" .substr($academicYear->code,4,6);
                if(preg_match('/[0-9]{7}/', $request->email)){
                    //TODO ANOTHER ISSUE, CHANGING THE SCHOOL YEAR, NEEDS TO REDOO THIS REQUESTS TO GET THE STUDENT COURSES FROM THE YEAR
                    //TODO problem if student enrroled in 2 or more courses only 1 is saved ... if we do a course enrroled request, we are waisting a lot of time
                    //            if(!$user = User::where('name', $request->email)->first()){

                    $response = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo='. $academicYearCode .'&num_aluno='.$request->email.'&formato=json');
                    Log::channel('sync_test')->info('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo='. $academicYearCode .'&num_aluno='.$request->email.'&formato=json');

                    $student_data = $response->body();
                    $student_units = json_decode($student_data);
                    $enrroled_courses = [];
                    $enrroled_UCS = [];
                    $user= User::create([
                        "email" => $request->email . '@my.ipleiria.pt',
                        "name" => $request->email,
                        "enabled" => true,
                        "password" => "",
                    ]);
                    if(!empty($student_units)){
                        foreach ($student_units as $unit){
                            if(!in_array($unit->CD_CURSO, $enrroled_courses)){
                                //get course where code is equal to $unit->CD_CURSO;
                                $enrroled_courses[] = Course::where('code', $unit->CD_CURSO)->first()->id;
                            }
                            if( !in_array($unit->CD_DISCIP, $enrroled_UCS)){
                                $enrroled_UCS[] = CourseUnit::where('code', $unit->CD_DISCIP)->first()->id;
                            }
                            //TODO add student to the course and units(need to change db for the last)
                        }

                        $user->courses()->sync($enrroled_courses);
//                            LOG::channel('sync_test')->info(json_encode($user->courses()->get()->toArray()));
                        $user->courseUnits()->sync($enrroled_UCS);
//                            LOG::channel('sync_test')->info(json_encode($user->courseUnits()->get()->toArray()));
                    }

                    $user->groups()->syncWithoutDetaching(Group::isStudent()->get());
                    $user->save();
                }
                else {
                    //TODO TEST, nao temos conta de docente para testar
                    $response = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo='. $academicYearCode .'&login='.$request->email.'&formato=json');
                    $docente_data = json_decode($response->body());
                    $user= User::create([
                        "email" => $docente_data->email,
                        "name" => $docente_data->nome,
                        "enabled" => true,
                        "password" => "",
                    ]);
                    $user->groups()->syncWithoutDetaching(Group::isTeacher()->get());
                    $user->save();
                }
            }
//            Log::channel('sync_test')->info($user);
        }


        if (!$user->enabled) {
            return response()->json("Unauthorized.", Response::HTTP_UNAUTHORIZED);
        }

        $scopes = $user->permissions()->where('group_permissions.enabled', true)->groupBy('permissions.code')->pluck('permissions.code')->values()->toArray();

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
            'academicYear'  => $utils->getFullYearsAcademicYear($selectedYear ? $selectedYear->display : 0)
        ], Response::HTTP_OK)->withCookie('academic_year', $activeYear);
    }

    public function getInscriçõesAluno(){
        $academicYear= AcademicYear::where('selected', true)->first();
        $response = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo='. $academicYear .'&num_aluno='.$request->email.'&formato=json');
        $response = json_decode($response->body());
        $user = User::create([
            "email" => $request->email . '@my.ipleiria.pt',
            "name" => $response->nome,
            "password" => "",
        ]);
        $user->groups()->attach(Group::where('name', InitialGroupsLdap::STUDENT)->first());
    }

    public function getDocentes(){

        $academicYear= AcademicYear::where('selected', true)->first();
        $response = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_inscricoes_aluno.php?anoletivo='. $academicYear .'&login='.$request->email.'&formato=json');
        $response = json_decode($response->body());
        $user = User::create([
            "email" => $request->email . '@my.ipleiria.pt',
            "name" => $response->nome,
            "password" => "",
        ]);
        $user->groups()->attach(Group::where('name', InitialGroupsLdap::TEACHER)->first());
    }

    public function logout()
    {
        Auth::guard('api')->user()->token()->revoke();
        Auth::guard('api')->user()->token()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}

