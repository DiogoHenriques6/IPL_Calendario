<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\ExamController;
use App\Models\Exam;
use Illuminate\Http\Request;
use Spatie\CalendarLinks\Link;

class ReactController extends Controller
{
    public function index()
    {
        return view('react.index');
    }

    public function icsDownload(Request $request, Exam $exam)
    {
        header('Content-type: text/calendar; charset=utf-8');
        $filename = str_replace(' ', '_', trim($exam->courseUnit->name_en));

        header('Content-Disposition: attachment; filename=' . $filename . '.ics');

        $examController = new ExamController();
        $examController->icsDownload($request, $exam);
    }
}
