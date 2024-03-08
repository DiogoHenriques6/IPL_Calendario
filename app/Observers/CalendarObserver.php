<?php

namespace App\Observers;

use App\Models\Calendar;
use Illuminate\Support\Facades\Auth;

class CalendarObserver
{
    protected $afterCommit = false;

    public function creating(Calendar $calendar)
    {
        $userId = Auth::user()->id;
        $calendar->created_by = $userId;
        $calendar->updated_by = $userId;
    }

    public function updating(Calendar $calendar)
    {
        $calendar->updated_by = Auth::user()->id;
    }
}
