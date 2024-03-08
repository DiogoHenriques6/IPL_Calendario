<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

use function Psy\debug;

class CourseUnitTeachersRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(Request $request)
    {
        return [
            "teachers" => "sometimes|array",
            "teachers.*.email" => "sometimes|email",
            "teachers.*.name" => "sometimes|string",
            "teachers.*.user_id" => "sometimes|exists:users,id"
        ];
    }
}
