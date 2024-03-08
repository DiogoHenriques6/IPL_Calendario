<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Calendar;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\CourseUnitGroup;
use App\Models\Epoch;
use App\Models\Exam;
use App\Models\Method;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Spatie\CalendarLinks\Link;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index()
    {
        //
    }

    public function show(Exam $exam)
    {
        return new ExamResource($exam::with(['courseUnit', 'comments'])->find($exam->id));
    }

    public function icsDownload(Request $request, Exam $exam)
    {
        $eventExam = $exam;//$exam::with(['courseUnit'])->find($exam->id);

        $from = \DateTime::createFromFormat('Y-m-d H:i:s', $eventExam->date_start);
        $to = \DateTime::createFromFormat('Y-m-d H:i:s', $eventExam->date_end);

        if ($request->header("lang") == "en") {
            $title = "Evaluation for '" . trim($eventExam->courseUnit->name_en) . "'";
            $description = ($eventExam->in_class ? "This evaluation will occur during the class time" : "The room(s) where the evaluation will occurr are: '" . $eventExam->room . "'");
            $description .= "\n\rThe evaluation that will be made is: '" . $eventExam->method->description_en . "'";
            $description .= "\n\rObservations: \n\r " . $eventExam->observations_en;
        } else {
            $title = "Avaliação para '" . trim($eventExam->courseUnit->name_pt) . "'";
            $description = ($eventExam->in_class ? "A avaliação irá decorrer durante o horario da aula" : "A(s) sala(s) onde a avaliação irá decorrer: '" . $eventExam->room . "'");
            $description .= "\n\rA avaliação que irá decorrer é: '" . $eventExam->method->description_pt . "'";
            $description .= "\n\rObservações: \n\r " . $eventExam->observations_pt;
        }

        if ($eventExam->in_class) {
            $link = Link::createAllDay($title, $from, 1);
        } else {
            $link = Link::create($title, $from, $to);
        }
        $link->description($description);
        // $link->address('Kruikstraat 22, 2018 Antwerpen');

        if(!$request->has('type')){
            return $link->ics();
        }
        // Generate a link to create an event on Google calendar
        if($request->type == "google"){
            return $link->google();
        }
        // Generate a link to create an event on Yahoo calendar
        if($request->type == "yahoo") {
            return $link->yahoo();
        }
        // Generate a link to create an event on outlook.live.com calendar
        if($request->type == "webOutlook"){
            return $link->webOutlook();
        }
        // Generate a link to create an event on outlook.office.com calendar
        if($request->type == "webOffice") {
            return $link->webOffice();
        }
        // Generate a data uri for an ics file (for iCal & Outlook)
        if($request->type == "ics") {
            return $link->ics();
        }
        // Generate a data URI using arbitrary generator:
        //if($request->type == "google") {
        //    return $link->formatWith(new \Your\Generator());
        //}
        return $link->ics();
    }


    public function store(NewExamRequest $request)
    {
        $calendarId = $request->calendar_id;
        $epochId = $request->epoch_id;

        $validation = $this->checkIfCanEditExam($calendarId, $epochId, $request->course_id, $request->method_id, $request->course_unit_id);
        if($validation){
            return $validation;
        }

        $courseUnitGroup = CourseUnit::find($request->course_unit_id)->group;
        $courseUnitGroup = $courseUnitGroup ? $courseUnitGroup->id : null;

        if ($courseUnitGroup) {
            $cal = Calendar::find($calendarId);

            $courses = CourseUnitGroup::find($courseUnitGroup)->courseUnits->pluck('course_id');
            $specialCourses = false;
            if($courses->unique()->count() == 1){
                $courseCheck = Course::find($courses->unique()->first());
                if($courseCheck->degree == 0){
                    $specialCourses = true;
                    $courses[] = $request->course_id;
                }
            }

            $calendars = Calendar::whereIn('course_id', $courses)
                ->where('semester_id', $cal->semester_id)
                ->ofAcademicYear($cal->academic_year_id)
                ->where('is_temporary', false)
                ->where('is_published', false)
                ->get();

            foreach ($calendars as $calendar) {
                foreach (Method::find($request->method_id)->epochType as $epochType) {
                    $epoch = Epoch::where('epoch_type_id', $epochType->id)->where('calendar_id', $calendar->id)->first();
                    $hasEpoch = $epoch->calendar()->where('calendars.is_published', false)->exists();

                    // This would prevent multiple exams
                    // $hasExams = Exam::where('method_id', $request->method_id)->where('epoch_id', $epoch->id)->exists();

                    // This will let the users create multiple times an exam for the method
                    if ($hasEpoch){// && !$hasExams) {
                        if($specialCourses){
                            $courseUnit = CourseUnit::find($request->course_unit_id);
                        } else {
                            $courseUnit = CourseUnit::where('course_id', $calendar->course_id)->where('course_unit_group_id', $courseUnitGroup)->first();
                        }

                        if($courseUnit) {
                            $newGroupedExam = new Exam($request->all());
                            // dynamic fields
                            $newGroupedExam->epoch_id = $epoch->id;
                            $newGroupedExam->course_unit_id = $courseUnit->id;

                            $newGroupedExam->save();
                            if($courseUnit->id === $request->course_unit_id){
                                $newExam = $newGroupedExam;
                            }
                        }
                    }
                }
            }
        } else {
            $newExam = new Exam($request->all());
            $newExam->save();
        }
        if($newExam){
            return response()->json(new ExamResource($newExam), Response::HTTP_CREATED);
        }
        return response()->json('no exams to create', Response::HTTP_CONFLICT);
    }

    public function update(NewExamRequest $request, Exam $exam)
    {
        /*
            $allHaveSameGroup = null;
            $aux = null;
            $courseUnits = $exam->method->courseUnits;
            foreach ($courseUnits as $courseUnit) {
                if (is_null($aux)) {
                    $aux = $courseUnit->group;
                }
                $allHaveSameGroup = !is_null($courseUnit->group) ? $courseUnit->group->id == $aux->id : false;

                if (!$allHaveSameGroup) {
                    break;
                }
            }
            $courseUnits = $exam->method->courseUnits;
            foreach ($courseUnits as $courseUnit) {
                $epochId = Epoch::where('epoch_type_id', $exam->epoch->epoch_type_id)
                   ->where('calendar_id', Calendar::where('course_id', $courseUnit->course_id)->where('is_published', false)->latest('id')->first()->id)
                   ->first()->id;
               $examToUpdate = $courseUnit->exams->where('epoch_id', $epochId)->last();

               if (($allHaveSameGroup && $courseUnit->group !== null) || $examToUpdate->id === $exam->id) {
                   $examToUpdate->room = $request->room;
                   $examToUpdate->date_start = $request->date_start;
                   $examToUpdate->date_end = $request->date_end;
                   $examToUpdate->hour = $request->hour;
                   $examToUpdate->duration_minutes = $request->duration_minutes;
                   $examToUpdate->observations_pt = $request->observations_pt;
                   $examToUpdate->observations_en = $request->observations_en;

                   $examToUpdate->save();
               }
            }
        */

        $validation = $this->checkIfCanEditExam($request->calendar_id, $request->epoch_id, $request->course_id, $request->method_id, $request->course_unit_id, $exam->id);
        if($validation){
            return $validation;
        }

        // check if CUs of exam belongs to any group
        /* TODO check if we want to update all exams related to a Grouped UC/exam
        $courseUnitGroup =  $exam->courseUnit->group;
        $courseUnitGroup = $courseUnitGroup ? $courseUnitGroup->id : null;
        if ($courseUnitGroup) {
            $cal = Calendar::find($request->calendar_id);
            $courses = CourseUnitGroup::find($courseUnitGroup)->courseUnits->pluck('course_id');
            $calendars = Calendar::whereIn('course_id', $courses)
                ->where('semester_id', $cal->semester_id)
                ->where('is_temporary', false)
                ->where('is_published', false)
                ->get();

            foreach ($calendars as $calendar) {
                foreach (Method::find($request->method_id)->epochType as $epochType) {
                    $epoch = Epoch::where('epoch_type_id', $epochType->id)->where('calendar_id', $calendar->id)->first();
                    $hasEpoch = $epoch->calendar()->where('calendars.is_published', false)->exists();

                    // This would prevent multiple exams
                    $hasExams = Exam::where('method_id', $request->method_id)
                        ->where('epoch_id', $epoch->id)->exists();
                    if ($hasEpoch && !$hasExams) {
                        $courseUnit = CourseUnit::where('course_id', $calendar->course_id)->where('course_unit_group_id', $courseUnitGroup)->first();
                        if($courseUnit) {
                            $newGroupedExam = new Exam($request->all());
                            // dynamic fields
                            $newGroupedExam->epoch_id = $epoch->id;
                            $newGroupedExam->course_unit_id = $courseUnit->id;

                            $newGroupedExam->save();
                            if($courseUnit->id === $request->course_unit_id){
                                $newExam = $newGroupedExam;
                            }
                        }
                    }
                }
            }
        } else {
        */
            //$exam->calendar_id     = $request->calendar_id;
            //$exam->course_id       = $request->course_id;
            $exam->epoch_id        = $request->epoch_id;
            $exam->method_id       = $request->method_id;

            $exam->room         = $request->room;
            $exam->group_id     = $request->group_id;
            $exam->date_start   = $request->date_start;
            $exam->date_end     = $request->date_end;
            $exam->hour         = $request->hour;
            $exam->in_class     = $request->in_class;
            $exam->duration_minutes = $request->duration_minutes;
            $exam->observations_pt = $request->observations_pt;
            $exam->observations_en = $request->observations_en;
            $exam->save();
        //}
        return response()->json(new ExamResource($exam), Response::HTTP_OK);
    }

    public function checkIfCanEditExam($calendarId, $epochId, $course_id, $method_id, $course_unit_id, $examId = null){

        // TODO
        /**
         * DO NOT ALLOW BOOK EXAM WHEN (COMMULATIVE):
         * - Day is the same
         * - Year of the CourseUnit is the same (1st, 2nd or 3rd)
         * - Branch ("Ramo") is the same
         */

        $epochRecord = Epoch::find($epochId);
        if ( $epochRecord->calendar->is_published ) {
            return response()->json("Not allowed to book exams on Published Calendars!", Response::HTTP_FORBIDDEN);
        }
        // $checkExam = Exam::where('epoch_id', '=', $epochId)->where('epoch_id', '=', $epochId)->where('method_id', '=', $method_id);
        // if($examId){
        //     $checkExam->where('id', '<>', $examId);
        // }
        // if ( $checkExam->exists() ) {
        //     return response()->json("Not allowed to insert the same exam on this calendar!", Response::HTTP_UNPROCESSABLE_ENTITY);
        // }

        if ( $epochRecord->calendar->id !== $calendarId ) {
            return response()->json("The epoch id is not correct for the given calendar.", Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ( Calendar::find($calendarId)->course->id !== $course_id ) {
            return response()->json("The course id is not correct for the given calendar.", Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $courseUnitMethods = CourseUnit::find($course_unit_id);
        // TODO rever erro aqui nos epochs
        $epochTypeId = $epochRecord->epoch_type_id;
        if ($courseUnitMethods->methods()->whereHas('epochType', function ($query) use ($epochTypeId) {
                return $query->where('epoch_type_id', $epochTypeId);
            })->sum('weight') < 100) {
            return response()->json("Not allowed to create this exam until you have all the methods completed!", Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        return false;
    }

    public function destroyByDate(Calendar $calendar, $date)
    {
        if($calendar->is_published){
            return response()->json("Not allowed to delete exams on Published Calendars!", Response::HTTP_FORBIDDEN);
        }
        $exams = $calendar->exams()->where(function ($query) use($date) {
                $query->whereDate('date_start', '>=', $date)
                    ->whereDate('date_end', '<=', $date);
                })->orWhere(function ($query) use($date) {
                $query->whereDate('date_start', '<=', $date)
                    ->whereDate('date_end', '>=', $date);
                })->get();
        foreach ($exams as $exam) {
            $this->destroy($exam);
        }
        return response()->json("Removed!");
    }

    public function destroy(Exam $exam)
    {
        if($exam->epoch->calendar->is_published){
            return response()->json("Not allowed to delete exams on Published Calendars!", Response::HTTP_FORBIDDEN);
        }
        $belongsToGroup = $exam->courseUnit->group;
        if($belongsToGroup) {
            // TODO validate how the grouped exams will work
            /*foreach ($exam->method->courseUnits as $courseUnit) {
                $epochId = Epoch::where('epoch_type_id', $exam->epoch->epoch_type_id)
                    ->where('calendar_id', Calendar::where('course_id', $courseUnit->course_id)->where('is_published', false)->latest('id')->first()->id)
                    ->first()->id;
                $examToDelete = $courseUnit->exams->where('epoch_id', $epochId)->last();

                if ($courseUnit->group !== null || $examToDelete->id === $exam->id) {
                    $examToDelete->delete();
                    $examToDelete->epoch->calendar()->touch();
                }
            }*/
            $exam->delete();
        } else {
            $exam->delete();
        }
        return response()->json("Removed!");
    }
}
