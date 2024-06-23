<?php

namespace App\Filters;

use App\Models\Calendar;
use App\Models\Group;
use App\Models\InitialGroups;
use Illuminate\Support\Facades\Auth;
use tiagomichaelsousa\LaravelFilters\QueryFilters;

class CalendarDetailsFilters extends QueryFilters
{
    protected $calendar;

    public function setCalendar(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }


    public function myUCsOnly(){
        $selectedGroup = Group::where('id',request()->cookie('selectedGroup'))->first();
        $userCourseUnits = null;
        if($selectedGroup->code == InitialGroups::STUDENT) {
            $userCourseUnits = explode(',',request()->cookie('courseUnits'));
        }
        else{
            $userCourseUnits = Auth::user()->courseUnits->pluck('id');
        }

        $epochIds = $this->calendar->epochs->pluck('id')->toArray();

        return $this->builder->whereIn('course_unit_id', $userCourseUnits)
            ->whereIn('epoch_id', $epochIds);
    }
}