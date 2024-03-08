<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class NewExamRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(Request $request)
    {
        $newExamRules = $request->isMethod('POST') ?
            [
                "method_id"         => "required|exists:methods,id",
                "epoch_id"          => "required|exists:epochs,id,deleted_at,NULL",
                "course_unit_id"    => "required|exists:course_units,id"
            ] : [];

        return array_merge($newExamRules, [
                "calendar_id"       => "required|exists:calendars,id,deleted_at,NULL",
                "course_id"         => "required|exists:courses,id,deleted_at,NULL",
                "date_start"        => "required|date_format:Y-m-d",
                "date_end"          => "required|date_format:Y-m-d",

                "in_class"          => "required|boolean",
                "hour"              => "date_format:H:i",
                "room"              => "string",
                "duration_minutes"  => "integer|numeric",
                "observations_pt"   => "nullable|string",
                "observations_en"   => "nullable|string",
                "description_pt"    => "nullable|string",
                "description_en"    => "nullable|string"
            ]);

    }
}
