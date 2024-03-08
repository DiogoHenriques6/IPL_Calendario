<?php

namespace App\Listeners;

use App\Events\AcademicYearRegistered;
use App\Services\ExternalImports;

class ImportCourses
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
     * @param  AcademicYearRegistered  $event
     * @return void
     */
    public function handle(AcademicYearRegistered $event)
    {
        $month = date('m');
        ExternalImports::importCoursesFromWebService($event->academicYear->code, ($month > 1 && $month < 7? 2 : 1));
    }
}
