<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\Generic\UserResource;
use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\Group;
use App\Utils\Utils;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
            'mail' => $request->email,
            'password' => $request->password,
            'fallback' => [
                'email' => $request->email,
                'password' => $request->password,
            ],
        ];
    }

    public function login(LoginRequest $request)
    {
        Log::channel('users_login')->info('Login requested: [ Email: ' . $request->email . ' ]');
        if (Auth::attempt($this->credentials($request))) {
            $user = Auth::user();
            $user->refresh();
            if (!$user->enabled) {
                return response()->json("Unauthorized.", Response::HTTP_UNAUTHORIZED);
            }

            $isServer = env('APP_SERVER', false);
            if($isServer) {
                if (isset($user->ldap)) {
                    $groups = $user->ldap->title;
                    foreach ($groups as $group) {
                        $bdGroup = Group::where('name_pt', $group)->first();
                        if ($bdGroup) {
                            $user->groups()->syncWithoutDetaching([$bdGroup->id]);
                        }

                        if (strtolower($group) === strtolower(InitialGroupsLdap::STUDENT)) {
                            $academicYearId = AcademicYear::selected()->first()->id;
                            foreach ($user->ldap->departmentnumber as $course) {
                                $bdCourse = Course::where('code', $course)->where("academic_year_id", $academicYearId)->first();
                                if ($bdCourse) {
                                    $user->courses()->syncWithoutDetaching([$bdCourse->id]);
                                }
                            }
                        }
                    }
                }
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
        } else {
            return response()->json("Unauthorized.", Response::HTTP_UNAUTHORIZED);
        }
    }

    public function logout()
    {
        Auth::guard('api')->user()->token()->revoke();
        Auth::guard('api')->user()->token()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    /**
     * GET utilizador autenticado
     */
//    public function user(Request $request) {
//        $User = $request->user();
//        return new UtilizadorAutenticadoResource($User);
//    }
}
