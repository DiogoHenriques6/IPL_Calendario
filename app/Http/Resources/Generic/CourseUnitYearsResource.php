<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitYearsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'key'   => $this->year,
            'value' => $this->year,
            'text'  => $this->year
        ];
    }
}
