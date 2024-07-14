<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseUnitGroupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "course_units"      => "required|array",
            "course_units.*"    => "required|integer|exists:course_units,id"
        ];
    }
}
