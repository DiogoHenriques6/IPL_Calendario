<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitExamResource extends JsonResource
{
    public function toArray($request)
    {
        $lang_name = ($request->header("lang") == "en" ? $this->name_en : $this->name_pt);
        return [
            'id'                    => $this->id,
            'code'                  => $this->code,
            'curricular_year'       => $this->curricular_year,
            'name'                  => $lang_name,
            'initials'              => $this->initials,
            'semester'              => $this->semester->number,


            'name_full'             => $lang_name . ($this->branch->branch_number == 0 ? '' : ' (' . ($request->header("lang") == "en" ? $this->branch->initials_en : $this->branch->initials_pt) . ')' ),

            'course'        => [
                "id"            => $this->course_id,
                'name'          => "(" . $this->course->code . ") " . ($request->header("lang") == "en" ? $this->course->name_en : $this->course->name_pt),
            ],
            'responsible'   => [
                'id'            => $this->whenLoaded('responsibleUser', $this->responsible_user_id),
                "name"          => $this->whenLoaded('responsibleUser', is_null($this->responsibleUser) ? null :  $this->responsibleUser->name),
                'email'         => $this->whenLoaded('responsibleUser', is_null($this->responsibleUser) ? null :  $this->responsibleUser->email),
            ],
            'branch'        => [
                "id"            => $this->branch_id,
                "name"          => ($request->header("lang") == "en" ? $this->branch->name_en : $this->branch->name_pt),
                "initials"      => ($request->header("lang") == "en" ? $this->branch->initials_en : $this->branch->initials_pt),
                "is_common"     => $this->branch->branch_number == 0,
            ],
        ];
    }
}

