<?php

namespace App\Events;

use App\Models\AcademicYear;
use App\Models\Calendar;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AcademicYearRegistered
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $academicYear;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(AcademicYear $academicYear)
    {
        $this->academicYear = $academicYear;
    }
}
