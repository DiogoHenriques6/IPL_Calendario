<?php

namespace App\Http\Resources\API_V1\Calendars;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamCalendarResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'method'                => [
                "id"            => $this->method_id,
                "name"          => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->method->evaluationType->name_en : $this->method->evaluationType->name_pt),
                "description"   => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->method->description_en : $this->method->description_pt),
            ],
            'date_start'            => Carbon::create($this->date_start)->format('Y-m-d'),
            'date_end'              => Carbon::create($this->date_end)->format('Y-m-d'),
            'in_class'              => $this->in_class,
            'hour'                  => $this->hour,
            'room'                  => $this->room,
            'duration_minutes'      => $this->duration_minutes,
            'observations'          => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->observations_en : $this->observations_pt),
            'description'           => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->description_en : $this->description_pt),

            'course_unit'       => new CourseUnitResource(($this->courseUnitDirect ? $this->courseUnitDirect : $this->courseUnit)),
        ];
    }
}

