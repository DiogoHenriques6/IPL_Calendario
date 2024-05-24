<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarLogsResource extends JsonResource
{
public function toArray($request)
    {
        return [
            'id' => $this->id,
            'academic_year' => $this->calendar->academicYear->display,
            'semester' =>  ($request->header("lang") == "en" ? $this->calendar->semester->name_en : $this->calendar->semester->name_pt),
            'new_date' => $this->new_date,
            'old_date' => $this->old_date ? $this->old_date : null,
            'course_unit_id' => $this->courseUnit->code,
            'course_unit_name' =>  $this->courseUnit->initials,
            'is_create' => $this->is_create,
            'is_update' => $this->is_update,
            'method_name' =>  ($request->header("lang") == "en" ? $this->exam->method->description_en : $this->exam->method->description_pt),
            'author' => $this->user->name,
            'created_at' => $this->created_at,
        ];
    }
}
