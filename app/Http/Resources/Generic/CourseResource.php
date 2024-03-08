<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\Generic\UserWithGroupsResource;
use App\Services\DegreesUtil;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray($request)
    {

        return [
            'id'            => $this->id,
            'code'          => $this->code,
            'initials'      => $this->initials,
            'display_name'  => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt) . " (" . $this->code . ")",
            'name_pt'       => $this->name_pt,
            'name_en'       => $this->name_en,
            'duration'      => $this->num_years,
            'degree_id'     => $this->degree,
            'degree_label'  => DegreesUtil::getDegreeLabel($this->degree),
            'school'        => $this->whenLoaded('school'),
            'coordinator'   => $this->coordinatorUser
        ];
    }
}
