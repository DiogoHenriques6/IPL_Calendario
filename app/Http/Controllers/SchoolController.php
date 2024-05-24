<?php

namespace App\Http\Controllers;

use App\Http\Requests\SchoolRequest;
use App\Http\Resources\Admin\Edit\SchoolEditResource;
use App\Http\Resources\Admin\SchoolResource;
use App\Http\Resources\Generic\SchoolListResource;
use App\Models\School;
use App\Models\Webservice;

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
        $webservice = Webservice::where('id', 1)->first();
        return new SchoolEditResource($school, $webservice);
    }

    public function update(SchoolRequest $request, School $school)
    {
        $school->gop_group_id = $request->gop_group_id;
        $school->board_group_id = $request->board_group_id;
        $school->pedagogic_group_id = $request->pedagogic_group_id;
        $school->index_campus = $request->index_campus;
        $school->name_pt = $request->name_pt;
        $school->name_en = $request->name_en;
        $school->code = $request->code;
        $webservice = Webservice::where('id', 1)->first();
        $webservice->fill($request->all());
        $webservice->save();
        $school->save();
    }

    public function store(SchoolRequest $request)
{
    $school = new School();
    $school->gop_group_id = $request->gop_group_id;
    $school->board_group_id = $request->board_group_id;
    $school->pedagogic_group_id = $request->pedagogic_group_id;
    $school->index_campus = $request->index_campus;
    $school->name_pt = $request->name_pt;
    $school->name_en = $request->name_en;
    $school->code = $request->code;
    $webservice = Webservice::where('id', 1)->first();
    $webservice->fill($request->all());
    $webservice->save();
    $school->save();
}


    public function destroy($id)
    {
        //
    }
}
