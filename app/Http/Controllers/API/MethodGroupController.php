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
use App\Http\Resources\MethodGroupListResource;
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
    public function index(Request $request, EpochType $epochType)
    {
        $courseUnit = CourseUnit::where('id', $request->courseUnitId)->first();

        $methods = MethodGroup::ofAcademicYear($request->cookie('academic_year'))->get();
//            ->where('evaluation_type_id', $epochType->id)->where('method_group_id', '!=', null)
//            ->join('epoch_type_method', 'epoch_type_method.method_id', '=', 'methods.id')
//            ->where('epoch_type_method.epoch_type_id', $request->epochTypeId)
//            ->join('course_unit_method', 'course_unit_method.method_id', '=', 'methods.id')
//            ->where('course_unit_method.course_unit_id', $request->courseUnitId)
//            ->get();
        return MethodGroupListResource::collection($methods);
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
        foreach ($request->methods as $method) {
            $selectedMethod= Method::where('id', $method['value'])->first();

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

    public function destroy(MethodGroup $methodGroup)
    {
        $methodGroup->methods()->update(['method_group_id' => null]);
        $methodGroup->delete();

        return response()->json("Grupo eliminado com sucesso!", Response::HTTP_OK);
    }

    /*public function update(CourseUnitGroupRequest $request, CourseUnitGroup $courseUnitGroup)
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
    }*/
}
