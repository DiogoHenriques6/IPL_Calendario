<?php

namespace App\Http\Resources\API_V1\Calendars;

use Illuminate\Http\Resources\Json\JsonResource;

class EpochWithExamsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'code'          => $this->epochType->code,
            'start_date'    => $this->start_date,
            'end_date'      => $this->end_date,
            'name'          => ($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->epochType->name_en : $this->epochType->name_pt,
            'exams'         => ExamCalendarResource::collection($this->exams),
        ];
    }
}
