<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarLogsResource;
use App\Models\Calendar;
use App\Models\CalendarLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CalendarLogsController extends Controller
{
    public function logsFromCalendar(Calendar $calendarID)
    {
        $allLogs = collect();

        // Buscar o calendário atual
        $currentCalendar = Calendar::find($calendarID->id);

        while ($currentCalendar) {
            // Buscar logs do calendário atual
            $logs = CalendarLog::where('calendar_id', $currentCalendar->id)
                ->orderByDesc('id')
                ->get();

            // Adicionar os logs atuais à coleção de todos os logs
            $allLogs = $allLogs->merge($logs);

            // Atualizar o calendário atual para o calendário anterior, incluindo soft-deleted
            $currentCalendar = $currentCalendar->previous_calendar_id ? Calendar::withTrashed()->find($currentCalendar->previous_calendar_id) : null;
        }

        return CalendarLogsResource::collection($allLogs);
    }

    public function deleteLogsFromCalendar(Calendar $calendarID)
    {
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

            // Atualizar o calendário atual para o calendário anterior, se existir
            $currentCalendar = $currentCalendar->previous_calendar_id ? Calendar::withTrashed()->find($currentCalendar->previous_calendar_id) : null;
        }
        // Deletar todos os logs do allLogs
        $allLogs->each(function ($log) {
            $log->delete();
        });
        return response()->json(['message' => 'Logs deletados com sucesso']);
    }
}
