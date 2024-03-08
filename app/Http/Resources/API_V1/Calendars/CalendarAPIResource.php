<?php

namespace App\Http\Resources\API_V1\Calendars;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarAPIResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'course'        => [
                "code"          => $this->course->code,
                'name'          => "(" . $this->course->code . ") " . (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->course->name_en : $this->course->name_pt),
            ],

            'date_start'        => $this->firstDayOfSchool(),
            'date_end'          => $this->lastDayOfSchool(),
            'date_week_ten'     => $this->week_ten,

            'epochs'        => EpochWithExamsResource::collection($this->epochs),
            'interruptions' => InterruptionListResource::collection($this->interruptions),

            'semester'      => $this->semester->number,
        ];
    }
}

