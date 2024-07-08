<?php

namespace App\Http\Controllers\API;

use App\Filters\CourseUnitGroupFilters;
use App\Http\Controllers\API\LdapController;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseUnitGroupRequest;
use App\Http\Requests\MethodGroupRequest;
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
        Log::channel('sync_test')->info('methodsByCourseUnit' . $request->epochTypeId);
        $methods = MethodGroup::ofAcademicYear($request->cookie('academic_year'))

            ->join('methods', 'methods.method_group_id', '=', 'method_groups.id')
            ->join('course_unit_method', 'course_unit_method.method_id', '=', 'methods.id')
            ->where('course_unit_method.course_unit_id', $request->courseUnitId)
            ->join('epoch_type_method', 'epoch_type_method.method_id', '=', 'methods.id')
            ->where('epoch_type_method.epoch_type_id', $request->epochTypeId)
            ->select('method_groups.*')
            ->distinct()
            ->get();

        return MethodGroupListResource::collection($methods);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(MethodGroupRequest $request)
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

        return response()->json($newMethodGroup, Response::HTTP_CREATED);
    }

    public function update(MethodGroup $methodGroup, MethodGroupRequest $request){
        $currentMethods = $methodGroup->methods()->get();

        $requestedMethodIds = array_column($request->methods, 'value');
        //foreah methods if method not in request, remove group id

        $methodsToAdd = Method::whereIn('id', $requestedMethodIds)->get();

        $methodsToGroup = [];
        foreach ($methodsToAdd as $method) {
            if ($method->method_group_id !== null && $method->method_group_id !== $methodGroup->id) {
                return response()->json("Método já associado a um grupo!", Response::HTTP_NO_CONTENT);
            }
            $methodsToGroup[] = $method;
        }

        $methodsToRemove = $currentMethods->filter(function($method) use ($requestedMethodIds) {
            return !in_array($method->id, $requestedMethodIds);
        });

        foreach ($methodsToRemove as $method) {
            $method->method_group_id = null;
            $method->save();
        }

        foreach ($methodsToGroup as $method) {
            $method->method_group_id = $methodGroup->id;
            $method->save();
        }

        return response()->json($methodGroup, Response::HTTP_OK);
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
}
