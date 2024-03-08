<?php

namespace App\Http\Resources\Admin\Edit;

use App\Http\Resources\Generic\CourseUnitResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitGroupResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'  => $this->id,
            'description_pt' => $this->description_pt,
            'description_en' => $this->description_en,
            'course_units' => CourseUnitResource::collection($this->whenLoaded('courseUnits')),
            'num_course_units' => count($this->courseUnits),
        ];
    }
}
