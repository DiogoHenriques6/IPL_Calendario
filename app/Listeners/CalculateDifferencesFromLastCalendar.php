<?php

namespace App\Listeners;

use App\Models\Epoch;
use App\Models\Exam;
use App\Models\Calendar;
use App\Events\CalendarPublished;
use Carbon\Carbon;

class CalculateDifferencesFromLastCalendar
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  CalendarPublished  $event
     * @return void
     */
    public function handle(CalendarPublished $event)
    {
        $calendar = Calendar::find($event->calendar->id);
        if (!$calendar->previousCalendar) {
            return;
        }
        $methods = Exam::whereIn('epoch_id', $calendar->epochs->pluck('id'))->get()->pluck('method_id');
        $oldMethods = Exam::whereIn('epoch_id', $calendar->previousCalendar->epochs->pluck('id'))->pluck('method_id');
        $addedExams = Exam::whereIn('method_id', $methods)->whereNotIn('method_id', $oldMethods)->get();


        $epochs = Epoch::where('calendar_id', $calendar->previousCalendar->id)->get('id');
        $deletedExams = Exam::whereIn('epoch_id', $epochs)->whereNotIn('method_id', $methods)->get();

        $examsWithDifferences = array();

        $diff = array_diff($addedExams->pluck('id')->toArray(), $examsWithDifferences);
        if (!empty($diff)) {
            array_push($examsWithDifferences, ...$diff);
        }

        $diff = array_diff($deletedExams->pluck('id')->toArray(), $examsWithDifferences);
        if (!empty($diff)) {
            array_push($examsWithDifferences, ...$diff);
        }

        foreach ($calendar->exams as $exam) {
            $sameExamPreviousCalendar = $calendar->previousCalendar->exams()->where('method_id', $exam->method_id);
            if ($sameExamPreviousCalendar->count()) {
                $oldCalendar = $sameExamPreviousCalendar->first();
                if (!Carbon::parse($exam->date)->isSameDay($oldCalendar->date)) {
                    if (!in_array($exam->id, $examsWithDifferences)) {
                        $examsWithDifferences[] = $exam->id;
                    }
                }

                if ($exam->hour !== $oldCalendar->hour) {
                    if (!in_array($exam->id, $examsWithDifferences)) {
                        $examsWithDifferences[] = $exam->id;
                    }
                }

                if ($exam->room !== $oldCalendar->room) {
                    if (!in_array($exam->id, $examsWithDifferences)) {
                        $examsWithDifferences[] = $exam->id;
                    }
                }

                if ($exam->duration_minutes !== $oldCalendar->duration_minutes) {
                    if (!in_array($exam->id, $examsWithDifferences)) {
                        $examsWithDifferences[] = $exam->id;
                    }
                }
            }
        }

        $calendar->difference_from_previous_calendar = $examsWithDifferences;

        $calendar->save();
    }
}
