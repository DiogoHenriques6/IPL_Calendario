<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMethodRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "evaluation_type_id" => "required|exists:evaluation_types,id",
            "epoch_id"           => "required|exists:epochs,id,deleted_at,NULL",
            "course_unit_id"     => "required|exists:course_units,id",
            "minimum"            => "required|numeric",
            "weight"             => "required|numeric",
            'description_pt'     => "required",
            'description_en'     => "required",
        ];
    }
}
