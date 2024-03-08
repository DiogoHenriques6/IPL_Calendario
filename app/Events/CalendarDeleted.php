<?php

namespace App\Events;

use App\Models\Calendar;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CalendarDeleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $calendar;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }
}
