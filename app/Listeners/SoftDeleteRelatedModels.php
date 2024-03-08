<?php

namespace App\Listeners;

use App\Models\CalendarChange;
use App\Events\CalendarChanged;
use App\Events\CalendarDeleted;

class SoftDeleteRelatedModels
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
     * @param  CalendarDeleted  $event
     * @return void
     */
    public function handle(CalendarDeleted $event)
    {
        $event->calendar->interruptions()->delete();
        $event->calendar->epochs()->delete();
        $event->calendar->calendarChanges()->delete();
    }
}
