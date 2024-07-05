<?php

namespace App\Http\Resources\Admin\Edit;

use Illuminate\Http\Resources\Json\JsonResource;

class SchoolEditResource extends JsonResource
{

    public $webservice;

    public function __construct($resource, $webservice)
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);
        $this->webservice = $webservice;
    }

    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'code'          => $this->code,
            'name_en'       => $this->name_en,
            'name_pt'       => $this->name_pt,
            'base_link'                         => $this->webservice->base_link,
            'course_units_link'                 => $this->webservice->course_units_link,
            'teachers_by_uc_link'               => $this->webservice->teachers_by_uc_link,
            'teachers_link'                     => $this->webservice->teachers_link,

            'index_course_code'                 => $this->webservice->index_course_code,
            'index_course_name_pt'              => $this->webservice->index_course_name_pt,
            'index_course_name_en'              => $this->webservice->index_course_name_en,
            'index_course_initials'             => $this->webservice->index_course_initials,
            'index_course_schedule'             => $this->webservice->index_course_schedule,
            'index_course_unit_code'            => $this->webservice->index_course_unit_code,
            'index_course_unit_name_pt'         => $this->webservice->index_course_unit_name_pt,
            'index_course_unit_name_en'         => $this->webservice->index_course_unit_name_en,
            'index_course_unit_initials'        => $this->webservice->index_course_unit_initials,
            'index_course_unit_curricular_year' => $this->webservice->index_course_unit_curricular_year,
            'index_course_unit_teachers'        => $this->webservice->index_course_unit_teachers,
            'index_docentes_name'               => $this->webservice->index_docentes_name,
            'index_docentes_email'              => $this->webservice->index_docentes_email,

            'index_course_unit_registered'      => $this->webservice->index_course_unit_registered,
            'index_course_unit_passed'          => $this->webservice->index_course_unit_passed,
            'index_course_unit_flunk'           => $this->webservice->index_course_unit_flunk,
            'index_course_unit_branch'          => $this->webservice->index_course_unit_branch,

            'query_param_academic_year'         => $this->webservice->query_param_academic_year,
            'query_param_semester'              => $this->webservice->query_param_semester,
            'query_param_course'                => $this->webservice->query_param_course,
            'query_param_campus'                => $this->webservice->query_param_campus,
            'query_param_course_unit'           => $this->webservice->query_param_course_unit,
            'gop_group_id'                      => $this->gop_group_id,
            'board_group_id'                    => $this->board_group_id,
            'pedagogic_group_id'                => $this->pedagogic_group_id,
            'index_campus'                      => $this->index_campus,

        ];
    }
}
