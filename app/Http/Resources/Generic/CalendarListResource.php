<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\Generic\CourseResource;
use App\Http\Resources\PhaseResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'version'       => preg_replace('/(\.[0-9]+?)0*$/', '$1', $this->version),
            //'display_id' => $this->previous_calendar_id ? "{$this->previous_calendar_id}.{$this->id}" : $this->id,
            'course'        => "(" . $this->course->code . ") " . ($request->header("lang") == "en" ? $this->course->name_en : $this->course->name_pt),
            'semester'      => $this->semester->number == 0 ? ($request->header("lang") == "en" ? $this->semester->name_en : $this->semester->name_pt) : $this->semester->number,
            'phase'         => new PhaseResource($this->phase),
            'published'     => $this->is_published,
            'temporary'     => $this->is_temporary,
            'has_differences' => !empty($this->difference_from_previous_calendar)
        ];
    }

}
