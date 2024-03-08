<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExamCommentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "exam_id" => ["exists:exams,id", Rule::requiredIf(function () {
                return !$this->ignored;
            })],
            "comment" => ["string", Rule::requiredIf(function () {
                return !$this->ignored;
            })],
            "ignored" => "sometimes|boolean"
        ];
    }
}
