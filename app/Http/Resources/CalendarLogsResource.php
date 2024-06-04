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
            'epoch_name' => $this->exam->epoch->name,
            'semester' =>  ($request->header("lang") == "en" ? $this->calendar->semester->name_en : $this->calendar->semester->name_pt),
            'new_date' => $this->new_date ? (new \DateTime($this->new_date))->format('d-m-Y') : null,
            'old_date' => $this->old_date ? (new \DateTime($this->old_date))->format('d-m-Y') : null,
            'course_unit_name' =>  $this->courseUnit->initials,
            'is_create' => $this->is_create,
            'is_update' => $this->is_update,
            'method_initials' =>  ($request->header("lang") == "en" ? $this->exam->method->initials_en : $this->exam->method->initials_pt),
            'author' => $this->user->name,
            'created_at' => (new \DateTime($this->created_at))->format('d-m-Y H:i:s'),
        ];
    }
}
