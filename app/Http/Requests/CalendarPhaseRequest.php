<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalendarPhaseRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'code'               => 'required|string|unique:calendar_phases,code,' . $this->id,
            'name_pt'            => 'required|string',
            'name_en'            => 'required|string',
            "enabled"            => "sometimes|boolean",
            'all_methods_filled' => "sometimes|boolean",
        ];
    }
}
