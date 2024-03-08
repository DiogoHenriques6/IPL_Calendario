<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\MethodResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitResource extends JsonResource
{
    public function toArray($request)
    {
        return [

            'id'                    => $this->id,
            'code'                  => $this->code,
            'curricularYear'        => $this->curricular_year,
            'name'                  => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'initials'              => $this->initials,
            'group_name'            => $this->group->description ?? null,
            'course_description'    => "(" . $this->course->code . ") " . ($request->header("lang") == "en" ? $this->course->name_en : $this->course->name_pt),
            'semester'              => $this->semester->number,
            'responsible_name'      => $this->whenLoaded('responsibleUser', is_null($this->responsibleUser) ? null :  $this->responsibleUser->name),
            'responsible_email'     => $this->whenLoaded('responsibleUser', is_null($this->responsibleUser) ? null :  $this->responsibleUser->email),
            'responsible_id'        => $this->whenLoaded('responsibleUser', $this->responsible_user_id),

            'branch'    => $this->branch,
            'methods'   => MethodResource::collection($this->whenLoaded('methods')),
            'teachers'  => TeacherResource::collection($this->teachers)
        ];
    }
}

