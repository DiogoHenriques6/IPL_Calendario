<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarLogsResource;
use App\Models\Calendar;
use App\Models\CalendarLog;

class CalendarLogsController extends Controller
{
    public function logsFromCalendar(Calendar $calendarID)
    {
        //LOG::info('Calendar : ' . $calendarID->id );
        $allLogs = collect();

        // Buscar o calendário atual
        $currentCalendar = Calendar::find($calendarID->id);

        while ($currentCalendar) {
            // Buscar logs do calendário atual
            $logs = CalendarLog::where('calendar_id', $currentCalendar->id)
                ->orderByDesc('id') // Ordenar por ID de log
                ->get();

            // Adicionar os logs atuais à coleção de todos os logs
            $allLogs = $allLogs->merge($logs);

            // Verificar se há um calendário anterior
            if ($currentCalendar->previous_calendar_id) {
                // Atualizar o calendário atual para o calendário anterior
                $currentCalendar = Calendar::find($currentCalendar->previous_calendar_id);
            } else {
                $currentCalendar = null;
            }
        }

        return CalendarLogsResource::collection($allLogs);
    }
}
