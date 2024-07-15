<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Calendar;
use App\Models\CalendarLog;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\CourseUnitGroup;
use App\Models\Epoch;
use App\Models\Exam;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\Method;
use App\Models\MethodGroup;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
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

    public function showMyComments(Exam $exam)
    {
        $currentExam = $exam::with(['courseUnit', 'comments'])->find($exam->id);
        $userId = auth()->user()->id;

        $filteredComments = $currentExam->comments->filter(function ($comment) use ($userId) {
            return $comment->user_id == $userId;
        });
        $currentExam->comments = $filteredComments;
        return new ExamResource($currentExam);
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
        $selectedGroup_id = $request->cookie('selectedGroup');

        $validation = $this->checkIfCanEditExam($calendarId, $epochId, $request->course_id, $request->method_id, $request->course_unit_id);
        if($validation){
            return $validation;
        }

        $currentGroup = Group::find($selectedGroup_id);
        if(str_contains($currentGroup->code, InitialGroups::GOP)){
            $courseUnit = CourseUnit::where('id', $request->course_unit_id)->first();
            if($courseUnit->course_unit_group_id == null){
                $response = ($request->header("lang") == "en" ? "Exam does not belong to a grouped CU!" : "Exame não pertence a UC agrupada!");
                return response()->json($response, Response::HTTP_FORBIDDEN);
            }
        }

        $courseUnitGroup = CourseUnit::find($request->course_unit_id)->group;
        $courseUnitGroup = $courseUnitGroup ? $courseUnitGroup->id : null;

        if ($courseUnitGroup != null) {
            //check if groupedUCs have an existing calendar for the same semester
            $courseUnitsInGroup = CourseUnit::where('course_unit_group_id', $courseUnitGroup)->get();
            foreach ($courseUnitsInGroup as $courseUnit) {
                $calendarByCourseId = Calendar::where('course_id', $courseUnit->course_id)
                    ->where("semester_id", $courseUnit->semester_id)
                    ->first();

                if ($calendarByCourseId == null) {
                    $course = Course::ofAcademicYear($request->cookie('academic_year'))->find($courseUnit->course_id);
                    $response = $request->header("lang") == "en"
                        ? "There is no {$courseUnit->semester_id}º semester calendar for the course ({$course->code}) {$course->name_en}!"
                        : "Não existe calendário de {$courseUnit->semester_id}º semestre para o curso ({$course->code}) {$course->name_en}!";
                    return response()->json($response, Response::HTTP_UNPROCESSABLE_ENTITY);
                }
            }

            //check if there are any exams with the same method deleted
            $examsWithMethod = Exam::withTrashed()->where('method_id', $request->method_id)->get();
            //create if it doesnt exist
            if ($examsWithMethod->isEmpty()) {
                $newExam = new Exam($request->all());
                $newExam->save();

                $newLog = new CalendarLog();
                $newLog->calendar_id = $calendarId;
                $newLog->course_unit_id = $request->course_unit_id;
                $newLog->exam_id = $newExam->id;
                $newLog->user_id = auth()->user()->id;
                $newLog->is_create = "1";
                $newLog->new_date = $request->date_start;
                $newLog->save();

                //remove the courseUnit that sent in the request
                $courseUnitsInGroup = $courseUnitsInGroup->reject(function ($courseUnit) use ($request) {
                    return $courseUnit->id == $request->course_unit_id;
                });

                foreach ($courseUnitsInGroup as $courseUnit) {
                    $calendarIDByCourseId = Calendar::where('course_id', $courseUnit->course_id)
                        ->where("semester_id",$courseUnit->semester_id)->first()->id;
                    $epochTypeByMethod = Method::find($request->method_id)->epochType;
                    $epochByType = Epoch::where('epoch_type_id', $epochTypeByMethod[0]['id'])->where('calendar_id', $calendarIDByCourseId)->first();

                    $newRelatedExam = new Exam($request->all());
                    $newRelatedExam->course_unit_id = $courseUnit->id;
                    $newRelatedExam->epoch_id = $epochByType->id;
                    $newRelatedExam->save();

                    $newLog = new CalendarLog();
                    $newLog->calendar_id = $epochByType->calendar->id;
                    $newLog->course_unit_id = $courseUnit->id;
                    $newLog->exam_id = $newRelatedExam->id;
                    $newLog->user_id = auth()->user()->id;
                    $newLog->is_create = "1";
                    $newLog->new_date = $request->date_start;
                    $newLog->save();
                }
            }
            else{
                foreach ($examsWithMethod as $deletedExam){
                    Log::channel("sync_test")->info("Deleted Exam" . $deletedExam);
                    if($deletedExam->course_unit_id == $request->course_unit_id){
                        $newExam = $deletedExam;
                        $newExam->restore();
                        $newExam->fill($request->all());
                        $newExam->save();

                        $newLog = new CalendarLog();
                        $calendarId = Epoch::find($newExam->epoch_id)->calendar_id;
                        $newLog->calendar_id = $calendarId;
                        $newLog->course_unit_id = $newExam->course_unit_id;
                        $newLog->exam_id = $newExam->id;
                        $newLog->user_id = auth()->user()->id;
                        $newLog->is_create = "1";
                        $newLog->new_date = $request->date_start;
                        $newLog->save();
                    }
                    else{
                        $deletedExam->restore();
                        $originalCourseUnitId = $deletedExam->course_unit_id;
                        $originalEpochId = $deletedExam->epoch_id;
                        $deletedExam->fill($request->except(['course_unit_id', 'epoch_id']));
                        $deletedExam->course_unit_id = $originalCourseUnitId;
                        $deletedExam->epoch_id = $originalEpochId;
                        $deletedExam->save();

                        $newLog = new CalendarLog();
                        $calendarId = Epoch::find($deletedExam->epoch_id)->calendar_id;
                        $newLog->calendar_id = $calendarId;
                        $newLog->course_unit_id = $deletedExam->course_unit_id;
                        $newLog->exam_id = $deletedExam->id;
                        $newLog->user_id = auth()->user()->id;
                        $newLog->is_create = "1";
                        $newLog->new_date = $request->date_start;
                        $newLog->save();
                    }
                }
            }
        } else {
            $methodGroupId = Method::find($request->method_id)->method_group_id;
            if ($methodGroupId != null) {
                $courseUnitsInGroup = CourseUnit::whereHas('methods', function ($query) use ($methodGroupId) {
                    $query->where('method_group_id', $methodGroupId);
                })->get();

                foreach ($courseUnitsInGroup as $courseUnit) {
                    $calendarIDByCourseId = Calendar::where('course_id', $courseUnit->course_id)->first()->id;
                    $epochTypeByMethod = Method::find($request->method_id)->epochType;
                    $methodId = $courseUnit->methods->where('method_group_id',$methodGroupId)->pluck('id')->first();
                    $epochByType = Epoch::where('epoch_type_id', $epochTypeByMethod[0]['id'])->where('calendar_id', $calendarIDByCourseId)->first();
                    //TODO check if restoring grouped methods is working
                    $exam = Exam::onlyTrashed()->where('method_id', $methodId)->where('epoch_id', $epochByType->id)->where('course_unit_id', $courseUnit->id)->first();
                    if ($exam) {
                        $exam->restore();
                        $exam->fill($request->all());
                        $exam->method_id = $methodId;
                        $exam->save();
                        $newExam = $exam;
                    } else {
                        $newExam = new Exam($request->all());
                        $newExam->course_unit_id = $courseUnit->id;
                        $newExam->epoch_id = $epochByType->id;
                        $newExam->method_id = $methodId;
                        $newExam->save();
                    }

                    $newLog = new CalendarLog();
                    $newLog->calendar_id = $epochByType->calendar->id;
                    $newLog->course_unit_id = $courseUnit->id;
                    $newLog->exam_id = $newExam->id;
                    $newLog->user_id = auth()->user()->id;
                    $newLog->is_create = "1";
                    $newLog->new_date = $request->date_start;
                    $newLog->save();
                }
            }
            else {
                $exam = Exam::onlyTrashed()->where('method_id', $request->method_id)->where('epoch_id', $epochId)->where('course_unit_id', $request->course_unit_id)->first();
                if ($exam) {
                    $exam->restore();
                    $exam->room = $request->room;
                    $exam->date_start = $request->date_start;
                    $exam->date_end = $request->date_end;
                    $exam->in_class = $request->in_class;
                    $exam->hour = $request->hour;
                    $exam->duration_minutes = $request->duration_minutes;
                    $exam->observations_pt = $request->observations_pt;
                    $exam->observations_en = $request->observations_en;
                    $exam->description_pt = $request->description_pt;
                    $exam->description_en = $request->description_en;
                    $exam->save();
                    $newExam = $exam;
                } else {
                    $newExam = new Exam($request->all());
                    $newExam->save();
                }
                $newLog = new CalendarLog();
                $newLog->calendar_id = $newExam->epoch->calendar->id;
                $newLog->course_unit_id = $newExam->course_unit_id;
                $newLog->exam_id = $newExam->id;
                $newLog->user_id = auth()->user()->id;
                $newLog->is_create = "1";
                $newLog->new_date = $request->date_start;
                $newLog->save();
            }
        }
        return response()->json(new ExamResource($newExam), Response::HTTP_CREATED);
    }

    public function update(NewExamRequest $request, Exam $exam)
    {
        $validation = $this->checkIfCanEditExam($request->calendar_id, $request->epoch_id, $request->course_id, $request->method_id, $request->course_unit_id, $exam->id);
        if($validation){
            return $validation;
        }

        // Check if CUs of exam belongs to any group
        $courseUnitGroup = $exam->courseUnit->group ;
        $courseUnitGroup = $courseUnitGroup ? $courseUnitGroup->id : null;
        if ($courseUnitGroup != null) {
            $examsWithMethod = $exam->courseUnit->exams->where('method_id', $exam->method_id);

            foreach ($examsWithMethod as $relatedExam) {
                // Verifica se a data do exame foi alterada, se sim, cria um log a dizer que a data foi alterada
                $examDataBeforeUpdate = Exam::find($relatedExam->id);

                $date1 = new DateTime($examDataBeforeUpdate->date_start);
                $date2 = new DateTime($request->date_start);
                if ($date1->format('Y-m-d') != $date2->format('Y-m-d')){
                    $newLog = new CalendarLog();
                    $newLog->calendar_id = $relatedExam->epoch->calendar->id;
                    $newLog->course_unit_id = $request->course_unit_id;
                    $newLog->exam_id = $relatedExam->id;
                    $newLog->user_id = auth()->user()->id;
                    $newLog->is_update = "1";
                    // Vai buscar a data do exame antes de ser alterada
                    $newLog->old_date = $examDataBeforeUpdate->date_start;
                    $newLog->new_date = $request->date_start;
                    $newLog->save();
                }

                // Atualiza as informações do exame relacionado
                $relatedExam->room            = $request->room;
                $relatedExam->group_id        = $request->group_id;
                $relatedExam->date_start      = $request->date_start;
                $relatedExam->date_end        = $request->date_end;
                $relatedExam->hour            = $request->hour;
                $relatedExam->in_class        = $request->in_class;
                $relatedExam->duration_minutes = $request->duration_minutes;
                $relatedExam->observations_pt = $request->observations_pt;
                $relatedExam->observations_en = $request->observations_en;
                $relatedExam->save();
            }

        } else {
            $methodGroupId = Method::find($request->method_id)->method_group_id;
            if ($methodGroupId != null) {
                $relatedMethods = Method::where('method_group_id',$methodGroupId)->pluck('id');

                $examsWithMethod = Exam::whereIn('method_id',$relatedMethods)->get();
                foreach ($examsWithMethod as $relatedExam){
                    $examDataBeforeUpdate = Exam::find($relatedExam->id);

                    $date1 = new DateTime($examDataBeforeUpdate->date_start);
                    $date2 = new DateTime($request->date_start);
                    if ($date1->format('Y-m-d') != $date2->format('Y-m-d')){
                        $newLog = new CalendarLog();
                        $newLog->calendar_id = $relatedExam->epoch->calendar->id;
                        $newLog->course_unit_id = $request->course_unit_id;
                        $newLog->exam_id = $relatedExam->id;
                        $newLog->user_id = auth()->user()->id;
                        $newLog->is_update = "1";
                        // Vai buscar a data do exame antes de ser alterada
                        $newLog->old_date = $examDataBeforeUpdate->date_start;
                        $newLog->new_date = $request->date_start;
                        $newLog->save();
                    }
                    $relatedExam->room            = $request->room;
                    $relatedExam->group_id        = $request->group_id;
                    $relatedExam->date_start      = $request->date_start;
                    $relatedExam->date_end        = $request->date_end;
                    $relatedExam->hour            = $request->hour;
                    $relatedExam->in_class        = $request->in_class;
                    $relatedExam->duration_minutes = $request->duration_minutes;
                    $relatedExam->observations_pt = $request->observations_pt;
                    $relatedExam->observations_en = $request->observations_en;
                    $relatedExam->save();
                }
//                $examsWithMethod = $exam->courseUnit->exams->where('method_id', $exam->method_id);

            }
            else{
                // Verifica se a data do exame foi alterada, se sim, cria um log a dizer que a data foi alterada
                $examDataBeforeUpdate = Exam::find($exam->id);

                $date1 = new DateTime($examDataBeforeUpdate->date_start);
                $date2 = new DateTime($request->date_start);
                if ($date1->format('Y-m-d') != $date2->format('Y-m-d')){
                    $newLog = new CalendarLog();
                    $newLog->calendar_id = $request->calendar_id;
                    $newLog->course_unit_id = $request->course_unit_id;
                    $newLog->exam_id = $exam->id;
                    $newLog->user_id = auth()->user()->id;
                    $newLog->is_update = "1";
                    // Vai buscar a data do exame antes de ser alterada
                    $newLog->old_date = $examDataBeforeUpdate->date_start;
                    $newLog->new_date = $request->date_start;
                    $newLog->save();
                }

                // Atualiza as informações do exame
                $exam->epoch_id        = $request->epoch_id;
                $exam->method_id       = $request->method_id;
                $exam->room            = $request->room;
                $exam->group_id        = $request->group_id;
                $exam->date_start      = $request->date_start;
                $exam->date_end        = $request->date_end;
                $exam->hour            = $request->hour;
                $exam->in_class        = $request->in_class;
                $exam->duration_minutes = $request->duration_minutes;
                $exam->observations_pt = $request->observations_pt;
                $exam->observations_en = $request->observations_en;
                $exam->save();
            }
        }
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
        // Verifica se o calendário está publicado
        if ($exam->epoch->calendar->is_published) {
            return response()->json("Not allowed to delete exams on Published Calendars!", Response::HTTP_FORBIDDEN);
        }

        $belongsToGroup = $exam->courseUnit->group;
        $belongsToGroup = $belongsToGroup ? $belongsToGroup->id : null;

        if ($belongsToGroup) {
            $examsWithMethod = $exam->courseUnit->exams->where('method_id', $exam->method_id);

            foreach ($examsWithMethod as $relatedExam) {
                $newLog = new CalendarLog();
                $newLog->calendar_id = $relatedExam->epoch->calendar->id;
                $newLog->course_unit_id = $relatedExam->course_unit_id;
                $newLog->exam_id = $relatedExam->id;
                $newLog->user_id = auth()->user()->id;
                $newLog->new_date = $exam->date_start;
                $newLog->save();
                $relatedExam->delete();
            }
        } else {

            $methodGroupId = Method::where("id", $exam->method_id)->pluck('method_group_id')->first();
            Log::channel("sync_test")->info($methodGroupId);
            if($methodGroupId != null){
                $relatedMethods = Method::where('method_group_id',$methodGroupId)->pluck('id');

                $examsWithMethod = Exam::whereIn('method_id',$relatedMethods)->get();
                foreach ($examsWithMethod as $relatedExam){
                    $newLog = new CalendarLog();
                    $newLog->calendar_id = $relatedExam->epoch->calendar->id;
                    $newLog->course_unit_id = $relatedExam->course_unit_id;
                    $newLog->exam_id = $relatedExam->id;
                    $newLog->user_id = auth()->user()->id;
                    $newLog->new_date = $relatedExam->date_start;
                    $newLog->save();
                    $relatedExam->delete();
                }
            }else{
                $newLog = new CalendarLog();
                $newLog->calendar_id = $exam->epoch->calendar->id;
                $newLog->course_unit_id = $exam->course_unit_id;
                $newLog->exam_id = $exam->id;
                $newLog->user_id = auth()->user()->id;
                $newLog->new_date = $exam->date_start;
                $newLog->save();
                $exam->delete();
            }
        }
        return response()->json("Removed!");
    }
}
