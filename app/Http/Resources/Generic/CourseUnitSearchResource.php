<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitSearchResource extends JsonResource
{
    public function toArray($request)
    {
        $lang_header = $request->header("lang");

        return [
                'id'                    => $this->id,
                'name'                  => ($lang_header == "en" ? $this->name_en : $this->name_pt),
                'course_description'    => ($lang_header == "en" ? $this->course->name_en : $this->course->name_pt) ." ({$this->course->code})",
                'initials'              => $this->initials,
                'code'                  => $this->code,
                'curricularYear'        => $this->curricular_year,
                'semester'              => $this->semester->number,
                'has_group'             => $this->group ? 1 : 0,
                'group_id'              => $this->group ? $this->group->id : null,
                'has_methods'           => $this->methods()->exists(),
                'has_responsable'       => !empty($this->responsible_user_id),
                'year'                  => $this->curricular_year,
                'school_id'             => $this->course->school_id,
            ];
    }
}
