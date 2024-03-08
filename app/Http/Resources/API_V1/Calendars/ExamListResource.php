<?php

namespace App\Http\Resources\API_V1\Calendars;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'date_start'        => $this->date_start,
            'date_end'          => $this->date_end,
            'method'            => new MethodResource($this->method),
            'course_unit'       => new CourseUnitResource(($this->courseUnitDirect ? $this->courseUnitDirect : $this->courseUnit)),
        ];
    }
}
