<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\CloneMethodRequest;
use App\Http\Requests\NewGroupMethodRequest;
use App\Http\Resources\Generic\CourseUnitSearchResource;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\CourseUnitGroup;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\Method;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewMethodRequest;
use App\Http\Requests\UpdateMethodRequest;
use App\Http\Resources\MethodResource;
use App\Models\UnitLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MethodController extends Controller
{

    public function index()
    {
        return MethodResource::collection(Method::all());
    }

    /*
     * Save only methods for single Course Units
     */
    public function store(NewMethodRequest $request)
    {
        // search course unit
        $courseUnit = CourseUnit::find($request->methods[0]['course_unit_id']);

        foreach ($request->methods as $method) {
            $newMethod = new Method($method);
            $newMethod->academic_year_id = $request->cookie('academic_year');
            if (array_key_exists('id', $method)) {
                $newMethod = Method::find($method['id']);
                $newMethod->fill($method);
            }

            $newMethod->save();
            $newMethod->epochType()->syncWithoutDetaching($method['epoch_type_id']);
            $newMethod->courseUnits()->syncWithoutDetaching($courseUnit);
            $newMethod->save();
//            LOG::channel("sync_test")->info("New Method EPOCH: " .$newMethod->epochType()->get());
//            LOG::channel("sync_test")->info("New Method Course Unit: " .$newMethod->courseUnits()->get());
        }

        foreach ($request->removed as $removedMethod) {
            $this->destroy(Method::find($removedMethod));
        }

        UnitLog::create([
            "course_unit_id"    => $courseUnit->id,
            "user_id"           => Auth::id(),
            "description"       => "Metodos de avaliacao alterados por '" . Auth::user()->name . "'."
        ]);

        return response()->json("Created/Updated!", Response::HTTP_OK);
    }

    /*
     * Save only methods for grouped Course Units
     */
    public function storeGroups(NewGroupMethodRequest $request)
    {
        // search course unit
        $courseUnitGroup = CourseUnitGroup::find($request->methods[0]['course_unit_group_id']);

        $groupCourseUnits = $courseUnitGroup->courseUnits()->get();

        $academicYear = $request->cookie('academic_year');

        foreach ($request->methods as $method) {
            $newMethod = new Method($method);
            $newMethod->academic_year_id = $academicYear;
            if (array_key_exists('id', $method)) {
                $newMethod = Method::find($method['id']);
                $newMethod->fill($method);
            }
            $newMethod->save();
            foreach ($groupCourseUnits as $groupCourseUnit) {
                $newMethod->epochType()->syncWithoutDetaching($method['epoch_type_id']);
                $newMethod->courseUnits()->syncWithoutDetaching($groupCourseUnit);
                $newMethod->save();
            }
        }

        foreach ($request->removed as $removedMethod) {
            $this->destroy(Method::find($removedMethod));
        }

        UnitLog::create([
            "course_unit_group_id"  => $courseUnitGroup->id,
            "user_id"               => Auth::id(),
            "description"           => "Metodos de avaliacao alterados por '" . Auth::user()->name . "'."
        ]);

        return response()->json("Created/Updated!", Response::HTTP_OK);
    }

    public function show(Method $method)
    {
        return new MethodResource($method);
    }

    public function update(UpdateMethodRequest $request, Method $method)
    {
        $method->update($request->all());
    }


    public function methodsToCopy(Request $request){
        $currentGroup = Group::where('id', $request->cookie("selectedGroup"))->first();
        $courseUnits = CourseUnit::has('methods')->ofAcademicYear($request->year);
        $schoolId = null;
        $courseId = null;
        switch ($currentGroup->code) {
            case str_contains($currentGroup->code, InitialGroups::ADMIN):
            case str_contains($currentGroup->code, InitialGroups::SUPER_ADMIN):
                break;
            case str_contains($currentGroup->code, InitialGroups::GOP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->gopSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::BOARD):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->boardSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Course::where('coordinator_user_id', Auth::user()->id)->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::RESPONSIBLE):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseUnits = CourseUnit::where('responsible_user_id', Auth::user()->id);
                break;
            default:
                return response()->json("No permissions!", Response::HTTP_UNAUTHORIZED);
        }

        if ($schoolId != null) {
            if(count($schoolId) > 0) {
                $courses = Course::where('school_id', $schoolId)->pluck('id');
                $courseUnits->whereIn('course_id', $courses);
            }
        }

        if ($courseId != null) {
            $courseUnits->whereIn('course_id', $courseId);
        }
        return CourseUnitSearchResource::collection($courseUnits->limit(20)->get());
    }

    public function methodsClone(CloneMethodRequest $request){
        foreach ($request->removed as $removedMethod) {
            $this->destroy(Method::find($removedMethod));
        }
        return $this->cloneMethod($request->copy_course_unit_id, $request->new_course_unit_id, $request->cookie('academic_year'));
    }

    public function methodsCloneGrouped(Request $request){
        foreach ($request->removed as $removedMethod) {
            $this->destroy(Method::find($removedMethod));
        }
        // search course unit
        $courseUnitGroup = CourseUnitGroup::find($request->course_unit_group_id);
        $groupCourseUnits = $courseUnitGroup->courseUnits()->get();

        return $this->cloneMethod($request->copy_course_unit_id, null, $request->cookie('academic_year'),    $groupCourseUnits, $courseUnitGroup->id);
    }

    private function cloneMethod($old_course_unit_id, $new_course_unit_id, $academic_year_id, $grouped = null, $group_id = null)
    {
        // search course unit
        $copyCourseUnit = CourseUnit::find($old_course_unit_id);
        if(!$grouped) {
            $courseUnit = CourseUnit::find($new_course_unit_id);
        }
        foreach ($copyCourseUnit->methods as $method) {
            $newMethod = $method->replicate()->fill([
                'academic_year_id'  => $academic_year_id,
                'created_at'        => null,
                'updated_at'        => null
            ]);
            $newMethod->save();

            $newMethod->epochType()->syncWithoutDetaching($method->epochType->first()->id);
            if($grouped) {
                foreach ($grouped as $groupCourseUnit) {
                    $newMethod->courseUnits()->syncWithoutDetaching($groupCourseUnit);
                    $newMethod->save();
                }
            } else {
                $newMethod->courseUnits()->sync($courseUnit);
                $newMethod->method_group_id = null;
                $newMethod->save();
            }
        }

        UnitLog::create([
            "course_unit_group_id"  => ($grouped ? $group_id : null),
            "course_unit_id"        => (!$grouped ? $courseUnit->id : null),
            "user_id"               => Auth::id(),
            "description"           => "Metodos de avaliacao copiados por '" . Auth::user()->name . "' da UC '" . $copyCourseUnit->name_pt . "'."
        ]);

        return response()->json("Created/Updated!", Response::HTTP_OK);
    }

    public function destroy(Method $method)
    {
        if (count($method->exams) > 0) {
            return response()->json("Existing exams for this method. Not allowed!", Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $method->delete();
    }
}
