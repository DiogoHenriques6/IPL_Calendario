<?php

namespace App\Listeners;

use App\Models\CalendarChange;
use App\Events\CalendarChanged;

class LogCalendarChange
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
     * @param  CalendarChanged  $event
     * @return void
     */
    public function handle(CalendarChanged $event)
    {
        $calendarChange = new CalendarChange($event->calendar->toArray());
        $calendarChange->calendar_id = $event->calendar->id;
        $calendarChange->save();

        $event->calendar->touch();
    }
}
