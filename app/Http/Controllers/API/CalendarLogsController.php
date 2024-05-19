<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarLogsResource;
use App\Models\Calendar;

class CalendarLogsController extends Controller
{
    public function logsFromCalendar(Calendar $calendarID)
    {
        //Ordenado por id de curso e id de log
        return CalendarLogsResource::collection($calendarID->logs->sortBy(function($log){
            return $log->course_unit_id . '-' . $log->id;
        }));
    }
}
