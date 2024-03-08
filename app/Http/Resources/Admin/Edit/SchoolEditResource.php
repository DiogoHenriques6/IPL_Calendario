<?php

namespace App\Http\Resources\Admin\Edit;

use Illuminate\Http\Resources\Json\JsonResource;

class SchoolEditResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'code'          => $this->code,
            'name_en'       => $this->name_en,
            'name_pt'       => $this->name_pt,
            'base_link'                         => $this->base_link,

            'index_course_code'                 => $this->index_course_code,
            'index_course_name_pt'              => $this->index_course_name_pt,
            'index_course_name_en'              => $this->index_course_name_en,
            'index_course_initials'             => $this->index_course_initials,
            'index_course_unit_code'            => $this->index_course_unit_code,
            'index_course_unit_name_pt'         => $this->index_course_unit_name_pt,
            'index_course_unit_name_en'         => $this->index_course_unit_name_en,
            'index_course_unit_initials'        => $this->index_course_unit_initials,
            'index_course_unit_curricular_year' => $this->index_course_unit_curricular_year,
            'index_course_unit_teachers'        => $this->index_course_unit_teachers,

            'index_course_unit_registered'      => $this->index_course_unit_registered,
            'index_course_unit_passed'          => $this->index_course_unit_passed,
            'index_course_unit_flunk'           => $this->index_course_unit_flunk,
            'index_course_unit_branch'          => $this->index_course_unit_branch,

            'query_param_academic_year'         => $this->query_param_academic_year,
            'query_param_semester'              => $this->query_param_semester,
            'gop_group_id'                      => $this->gop_group_id,
            'board_group_id'                    => $this->board_group_id,
            'pedagogic_group_id'                => $this->pedagogic_group_id,
        ];
    }
}
