<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class CloneMethodRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "copy_course_unit_id"               => "required|exists:course_units,id",
            "new_course_unit_id"                => "required|exists:course_units,id",
            "removed"                           => "sometimes|array",
            "removed.*"                         => "integer|exists:methods,id"
        ];
    }
}
