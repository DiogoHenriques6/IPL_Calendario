<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MethodGroupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "epoch_type_id"       => "required|integer|exists:epoch_types,id",
            "methods"      => "required|array",
            "methods.*.value"    => "required|integer|exists:methods,id",
            "methods.*.courseUnits"    => "required|integer|exists:course_units,id"
        ];
    }
}
