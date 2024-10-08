<?php

namespace App\Http\Controllers\API;

use App\Models\InitialGroups;
use App\Filters\CourseUnitFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseUnitRequest;
use App\Http\Resources\Admin\Edit\CourseUnitEditResource;
use App\Http\Resources\Admin\LogsResource;
use App\Http\Resources\Generic\BranchSearchResource;
use App\Http\Resources\Generic\CourseUnitListResource;
use App\Http\Resources\Generic\CourseUnitSearchResource;
use App\Http\Resources\Generic\CourseUnitYearsResource;
use App\Http\Resources\Generic\EpochMethodResource;
use App\Http\Resources\Generic\TeacherResource;
use App\Http\Resources\MethodResource;
use App\Models\AcademicYear;
use App\Models\Calendar;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Epoch;
use App\Models\EpochType;
use App\Models\Group;
use App\Models\Method;
use App\Models\School;
use App\Models\Semester;
use App\Models\UnitLog;
use App\Models\User;
use App\Services\ExternalImports;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CourseUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, CourseUnitFilters $filters)
    {
        //TODO generalize for all groups, and define what can and cannot be done trough permissions
        $lang = (in_array($request->header("lang"), ["en", "pt"]) ? $request->header("lang") : "pt");
        $perPage = request('per_page', 20);
        $allUCs = request('show_all', false);

        $courseUnits = CourseUnit::with('methods')->filter($filters, $lang)->ofAcademicYear($request->cookie('academic_year'));

            $userId = Auth::user()->id;
            if(!$allUCs) {
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
                    case str_contains($currentGroup->code, InitialGroups::COMISSION_CCP):
//                Log::channel('sync_test')->info($currentGroup->code);
                        $courseId = Auth::user()->courses->pluck('id');
                        break;
                    case str_contains($currentGroup->code, InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                        $courseId = Course::where('coordinator_user_id', Auth::user()->id)->pluck('id');
                        break;
                    case str_contains($currentGroup->code, InitialGroups::RESPONSIBLE):
//                Log::channel('sync_test')->info($currentGroup->code);
                        $courseUnits = CourseUnit::where('responsible_user_id', Auth::user()->id);
                        break;
                    case str_contains($currentGroup->code, InitialGroups::TEACHER):
                        $courseUnits = CourseUnit::whereHas('teachers', function ($query) use ($userId) {
                            $query->where('users.id', $userId);
                        });
                        break;
                    case str_contains($currentGroup->code, InitialGroups::STUDENT):
                        if($request->hasCookie('courseUnits')){
                            $courseUnitsId = explode(",", $request->cookie('courseUnits'));
                            $courseUnits = CourseUnit::whereIn('id',$courseUnitsId);
                        }
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
            }
            if( request('semester') ){
                $courseUnits->where('semester_id', Semester::where('number', request('semester'))->first()->id);
            }
            $courseUnits = $courseUnits->orderBy('name_' . $lang)->paginate($perPage);
        return CourseUnitListResource::collection($courseUnits);
    }

    public function search(Request $request, CourseUnitFilters $filters)
    {
        $lang = (in_array($request->header("lang"), ["en", "pt"]) ? $request->header("lang") : "pt");
        $perPage = request('per_page', 20);

        $courseUnits = CourseUnit::filter($filters)->ofAcademicYear($request->cookie('academic_year'));

        $userId = Auth::user()->id;
        $currentGroupId = $request->cookie('selectedGroup');
        $currentGroup = Group::where('id', $currentGroupId)->first();

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
            case str_contains($currentGroup->code, InitialGroups::COMISSION_CCP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Auth::user()->courses->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                if($request->has_methods){
                    $schoolId = Course::where('coordinator_user_id', $userId)->pluck('school_id');
                    break;
                }
                $courseId = Course::where('coordinator_user_id', $userId)->pluck('id');
                break;
            case str_contains($currentGroup->code, InitialGroups::RESPONSIBLE):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseUnits = CourseUnit::where('responsible_user_id', $userId);
                break;
        }
        if ($request->has('all') && $request->all === "true") {
            if ($schoolId != null) {
                if(count($schoolId) > 0) {
                    $courses = Course::where('school_id', $schoolId)->pluck('id');
                    $courseUnits->whereIn('course_id', $courses);
                }
            }
            if ($courseId != null) {
                $courseUnits->whereIn('course_id', $courseId);
            }
            $courseUnits = $courseUnits->orderBy('name_' . $lang)->get();
        }
        else {
            if ($schoolId != null) {
                if(count($schoolId) > 0) {
                    $courses = Course::where('school_id', $schoolId)->pluck('id');
                    $courseUnits->whereIn('course_id', $courses);
                }
            }

            if ($courseId != null) {
                $courseUnits->whereIn('course_id', $courseId);
            }

            $courseUnits = $courseUnits->orderBy('name_' . $lang);
        }
        return CourseUnitSearchResource::collection( ( $perPage == "all" ? $courseUnits->get() : $courseUnits->paginate($perPage)));
    }

    public function years(Request $request){
        $years = CourseUnit::select('curricular_year as year')->distinct()->orderBy('year')->get();

        return CourseUnitYearsResource::collection($years);
    }
    /**
     * Store a newly created resource in storage.

    public function store(Request $request)
    {
        $academicYear = AcademicYear::find($request->cookie('academic_year'));
        $isImported = ExternalImports::importSingleUCFromWebService($academicYear->code, $request->input('school'), $request->input('uc'));
        if(!$isImported){
            return response()->json("Error!", Response::HTTP_CONFLICT);
        }

        $uc = CourseUnit::where("code", $request->input('uc'))->first();
        UnitLog::create([
            "course_unit_id"    => $uc->id,
            "user_id"           => Auth::id(),
            "description"       => "Unidade curricular criada por '" . Auth::user()->name . "'."
        ]);

        return response()->json($uc->id, Response::HTTP_CREATED);
    }


    /**
     * Store a newly created resource in storage.
     */

    public function refreshUc(CourseUnit $courseUnit)
    {
        $academicYear = AcademicYear::find($courseUnit->academic_year_id);
        $isImported = ExternalImports::importSingleUCFromWebService($academicYear->code, $courseUnit->course->school_id, $courseUnit->course->code, $courseUnit->code);
        if(!$isImported){
            return response()->json("Error!", Response::HTTP_CONFLICT);
        }

        $uc = CourseUnit::where("code", $courseUnit->code)->first();
        UnitLog::create([
            "course_unit_id"    => $uc->id,
            "user_id"           => Auth::id(),
            "description"       => "Unidade curricular atualizada com dados da API por '" . Auth::user()->name . "'."
        ]);

        return response()->json($uc->id, Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseUnit $courseUnit)
    {
        return new CourseUnitEditResource($courseUnit->load(['methods', 'responsibleUser']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseUnitRequest $request, CourseUnit $courseUnit)
    {
        $courseUnit->fill($request->all());
        $courseUnit->save();
        UnitLog::create([
            "course_unit_id"    => $courseUnit->id,
            "user_id"           => Auth::id(),
            "description"       => "Unidade curricular atualizada por '" . Auth::user()->name . "'."
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, CourseUnit $courseUnit)
    {
        $courseUnit->academicYears()->detach($request->cookie('academic_year'));
    }


    /******************************************
     *             RELATIONS CALLS
     *  - Branches
     *  - Teachers
     *  - Methods
     *  - Logs
     ******************************************/

    /**
     * List branches for the COURSE of the unit
     */
    public function branches(CourseUnit $courseUnit)
    {
        return  BranchSearchResource::collection($courseUnit->course->branches);
    }


    /**
     * List teachers associated to the unit
     */
    public function teachers(CourseUnit $courseUnit)
    {
        $teachers = $courseUnit->teachers;
        $responsible_id = $courseUnit->responsible_user_id;
        foreach ($teachers as $teacher){
            $teacher['isResponsible'] = $teacher->id == $responsible_id;
        }
        return  TeacherResource::collection($teachers);
    }

    public function addTeacher(Request $request, CourseUnit $courseUnit)
    {
        //TODO CHAHGE LDAP TO WEBSERVICE
        $teacherUser = User::where('email', $request->teacher)->first();

        $user = $teacherUser;

        if (!$user->groups()->isTeacher()->exists()) {
            $user->groups()->syncWithoutDetaching(Group::isTeacher()->get());
        }

        $teachersForCourseUnit[] = $user->id;

        $courseUnit->teachers()->syncWithoutDetaching($teachersForCourseUnit);
        $courseUnit->save();
        UnitLog::create([
            "course_unit_id"    => $courseUnit->id,
            "user_id"           => Auth::id(),
            "description"       => "Professor '$user->email' adicionado nesta Unidade curricular por '" . Auth::user()->name . "'."
        ]);
        return response()->json("user added", Response::HTTP_OK);
    }

    public function removeTeacher(CourseUnit $courseUnit, int $teacher)
    {
        $teacherUser = User::find($teacher);
        if (is_null($teacherUser)) {
            return response()->json("user not found locally", Response::HTTP_BAD_REQUEST);
        }
        $courseUnit->teachers()->detach($teacherUser->id);
        $courseUnit->save();

        UnitLog::create([
            "course_unit_id"    => $courseUnit->id,
            "user_id"           => Auth::id(),
            "description"       => "Professor '$teacherUser->email' removido nesta Unidade curricular por '" . Auth::user()->name . "'."
        ]);
        return response()->json("user removed", Response::HTTP_OK);
    }

    /* Assign responsible for the Curricular Unit */
    public function assignResponsible(Request $request, CourseUnit $courseUnit)
    {
        $user = User::find($request->responsible_teacher);
        if ($user->groups()->responsible()->count() == 0) {
            $user->groups()->syncWithoutDetaching(Group::responsible()->get());
        }
        $courseUnit->responsibleUser()->associate($user);
        $courseUnit->save();

        UnitLog::create([
            "course_unit_id"    => $courseUnit->id,
            "user_id"           => Auth::id(),
            "description"       => "Professor responsavel por esta Unidade curricular alterado para '$user->email' por '" . Auth::user()->name . "'."
        ]);
    }


    /**
     * List methods associated to the unit
     */
    //todo -DONE!? - check if this is the correct way to get the methods for the course unit
    public function methodsForCourseUnit(CourseUnit $courseUnit, Request $request)
    {
        $epochTypesList = EpochType::all();
        // Create a new collection from the array of epoch types
        $newCollection = collect($epochTypesList);

        $yearId = $request->cookie('academic_year');
        $courseUnitId = $courseUnit->id;

        $newCollection->transform(function ($item, $key) use ($request, $yearId, $courseUnitId) {
            $methods = Method::ofAcademicYear($yearId)
                ->join('epoch_type_method', 'epoch_type_method.method_id', '=', 'methods.id')
                ->where('epoch_type_method.epoch_type_id', $item['id'])
                ->join('course_unit_method', 'course_unit_method.method_id', '=', 'methods.id')
                ->where('course_unit_method.course_unit_id', $courseUnitId)
                ->get();

            // Construct the updated item
            $name = ($request->header("lang") == "en" ? $item['name_en'] : $item['name_pt']);

            $updatedItem = [
                'id' => $item['id'],
                'name_pt' => $item['name_pt'],
                'name_en' => $item['name_en'],
                'methods' => MethodResource::collection($methods),
            ];

            return $updatedItem;
        });
        return $newCollection->all();
    }

    public function methodsByEpoch(CourseUnit $courseUnit, EpochType $epochType, Request $request){
        $epochTypeId = $epochType->id;
        $courseUnitId = $courseUnit->id;
        $methods = Method::ofAcademicYear($request->cookie('academic_year'))
            ->join('epoch_type_method', 'epoch_type_method.method_id', '=', 'methods.id')
            ->where('epoch_type_method.epoch_type_id', $epochTypeId)
            ->join('course_unit_method', 'course_unit_method.method_id', '=', 'methods.id')
            ->where('course_unit_method.course_unit_id', $courseUnitId)
            ->get();

        $methodsByEpoch = [
            'id' => $epochType->id,
            'name_pt' => $epochType->name_pt,
            'name_en' => $epochType->name_en,
            'methods' => MethodResource::collection($methods),
        ];

        return $methodsByEpoch;
    }

    public function epochsForCourseUnit(CourseUnit $courseUnit)
    {
        $availableCalendarsForCourseUnit = Calendar::where('course_id', $courseUnit->course_id)->whereIn('semester_id', [$courseUnit->semester_id, 3])->get()->pluck('id');
        $epochs = Epoch::whereIn('calendar_id', $availableCalendarsForCourseUnit)->groupBy(['epoch_type_id', 'name'])->get(['epoch_type_id', 'name']);

        return response()->json($epochs);
    }

    /**
     * List logs associated to the unit
     */
    public function logs(CourseUnit $courseUnit)
    {
        return  LogsResource::collection($courseUnit->log);
    }
}
