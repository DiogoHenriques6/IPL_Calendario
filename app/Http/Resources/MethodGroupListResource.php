<?php

namespace App\Http\Resources;

use App\Http\Resources\Generic\CourseUnitResource;
use Illuminate\Http\Resources\Json\JsonResource;

class MethodGroupListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'  => $this->id,
//            'description' => ($request->header("lang") == "en" ? $this->description_en : $this->description_pt),
            'methods' => MethodResource::collection($this->methods),
            'course_units' => CourseUnitResource::collection($this->whenLoaded('methods', function() {
                return $this->methods->pluck('courseUnits')->flatten();})),
            'num_methods' => count($this->methods),
        ];
    }
}
