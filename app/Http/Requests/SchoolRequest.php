<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SchoolRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'code'                              => 'required|string|unique:schools,code,' . $this->id,
            'name_en'                           => 'required|string',
            'name_pt'                           => 'required|string',
            'base_link'                         => 'sometimes|string',

            'index_course_code'                 => 'sometimes|numeric',
            'index_course_name_pt'              => 'sometimes|numeric',
            'index_course_name_en'              => 'sometimes|numeric',
            'index_course_initials'             => 'sometimes|numeric',
            'index_course_unit_code'            => 'sometimes|numeric',
            'index_course_unit_name_pt'         => 'sometimes|numeric',
            'index_course_unit_name_en'         => 'sometimes|numeric',
            'index_course_unit_initials'        => 'sometimes|numeric',
            'index_course_unit_curricular_year' => 'sometimes|numeric',
            'index_course_unit_teachers'        => 'sometimes|numeric',

            'index_course_unit_registered'      => 'sometimes|numeric',
            'index_course_unit_passed'          => 'sometimes|numeric',
            'index_course_unit_flunk'           => 'sometimes|numeric',
            'index_course_unit_branch'          => 'sometimes|numeric',

            'query_param_academic_year'         => 'sometimes|string',
            'query_param_semester'              => 'sometimes|string',
            'gop_group_id'                      => 'nullable|sometimes|exists:groups,id',
            'board_group_id'                    => 'nullable|sometimes|exists:groups,id',
            'pedagogic_group_id'                => 'nullable|sometimes|exists:groups,id',
        ];
        return $rules;
    }
}
