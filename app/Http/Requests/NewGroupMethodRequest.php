<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class NewGroupMethodRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "methods"                           => "required|array",
            "methods.*.id"                      => "sometimes|exists:methods,id",
            "methods.*.evaluation_type_id"      => "required|exists:evaluation_types,id",
            "methods.*.epoch_type_id"           => "required",
            "methods.*.course_unit_group_id"    => "required|exists:course_unit_groups,id",
            "methods.*.minimum"                 => "required|numeric",
            "methods.*.weight"                  => "required|numeric",
            'methods.*.description_pt'          => "required",
            'methods.*.description_en'          => "required",
            "removed"                           => "sometimes|array",
            "removed.*"                         => "integer|exists:methods,id"
        ];
    }
}
