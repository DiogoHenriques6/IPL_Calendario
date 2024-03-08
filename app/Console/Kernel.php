<?php

namespace App\Console;

use App\Models\AcademicYear;
use App\Services\ExternalImports;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        $schedule->call(function () {
            //$month = date('m');
            ExternalImports::importCoursesFromWebService(AcademicYear::where('selected', true)->first()->code, 1);//($month > 1 && $month < 7? 2 : 1));
        })->dailyAt(3);

        $schedule->call(function () {
            ExternalImports::importCoursesFromWebService(AcademicYear::where('selected', true)->first()->code, 2);
        })->dailyAt(4);
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
