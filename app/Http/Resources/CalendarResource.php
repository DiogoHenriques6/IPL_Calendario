<?php

namespace App\Http\Resources;

use App\Http\Resources\Generic\CourseResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'version'   => preg_replace('/(\.[0-9]+?)0*$/', '$1', $this->version),
            //'display_id' => $this->previous_calendar_id ? "{$this->previous_calendar_id}.{$this->id}" : $this->id,
            'course'    => new CourseResource($this->course),
            'phase'     => new PhaseResource($this->phase),
            'published' => $this->is_published,
            'temporary' => $this->is_temporary,
            'semester'  => $this->semester->special ? "Especial" : $this->semester->number,
            'epochs'    => EpochResource::collection($this->whenLoaded('epochs', $this->epochs()->with(['exams', 'exams.comments'])->get())),
            'interruptions' => InterruptionResource::collection($this->whenLoaded('interruptions')),
            'general_info'  => new CalendarGeneralInfoResource([
                "phase"         => $this->phase,
                "calendar"      => $this,
                "course"        => $this->course
            ]),
            'differences'               => $this->difference_from_previous_calendar,
            'previous_from_definitive'  => $this->previousCalendar ? !$this->previousCalendar->is_temporary : false,
        ];
    }

}
