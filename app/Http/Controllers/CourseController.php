<?php

namespace App\Http\Controllers;

use App\Filters\CourseFilters;
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
use App\Models\Group;
use App\Models\User;
use App\Services\DegreesUtil;
use App\Utils\Utils;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, CourseFilters $filters)
    {
        $perPage = request('per_page', 10);
        $utils = new Utils();
        $courseList = Course::with('school')->ofAcademicYear($utils->getCurrentAcademicYear($request));
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
        $courseList = Course::ofAcademicYear($utils->getCurrentAcademicYear($request))->where('degree', '<>', '');
        $hasSearch = false;
        if($request->has('search')) {
            $hasSearch = true;
            $courseList->filter($filters);
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

    public function assignCoordinator(Request $request, Course $course) {
        $coordinatorUser = User::where('email', $request->coordinator_user_email)->first();

        if (is_null($coordinatorUser)) {
            $newUser = new User([
                "email" => $request->coordinator_user_email,
                "name" => $request->coordinator_user_name,
                "password" => ""
            ]);
            $newUser->save();
            $this->assignCoordinatorUserToCourse($newUser->id, $course);
        }

        $course->coordinator_user_id = is_null($coordinatorUser) ? $newUser->id : $coordinatorUser->id;
        $course->save();
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
            /*foreach ($calendarsOfCourse as $calendar) {
                $calendar->delete();
            }*/

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
    public function getStudents(Course $course)
    {
        return UserSearchResource::collection($course->students()->get());
    }

    public function addStudent(Request $request, Course $course) {
        $student = User::where('email', $request->user_email)->first();

        if (is_null($student)) {
            $student = User::create([
                "email" => $request->user_email,
                "name" => $request->user_name,
                "password" => "",
            ]);
        }

        if ($student->groups()->isStudent()->get()->count() == 0) {
            $student->groups()->syncWithoutDetaching(Group::isStudent()->get());
        }

        $student->courses()->syncWithoutDetaching($course->id);
    }

    public function removeStudent(Course $course, User $student) {
        $student->courses()->detach($course->id);
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
