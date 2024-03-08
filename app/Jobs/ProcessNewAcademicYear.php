<?php

namespace App\Jobs;

use App\Services\ExternalImports;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessNewAcademicYear implements ShouldQueue//, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $academicYearCode;
    protected $semester;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 2;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 3;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(int $academicYearCode, int $semester)
    {
        Log::channel('courses_sync')->info('Queue requested for year (' . $academicYearCode . ') and semester (' . $semester . ')');
        $this->onQueue('academicYear');
        $this->academicYearCode = $academicYearCode;
        $this->semester = $semester;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::channel('courses_sync')->info('Queue started for year (' . $this->academicYearCode . ') and semester (' . $this->semester . ')');
        ExternalImports::importCoursesFromWebService($this->academicYearCode, $this->semester);
    }
}
