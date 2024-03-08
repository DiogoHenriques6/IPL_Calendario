<?php

namespace App\Http\Controllers\API;

use App\Filters\UserFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserPasswordRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\Admin\Edit\UserEditResource;
use App\Http\Resources\Admin\UserListResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index(UserFilters $filters)
    {
        $perPage = request('per_page', 10);
        return UserListResource::collection(User::filter($filters)->paginate($perPage));
    }

    public function store(Request $request)
    {
        //
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
}
