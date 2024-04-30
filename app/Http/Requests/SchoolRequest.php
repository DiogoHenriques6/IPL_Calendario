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

            'index_course_code'                 => 'sometimes|string',
            'index_course_name_pt'              => 'sometimes|string',
            'index_course_name_en'              => 'sometimes|string',
            'index_course_initials'             => 'sometimes|string',
            'index_course_unit_code'            => 'sometimes|string',
            'index_course_unit_name_pt'         => 'sometimes|string',
            'index_course_unit_name_en'         => 'sometimes|string',
            'index_course_unit_initials'        => 'sometimes|string',
            'index_course_unit_curricular_year' => 'sometimes|string',
            'index_course_unit_teachers'        => 'sometimes|string',

            'index_course_unit_registered'      => 'sometimes|string',
            'index_course_unit_passed'          => 'sometimes|string',
            'index_course_unit_flunk'           => 'sometimes|string',
            'index_course_unit_branch'          => 'sometimes|string',

            'query_param_academic_year'         => 'sometimes|string',
            'query_param_semester'              => 'sometimes|string',
            'gop_group_id'                      => 'nullable|sometimes|exists:groups,id',
            'board_group_id'                    => 'nullable|sometimes|exists:groups,id',
            'pedagogic_group_id'                => 'nullable|sometimes|exists:groups,id',
        ];
        return $rules;
    }
}
