<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarInfoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'permissions'   => $this->permissions,
            'filters' => [
                'has_courses'   => $this->has_courses,
                'semesters'     => $this->semesters,
            ]
        ];
    }

}
