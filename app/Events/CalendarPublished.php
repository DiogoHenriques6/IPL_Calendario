<?php

namespace App\Events;

use App\Mail\CalendarPublishedEmail;
use App\Models\Calendar;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CalendarPublished
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

        //$users = $calendar->course()->students()->pluck('email');
        $students = $calendar->course->students()->pluck('email')->join(', ');//->toArray();
        // TODO > send to teachers as well? Or just students?
        //foreach ($students as $recipient) {
        if($students != "") {
            Mail::bcc($students)->send(new CalendarPublishedEmail($calendar));//queue
        }
        //}
    }
}
