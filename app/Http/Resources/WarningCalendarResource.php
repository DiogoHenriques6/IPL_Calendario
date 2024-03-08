<?php

namespace App\Http\Resources;

use App\Models\CourseUnit;
use Illuminate\Http\Resources\Json\JsonResource;

class WarningCalendarResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'name'          => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'initials'      => $this->initials,
            'methods'       => $this->methods->isNotEmpty() ? WarningMethodsResource::collection($this->methods) : [],
            'is_complete'   => $this->is_complete && $this->methods->isNotEmpty(),
            'has_methods'   => $this->methods->isNotEmpty(),
            //'branch' => $this->branch,
        ];
    }
}
