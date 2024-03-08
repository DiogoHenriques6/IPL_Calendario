<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "code"                => "required|string",
            "name"                => "required|string",
            "initials"            => "nullable|sometimes|string",
            "degree"              => "nullable|sometimes|numeric",
            "num_years"           => "nullable|sometimes|numeric",
            "branches"            => "sometimes|array",
            "branches.*.id"       => "sometimes|exists:branches,id",
            "branches.*.name"     => "required|string",
            "branches.*.initials" => "required|string"
        ];
    }
}
