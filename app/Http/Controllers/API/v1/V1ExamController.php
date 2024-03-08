<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\API_V1\Exams\ExamListResource;
use App\Models\AcademicYear;
use App\Models\CalendarPhase;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Exam;
use App\Models\School;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class V1ExamController extends Controller
{
    public function list(Request $request, $schoolCode, $academicYearCode)
    {
        $ids = $this->handleIds($schoolCode, $academicYearCode, null, null, $request->query('semester'));
        // check if return of action is not an array of ids
        if(gettype($ids) != "array" ){
            return $ids;
        }
        // get exams from a specific academic year and a specific school
        $exams = Exam::whereHas('method', function ($query) use($ids) {
            $query->ofAcademicYear($ids['academicYearId']);                 // get only exams for the current year
        })->whereHas('course', function ($query) use($ids) {
            $query->where('school_id', $ids['schoolId']);                   // get exams for the requested school
        })->whereHas('calendar', function ($query) use($ids) {
            $query->where('is_published', true)//->where("is_temporary", false)
            ->where("calendar_phase_id", CalendarPhase::phasePublished())
                ->when($ids['semesterId'], function ($q_s) use($ids) {      // will only filter by semester if requested
                    $q_s->where('semester_id', $ids['semesterId']);         // get exams for the requested semester
                });
        })->get();

        return ExamListResource::collection($exams);
    }

    public function listByCourse(Request $request, $schoolCode, $academicYearCode, $code)
    {
        $ids = $this->handleIds($schoolCode, $academicYearCode, $code, null, $request->query('semester'));
        // check if return of action is not an array of ids
        if(gettype($ids) != "array" ){
            return $ids;
        }
        // get exams from a specific academic year and a specific school
        $exams = Exam::whereHas('method', function ($query) use($ids) {
            $query->ofAcademicYear($ids['academicYearId']);                                         // get only exams for the current year
        })->whereHas('course', function ($query) use($ids) {
            $query->where("courses.id", $ids['courseId'])->where('school_id', $ids['schoolId']);    // get exams for the requested course and school
        })->whereHas('calendar', function ($query) use($ids) {
            $query->where('is_published', true)//->where("is_temporary", false)
                ->where("calendar_phase_id", CalendarPhase::phasePublished())
                ->when($ids['semesterId'], function ($q_s) use($ids) {                              // will only filter by semester if requested
                    $q_s->where('semester_id', $ids['semesterId']);                                 // get exams for the requested semester
                });
        })->get();

        return ExamListResource::collection($exams);
    }

    public function listByUnit(Request $request, $schoolCode, $academicYearCode, $code)
    {
        $ids = $this->handleIds($schoolCode, $academicYearCode, null, $code, $request->query('semester'));
        // check if return of action is not an array of ids
        if(gettype($ids) != "array" ){
            return $ids;
        }
        // get exams from a specific academic year and a specific school
        $exams = Exam::whereHas('method', function ($query) use($ids) {
            $query->ofAcademicYear($ids['academicYearId']);                 // get only exams for the current year
        })->whereHas('course', function ($query) use($ids) {
            $query->where('school_id', $ids['schoolId']);
        })->whereHas('courseUnit', function ($query) use($ids) {
            $query->where("course_units.id", $ids['courseUnitId']);         // get exams for the requested curricular unit
        })->whereHas('calendar', function ($query) use($ids) {
            $query->where('is_published', true)//->where("is_temporary", false)
            ->where("calendar_phase_id", CalendarPhase::phasePublished())
                ->when($ids['semesterId'], function ($q_s) use($ids) {      // will only filter by semester if requested
                    $q_s->where('semester_id', $ids['semesterId']);         // get exams for the requested semester
                });
        })->get();

        return ExamListResource::collection($exams);
    }

    private function handleIds($schoolCode, $academicYearCode, $courseCode = null, $unitCode = null, $semesterNumber = null)
    {
        $academicYear = AcademicYear::where("code", $academicYearCode)->first();
        $school = School::where("code", strtoupper($schoolCode))->first();

        $course = null;
        if($courseCode){
            $course = Course::where("code", $courseCode)->first();
        }
        $courseUnit = null;
        if($unitCode){
            $courseUnit = CourseUnit::where("code", $unitCode)->first();
        }

        if(!$academicYear || !$school || (!$course && $courseCode) || (!$courseUnit && $unitCode)) {
            $errors = [];
            if(!$academicYear) {
                array_push($errors, "Academic Year not valid. eg: 202122");
            }
            if(!$school) {
                array_push($errors, "School code not valid. eg: estg");
            }
            if($courseCode) {
                if (!$course) {
                    array_push($errors, "Course code not valid. eg: 2004");
                }
            }
            if($unitCode) {
                if(!$courseUnit) {
                    array_push($errors, "Curricular Unit code not valid. eg: 2037414");
                }
            }
            return response()->json(
                [
                    "error" => true,
                    "description" => $errors
                ],
                Response::HTTP_BAD_REQUEST);
        }

        $semesterId = null;
        if($semesterNumber){
            $semester = Semester::where("number", $semesterNumber)->first();
            $semesterId = $semester ? $semester->id : null;
        }
        return [
            "academicYearId"    => $academicYear->id,
            "schoolId"          => $school->id,
            "semesterId"        => $semesterId,
            "courseId"          => $courseCode ? $course->id : null,
            "courseUnitId"      => $unitCode ? $courseUnit->id : null,
        ];
    }
}
