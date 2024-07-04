<?php

namespace App\Http\Controllers\API;

use App\Filters\CourseUnitGroupFilters;
use App\Http\Controllers\API\LdapController;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseUnitGroupRequest;
use App\Http\Resources\Admin\CourseUnitGroupListResource;
use App\Http\Resources\Admin\Edit\CourseUnitGroupResource;
use App\Http\Resources\Admin\LogsResource;
use App\Http\Resources\Generic\CourseListResource;
use App\Http\Resources\Generic\CourseUnitGroupSearchResource;
use App\Http\Resources\Generic\EpochMethodResource;
use App\Http\Resources\Generic\TeacherResource;
use App\Http\Resources\MethodResource;
use App\Models\Calendar;
use App\Models\CalendarPhase;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\CourseUnitGroup;
use App\Models\Epoch;
use App\Models\EpochType;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\Method;
use App\Models\MethodGroup;
use App\Models\UnitLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MethodGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request, CourseUnitGroupFilters $filters)
    {
        $perPage = request('per_page', 20);
        $list = CourseUnitGroup::with('courseUnits')->filter($filters)->ofAcademicYear($request->cookie('academic_year'));

        $user = Auth::user();
        $currentUserId = $request->cookie('selectedGroup');
        $currentGroup = Group::where('id', $currentUserId)->first();


        $schoolId = null;
        $courseId = null;
        switch ($currentGroup->code) {
            case str_contains($currentGroup->code, InitialGroups::GOP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->gopSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::BOARD):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->boardSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::PEDAGOGIC):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->pedagogicSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Course::where('coordinator_user_id', Auth::user()->id)->pluck('id');
                break;
        }

        if ($schoolId) {
            $list->whereHas("courseUnits.course", function ($query) use ($schoolId){
                $query->whereIn('school_id', $schoolId);
            });
        }

        if ($courseId) {
            $list->whereHas("courseUnits.course", function ($query) use ($courseId){
                $query->whereIn('course_id', $courseId);
            });
        }
        return CourseUnitGroupListResource::collection($list->paginate($perPage));
    }

//    public function search(Request $request, CourseUnitGroupFilters $filters)
//    {
//        $list = CourseUnitGroup::filter($filters)->ofAcademicYear($request->cookie('academic_year'));
//
//        $user = Auth::user();
//        // List for coordinator
//        if ($user->groups->contains('code', InitialGroups::COORDINATOR)) {
//            $list->whereHas("courseUnits.course", function ($query){
//                $query->whereIn('course_id', Course::where('coordinator_user_id', Auth::user()->id)->pluck('id'));
//            });
//        }
//        return CourseUnitGroupSearchResource::collection($list->paginate(30));
//    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        foreach ($request->methods as $courseUnit => $method) {

            Log::channel('sync_test')->info($courseUnit);
            Log::channel('sync_test')->info($method);
            $selectedMethod= Method::where('id', $method)->first();

            if($selectedMethod->method_group_id != null){
                return response()->json("Método já associado a um grupo!", Response::HTTP_NO_CONTENT);
            }
            $methodsToGroup[] = $selectedMethod;

        }

        $newMethodGroup = new MethodGroup();
        $newMethodGroup->academic_year_id = $request->cookie('academic_year');
        $newMethodGroup->save();

        foreach ($methodsToGroup as $method) {
            $method->method_group_id = $newMethodGroup->id;
            $method->save();
        }

        return response()->json($methodsToGroup, Response::HTTP_CREATED);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */

    public function update(CourseUnitGroupRequest $request, CourseUnitGroup $courseUnitGroup)
    {
        $courseUnitGroup->description_pt = $request->get('description_pt');
        $courseUnitGroup->description_en = $request->get('description_en');
        $courseUnitGroup->save();

        // Get current course_units with methods
        $methodsId = $courseUnitGroup->courseUnits()->first()->methods()->pluck("id")->toArray();

        // Get current course_units ids
        $ucs = $courseUnitGroup->courseUnits()->pluck("id")->toArray();

        // get deleted ones
        $removing_ucs = array_diff($ucs, $request->get('course_units'));
        if(!empty($removing_ucs)){
            DB::table("course_unit_method")->whereIn("course_unit_id", $removing_ucs)->delete();

            $ucs_text = CourseUnit::select(DB::raw('CONCAT("(", code, ") ", name_pt) AS name'))->whereIn("id", $removing_ucs)->pluck("name");
            //implode(", ", $removing_ucs)
            UnitLog::create([
                "course_unit_group_id"  => $courseUnitGroup->id,
                "user_id"               => Auth::id(),
                "description"           => "Removidos métodos de avaliação á UCs '" . $ucs_text->join(', ', ' e ') . "' por '" . Auth::user()->name . "'."
            ]);
        }

        // get new ones
        $adding_ucs = array_diff($request->get('course_units'), $ucs);

        if(!empty($adding_ucs)){
            $newInserts = [];
            foreach ($adding_ucs as $uc) {
                foreach ($methodsId as $method) {
                    $newInserts[] = ["course_unit_id" => $uc, "method_id" => $method];
                }
            }
            DB::table("course_unit_method")->insert($newInserts);

            $ucs_text = CourseUnit::select(DB::raw('CONCAT("(", code, ") ", name_pt) AS name'))->whereIn("id", $adding_ucs)->pluck("name");
            //implode(", ", $adding_ucs)
            UnitLog::create([
                "course_unit_group_id"  => $courseUnitGroup->id,
                "user_id"               => Auth::id(),
                "description"           => "Adicionados métodos de avaliação á UCs '" . $ucs_text->join(', ', ' e ') . "' por '" . Auth::user()->name . "'."
            ]);
        }

        //update the "course_unit_group_id" field,  adding and removing course units
        CourseUnit::whereIn('id', $request->get('course_units'))->update(['course_unit_group_id' => $courseUnitGroup->id]);
        CourseUnit::whereNotIn('id', $request->get('course_units'))->where('course_unit_group_id', $courseUnitGroup->id)->update(['course_unit_group_id' => null]);


        return response()->json("Grupo atualizado", Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(CourseUnitGroup $courseUnitGroup)
    {
        return new CourseUnitGroupResource($courseUnitGroup->load('courseUnits'));
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CourseUnitGroup $courseUnitGroup)
    {
        $courseUnitGroup->delete();
    }
}
