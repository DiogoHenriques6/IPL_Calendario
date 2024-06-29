<?php

namespace App\Http\Controllers\API;

use App\Filters\UserFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateStudentRequest;
use App\Http\Requests\UserPasswordRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\Admin\Edit\UserEditResource;
use App\Http\Resources\Admin\UserListResource;
use App\Models\AcademicYear;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    public function index(UserFilters $filters)
    {
        $perPage = request('per_page', 10);
        return UserListResource::collection(User::filter($filters)->paginate($perPage));
    }

    public function store(CreateStudentRequest $request)
    {
        $email= $request->name . "@my.ipleiria.pt";
        $user = User::firstorcreate(
            [
                'email' => $email,
                'name' => $request->name,
                'password' => '',
                'enabled' => true
            ]
        );

        if($request->groups){
            $groups =Group::whereIn('id',$request->groups)->get();
        }
        else{
            $groups = Group::isStudent()->get();
        }
        $user->groups()->sync($groups);
    }

    public function show($id)
    {
        return new UserEditResource(User::with('groups')->find($id));
    }

    public function update(UserRequest $request, User $user)
    {
        $user->fill($request->all());
        $user->groups()->sync($request->get('groups'));
        $user->save();
    }

    public function password(UserPasswordRequest $request, User $user)
    {
        if (!Hash::check($request->input('old'), $user->password)) {
            $error = [
                "message" => "A password antiga não está correta.",
                "errors" => [
                    "old" => "A password antiga não está correta."
                ]
            ];
            return response()->json($error, Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $user->password = Hash::make($request->new);
        $user->save();

        return response()->json("Updated!", Response::HTTP_OK);
    }

    public function destroy($id)
    {
        //
    }

    public function searchStaff(Request $request)
    {
        $search = $request->input('q');
//        $users = User::where('name', 'like', "%$search%")->orWhere('email', 'like', "%$search%")->limit(30)->get();
        $users = User::whereHas('groups', function ($query) {
            $query->where('code', '!=', 'student');
        })->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
        })->limit(30)->get();
        if($users->isEmpty()){
            $request = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_docentes_dep.php?login='.$search .'&formato=json');
//            TODO Verify if no more information is necessary when creating the new staff
            if($request->successful()) {
                $apiUsers = json_decode($request->body());
                $users = [];
                foreach ($apiUsers as $apiUser) {
                    // Create user in database if they don't exist
                    $user = User::firstorcreate(
                        [
                            'email' => $apiUser->email,
                            'name' => strtok($apiUser->email, '@'),
                            'password' => ''
                        ]
                    );
//                    $user = User::where('name', 'like', "%$search%")->orWhere('email', 'like', "%$search%")->limit(30)->get();
                    $user->groups()->syncWithoutDetaching(Group::isTeacher()->get());
                    $users[] = $user;
                }
            }
            //TODO fix none existing user in DB
            //criar user na BD e devolver o user ( não teria UCs associadas nem curso)
            //problema ao fazer o login pela primeira vez conta já está criada entao (sync feito inicialmente) se for criada não tem dados iniciados
            //nao vao ser importados os dados relacionados às UCs que leciona
            //problema fazer isso aqui demora demasiado tempo para uma simples resposta de pesquisa pode ser resolvido com jobs
            //se nao for selecionado o user é criado na mm
//                ProcessNewAcademicYear::dispatchAfterResponse($year->code, $semester);
        }
        return response()->json($users);
    }

    public function searchStudents(Request $request)
    {
        $search = $request->input('q');
        $users = User::where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
        })->limit(30)->get();
//        $users = User::where('name', 'like', "%$search%")->orWhere('email', 'like', "%$search%")->limit(30)->get();
//        Log::channel('sync_test')->info("Users bd",$users->toArray());
        if($users->isEmpty()){
            Log::channel('sync_test')->info("HEREEEEEEEEEEE");
            //TODO: get students from DEI API only works with complete number
            $academicYear= AcademicYear::where('selected', true)->first();
            $academicYearCode = substr($academicYear->code,0,4). "/" .substr($academicYear->code,4,6);
            $request = Http::get('https://www.dei.estg.ipleiria.pt/servicos/projetos/get_curso_aluno.php?anoletivo='.$academicYearCode.'&num_aluno='.$search .'&formato=json');

            if($request->successful()) {
                $users = json_decode($request->body());
            }
        }
        return response()->json($users);
    }


}
