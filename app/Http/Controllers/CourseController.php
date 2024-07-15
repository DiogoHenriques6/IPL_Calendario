<?php

namespace App\Http\Controllers;

use App\Filters\CourseFilters;
use App\Http\Controllers\API\MethodController;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\Generic\CourseFullDetailResource;
use App\Http\Resources\Generic\CourseListResource;
use App\Http\Resources\Generic\CourseSearchListResource;
use App\Http\Resources\Generic\BranchesResource;
use App\Http\Resources\Generic\CourseResource;
use App\Http\Resources\Generic\CourseUnitListResource;
use App\Http\Resources\Generic\UserSearchResource;
use App\Models\AcademicYear;
use App\Models\Branch;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\UnitLog;
use App\Models\User;
use App\Services\DegreesUtil;
use App\Utils\Utils;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use function PHPUnit\Framework\isEmpty;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, CourseFilters $filters)
    {
        //TODO validate for all groups, and define what can and cannot be done trough permissions
        $perPage = request('per_page', 10);
        $utils = new Utils();
        $courseList = Course::with('school')->ofAcademicYear($utils->getCurrentAcademicYear($request));
        $currentGroupId = request()->cookie('selectedGroup');
        $currentGroup = Group::where('id', $currentGroupId)->first();
//        LOG::channel('sync_test')->info("Group: " . $currentGroup->code);
        $schoolId = null;
        $courseId = null;
        switch ($currentGroup->code) {
            case str_contains($currentGroup->code, InitialGroups::GOP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->gopSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::BOARD):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->boardSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::PEDAGOGIC):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->pedagogicSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::COMISSION_CCP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Auth::user()->courses->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Course::where('coordinator_user_id', Auth::user()->id)->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::RESPONSIBLE):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = CourseUnit::where('responsible_user_id',Auth::user()->id)->pluck('course_id');
                break;
            case str_contains($currentGroup->code,InitialGroups::TEACHER):
                $courseId = CourseUnit::whereHas('teachers', function($query){
                    $query->where('user_id', Auth::user()->id);
                })->pluck('course_id');
                break;
            case str_contains($currentGroup->code,InitialGroups::STUDENT):
                if($request->hasCookie('courseUnits')){
                    $courseUnits = explode(",", $request->cookie('courseUnits'));
                    $courseId = CourseUnit::whereIn('id',$courseUnits)->pluck('course_id');
                }
        }

        if($schoolId != null){
            if(count($schoolId) > 0){
                $courseList->whereIn('school_id', $schoolId);
            }
        }

        if($courseId != null){
            $courseList->whereIn('id', $courseId);
        }


        //filters for courses
        if( request('school') ){
            $courseList->where('school_id', request('school'));
        }
        if( request('degree') && !$request->has('without-degrees')){
            $courseList->where('degree', (request('degree') == "no-degree" ? "" : request('degree')));
        }
        if(request('degree', "") != "no-degree"){
            // remove courses that have no degree associated, unless requested
            $courseList->where('degree', (request('without-degrees', '') == '' ? '<>' : '='), '');
        }

        $courseList->filter($filters);
        return CourseListResource::collection( ( $perPage == "all" ? $courseList->get() : $courseList->paginate($perPage) ) );
    }

/**
* Display a listing of the resource.
*/
    public function search(Request $request, CourseFilters $filters)
    {
        $utils = new Utils();
        $courseList = Course::filter($filters)->ofAcademicYear($utils->getCurrentAcademicYear($request))->where('degree', '<>', '');
        $hasSearch = false;
        if($request->has('search')) {
            $hasSearch = true;
            $courseList->filter($filters);
        }
        $currentGroup = Group::where('id', request()->cookie('selectedGroup'))->first();
        $schoolId = null;
        $courseId = null;
        switch ($currentGroup->code) {
            case str_contains($currentGroup->code, InitialGroups::GOP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->gopSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::BOARD):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->boardSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::PEDAGOGIC):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->pedagogicSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::COMISSION_CCP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = Auth::user()->courses->pluck('school_id');
                break;
            case str_contains($currentGroup->code,InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = Course::where('coordinator_user_id', Auth::user()->id)->pluck('school_id');
                break;
        }
        if($schoolId != null){
            if(count($schoolId) > 0){
                $courseList->whereIn('school_id', $schoolId);
            }
        }
        if($request->has('include')) {
            $courseList->orWhere('id', $request->get('include'))->orderByRaw('case when id = ' . $request->get('include') . ' then 0 else 1 end, id');
        }
        //dd($courseList->toSql());
        return CourseSearchListResource::collection(($hasSearch ? $courseList->get() : $courseList->limit(15)->get()));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     */
    public function show(Course $course)
    {
        return new CourseResource($course);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     */
    public function showFull(Course $course)
    {
        return new CourseFullDetailResource($course);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     */
    public function update(CourseRequest $request, Course $course)
    {
        $course->fill($request->all());

        if ($request->has('coordinator_user_id')) {
            $this->assignCoordinatorUserToCourse($request->coordinator_user_id, $course);
        }
        $course->save();
    }

    public function copyAllCourseMethods(Course $course, Request $request)
    {
        //TODO FUTURE WORK SEE IF IT SHOULD RECREATE THE GROUPED UCs AS WELL
        $course->courseUnits();
        $currentAcademicYear = $request->cookie('academic_year');
        $previousAcademicYear = AcademicYear::where('code', $request->prevYear)->where('active',1)
            ->where('s1_sync_last', '!=', null)->where('s2_sync_last', '!=', null)->first();
        if($previousAcademicYear == null){
            return response()->json(`No records of the year $request->prevYear!`, Response::HTTP_BAD_REQUEST);
        }
        $courseToCopy = Course::ofAcademicYear($previousAcademicYear->id)->where('code', $course->code)->first();

        $oldUCs = $courseToCopy->courseUnits()->get();
        $newUCs = $course->courseUnits()->pluck('code');
        Log::channel("sync_test")->info("Old" . $oldUCs);
        Log::channel("sync_test")->info("New" . $newUCs);
        foreach($oldUCs as $oldUC){
            $newUC= CourseUnit::ofAcademicYear($previousAcademicYear->id)->where('code',$oldUC->code)->orWhere('name_pt',$oldUC->name_pt)->first();
            //TODO Check if exists defined methods
            foreach ($oldUC->methods as $method) {
                $newMethod = $method->replicate()->fill([
                    'academic_year_id'  => $currentAcademicYear,
                    'created_at'        => null,
                    'updated_at'        => null
                ]);
                $newMethod->save();

                $newMethod->epochType()->syncWithoutDetaching($method->epochType->first()->id);
                $newMethod->courseUnits()->sync($newUCs);
                $newMethod->method_group_id = null;
                $newMethod->save();
            }
            Log::channel("sync_test")->info($newUC->id);
            UnitLog::create([
                "course_unit_id"        => ($newUC->id),
                "user_id"               => Auth::id(),
                "description"           => "Metodos de avaliacao copiados por '" . Auth::user()->name . "' da UC '" . $oldUC->name_pt . "'."
            ]);
        }
    }



    public function assignCoordinator(Request $request, Course $course) {
        $coordinatorUser = User::where('email', $request->coordinator_user_email)->first();
        if(isset($course->coordinator_user_id)){
            if( Course::where('coordinator_user_id', $course->coordinator_user_id)->pluck('id')->count() <= 1){
                 User::where('id',$course->coordinator_user_id)->first()->groups()->detach(Group::coordinator()->get());
            }
        }
        $this->assignCoordinatorUserToCourse($coordinatorUser->id, $course);
        $course->coordinator_user_id = $coordinatorUser->id;
        $course->save();
        return response()->json($coordinatorUser->groups()->get(), Response::HTTP_OK);
    }

    private function assignCoordinatorUserToCourse($user, $course)
    {
        if (isset($user)) {
            $coordinatorUser = User::find($user);
            $hasCoordinatorGroup = $coordinatorUser->groups()->coordinator()->count() > 0;
            if (!$hasCoordinatorGroup) {
                $coordinatorUser->groups()->syncWithoutDetaching(Group::coordinator()->get());
            }
            $course->coordinatorUser()->associate($coordinatorUser);
        } else {
            $course->coordinatorUser()->associate(null);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Course $course)
    {
        if ($request->hasCookie('academic_year')) {
            $academicYear = AcademicYear::findOrFail($request->cookie('academic_year'));

            $calendarsOfCourse = Course::ofAcademicYear($academicYear->id)->where('id', $course->id)->first()->calendars()->delete();

            $course->academicYears()->detach($academicYear->id);
            $count = Course::whereHas('academicYears', function (Builder $query) use($course) {
                $query->where('course_id', $course->id);
            })->count();

            if ($count == 0) {
                $course->delete();
            }
        } else {
            return response()->json("The academic year is not being passed!", Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /*
     * List Degrees Logic
     * TODO: move this code to other place
     */

    public function listDegrees(Request $request)
    {
        return response()->json(DegreesUtil::getDegreesList($request->header("lang")), Response::HTTP_OK);
    }

    /*
     * Students Logic
     * TODO: move this code to other place
     */
    public function getMembersCCP(Course $course)
    {
        return UserSearchResource::collection($course->courseMembersCCP()->get());
    }

    public function addMemberCCP(Request $request, Course $course) {
        $ccpMember = User::where('email', $request->user_email)->first();

        if (is_null($ccpMember)) {
            $ccpMember = User::create([
                "email" => $request->user_email,
                "name" => $request->user_name,
                "password" => "",
            ]);
        }

        if ($ccpMember->groups()->isCCP()->get()->count() == 0) {
            $ccpMember->groups()->syncWithoutDetaching(Group::isCCP()->get());
        }
        $ccpMember->courses()->syncWithoutDetaching($course->id);
    }

    public function removeMemberCCP(Course $course, User $ccp) {
        $ccp->courses()->detach($course->id);
        if($ccp->courses()->count() == 0){
            $ccp->groups()->detach(Group::isCCP()->get());
        }
        return $ccp->groups()->get();
    }

    /*
     * Units Logic
     * TODO: move this code to other place
     */
    public function getUnits(Course $course){
        return CourseUnitListResource::collection($course->courseUnits()->get());
    }

    public function addUnit(Course $course){
        // TODO - maybe add later this from the course detail
        return response()->json("Unit added", Response::HTTP_OK);
    }

    public function removeUnit(Course $course){
        // TODO - maybe add later this from the course detail
        return response()->json("Unit removed", Response::HTTP_OK);
    }


    /*
     * Branches Logic
     * TODO: move this code to other place
     */
    public function branchesList(Course $course)
    {
        return BranchesResource::collection($course->branches()->get());
    }

    public function branchAdd(Request $request, Course $course){
        if( empty($request->name_pt) || empty($request->initials_pt) || empty($request->name_en) || empty($request->initials_en) ){
            return response()->json("Values not defined", Response::HTTP_BAD_REQUEST);
        }
        $this->createOrUpdateSingleBranch(
            [
                "name_pt" => $request->name_pt,
                "initials_pt" => $request->initials_pt,
                "name_en" => $request->name_en,
                "initials_en" => $request->initials_en
            ], $course);

        return $this->branchesList($course);
    }

    private function createOrUpdateBranches($branches, $course)
    {
        if (isset($branches)) {

            $num_branchs = Branch::where('course_id', $course->id)
                ->where('academic_year_id', $course->academic_year_id)
                ->count();
            $number = $num_branchs > 0 ? $num_branchs : 0;
            $count = 0;
            foreach ($branches as $branch) {
                if (isset($branch->id)) {
                    $existingBranch = Branch::find($branch->id);
                    $existingBranch->update($branch);
                    $existingBranch->course()->associate($course);
                } else {
                    $newBranch = new Branch($branch);
                    $branch->branch_number = $number + $count;
                    $count++;
                    $newBranch->course()->associate($course);
                    $newBranch->save();
                }
            }
        }
    }

    private function createOrUpdateSingleBranch($branch, $course)
    {
        $num_branchs = Branch::where('course_id', $course->id)
                ->where('academic_year_id', $course->academic_year_id)
                ->count();
        $number = $num_branchs > 0 ? $num_branchs : 0;
        return Branch::firstOrCreate(
            [
                'course_id'         => $course->id,
                'academic_year_id'  => $course->academic_year_id,
                'name_pt'           => $branch['name_pt'],
                'name_en'           => $branch['name_en'],
                'initials_pt'       => $branch['initials_pt'],
                'initials_en'       => $branch['initials_en'],
                'branch_number'     => $number
            ]
        );
    }


    public function branchUpdate(Request $request, Course $course){
        if( empty($request->name_pt) || empty($request->initials_pt) || empty($request->name_en) || empty($request->initials_en) ){
            return response()->json("Values not defined", Response::HTTP_BAD_REQUEST);
        }
        $branch = Branch::findOrFail($request->id);

        $branch->name_pt        = $request->name_pt;
        $branch->initials_pt    = $request->initials_pt;
        $branch->name_en        = $request->name_en;
        $branch->initials_en    = $request->initials_en;
        $branch->save();

        return $this->branchesList($course);
    }

    public function deleteBranch(Course $course, Branch $branch) {
        $branch->delete();
        return $this->branchesList($course);
    }
}
