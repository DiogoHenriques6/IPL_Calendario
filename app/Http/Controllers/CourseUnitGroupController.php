<?php

namespace App\Http\Controllers;

use App\Filters\CourseUnitGroupFilters;
use App\Http\Controllers\API\LdapController;
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
use App\Models\UnitLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CourseUnitGroupController extends Controller
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
        // List for coordinator
        if ($user->groups->contains('code', InitialGroups::COORDINATOR)) {
            $list->whereHas("courseUnits.course", function ($query){
                $query->whereIn('course_id', Course::where('coordinator_user_id', Auth::user()->id)->pluck('id'));
            });
        }
        return CourseUnitGroupListResource::collection($list->paginate($perPage));
    }

    public function search(Request $request, CourseUnitGroupFilters $filters)
    {
        $list = CourseUnitGroup::filter($filters)->ofAcademicYear($request->cookie('academic_year'));

        $user = Auth::user();
        // List for coordinator
        if ($user->groups->contains('code', InitialGroups::COORDINATOR)) {
            $list->whereHas("courseUnits.course", function ($query){
                $query->whereIn('course_id', Course::where('coordinator_user_id', Auth::user()->id)->pluck('id'));
            });
        }
        return CourseUnitGroupSearchResource::collection($list->paginate(30));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CourseUnitGroupRequest $request)
    {
        // TODO quando ja existem metodos e adicionamos mais uma cadeira, adicionar os metodos a essa cadeira.
        // TODO mas validar se essa cadeira ja tem algum metodo, e devolver um erro. Para o utilizador saber o que fazer
        $existingMethodsForCourseUnits = 0;
        $existingMethods = null;
        foreach ($request->get('course_units') as $courseUnit) {
            $courseUnitEntity = CourseUnit::find($courseUnit);

            if (count($courseUnitEntity->methods) > 0) {
                $existingMethods = $courseUnitEntity->methods()->pluck('id');
                $existingMethodsForCourseUnits++;
            }
        }

        if ($existingMethodsForCourseUnits <= 1) {
            $newCourseUnitGroup = new CourseUnitGroup();
            $newCourseUnitGroup->description_pt = $request->get('description_pt');
            $newCourseUnitGroup->description_en = $request->get('description_en');
            $newCourseUnitGroup->academic_year_id = $request->cookie('academic_year');
            $newCourseUnitGroup->save();

            CourseUnit::where('course_unit_group_id', null)->whereIn('id', $request->get('course_units'))->update(['course_unit_group_id' => $newCourseUnitGroup->id]);

            return response()->json($newCourseUnitGroup->id, Response::HTTP_CREATED);
        }

        return response()->json("Existing methods for more than 1 course unit in the group!", Response::HTTP_UNPROCESSABLE_ENTITY);
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


    public function courses(CourseUnitGroup $courseUnitGroup)
    {
        //Course::with('course_unit_group_id', $courseUnitGroup->id)
        $courses = Course::whereHas("courseUnits.group", function ($query) use ($courseUnitGroup){
                $query->where('course_unit_group_id', $courseUnitGroup->id);
            })->get();

        return CourseListResource::collection($courses);
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


    /**
     * List teachers associated to the unit
     */
    public function teachers(CourseUnitGroup $courseUnitGroup)
    {
        $teachers = $courseUnitGroup->teachers;
        $responsible_id = $courseUnitGroup->responsible_user_id;
        foreach ($teachers as $teacher){
            $teacher['isResponsible'] = $teacher->id == $responsible_id;
        }
        return  TeacherResource::collection($teachers);
    }

    /**
     * List methods associated to the unit
     */
    public function methodsForCourseUnitGroup(CourseUnitGroup $courseUnitGroup, Request $request)
    {
        $epochTypesList = EpochType::all();
        $list = EpochMethodResource::collection($epochTypesList);
        $yearId = $request->cookie('academic_year');

        $courseUnit = $courseUnitGroup->courseUnits->first();
        $courseUnitId = $courseUnit->id;

        $newCollection = collect($list);

        $finalList = $newCollection->map(function ($item, $key) use ($yearId, $courseUnitId){
            $methods = Method::ofAcademicYear($yearId)
                ->join('epoch_type_method', 'epoch_type_method.method_id', '=', 'methods.id')
                ->where('epoch_type_method.epoch_type_id', $item['id'])
                ->join('course_unit_method', 'course_unit_method.method_id', '=', 'methods.id')
                ->where('course_unit_method.course_unit_id', $courseUnitId)
                ->get();
            //byCourseUnit($courseUnit->id)->byEpochType($epochType->id)->ofAcademicYear($yearId)->get();

            $item['methods'] = MethodResource::collection($methods);
            return $item;
        });

        return $finalList->all();
    }

    public function epochsForCourseUnit(CourseUnitGroup $courseUnitGroup)
    {
        // TODO
        $availableCalendarsForCourseUnit = Calendar::where('course_id', $courseUnit->course_id)->whereIn('semester_id', [$courseUnit->semester_id, 3])->get()->pluck('id');
        $epochs = Epoch::whereIn('calendar_id', $availableCalendarsForCourseUnit)->groupBy(['epoch_type_id', 'name'])->get(['epoch_type_id', 'name']);

        return response()->json($epochs);
    }

    /**
     * List logs associated to the unit
     */
    public function logs(CourseUnitGroup $courseUnitGroup)
    {
        return  LogsResource::collection($courseUnitGroup->log);
    }
}
