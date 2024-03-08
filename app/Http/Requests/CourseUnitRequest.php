<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

use function Psy\debug;

class CourseUnitRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(Request $request)
    {
        $newCourseUnitRules = $request->isMethod('POST') ? [
            "course_id" => "required|exists:courses,id",
            "branch_id" => "required|exists:branches,id",
        ] : ["branch_id" => "nullable|sometimes|exists:branches,id"];

        return array_merge($newCourseUnitRules, [
            "code" => "required|string",
            "name_pt" => "required|string",
            "name_en" => "required|string",
            "initials" => "required|string",
            "curricular_year" => "required|numeric",
            "semester" => "required|numeric",
            "responsible_user_id" => "sometimes|exists:users,id",
            "teachers" => "sometimes|array",
            "teachers.*.email" => "sometimes|email",
            "teachers.*.name" => "sometimes|string",
            "teachers.*.user_id" => "sometimes|exists:users,id"
        ]);
    }
}
