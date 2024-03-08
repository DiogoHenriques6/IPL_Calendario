<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Generic\CourseUnitResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitGroupListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'  => $this->id,
            'description' => ($request->header("lang") == "en" ? $this->description_en : $this->description_pt),
            'course_units' => CourseUnitResource::collection($this->whenLoaded('courseUnits')),
            'num_course_units' => count($this->courseUnits),
        ];
    }
}
