<?php

namespace App\Http\Controllers;

use App\Http\Requests\SchoolRequest;
use App\Http\Resources\Admin\Edit\SchoolEditResource;
use App\Http\Resources\Admin\SchoolResource;
use App\Http\Resources\Generic\SchoolListResource;
use App\Models\School;

class SchoolController extends Controller
{
    public function index()
    {
        return SchoolResource::collection(School::all());
    }

    public function listDropdown()
    {
        return SchoolListResource::collection(School::all());
    }

    public function show(School $school)
    {
        return new SchoolEditResource($school);
    }

    public function update(SchoolRequest $request, School $school)
    {
        $school->fill($request->all());
        $school->save();
    }

    public function store(SchoolRequest $request)
    {
        $request->validated();
        $school = new School();
        $school->fill($request->all());
        $school->save();
    }


    public function destroy($id)
    {
        //
    }
}
