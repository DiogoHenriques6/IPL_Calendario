<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewInterruptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'calendar_id'           => 'required|exists:calendars,id,deleted_at,NULL',
            'interruption_type_id'  => 'required|exists:interruption_types,id,deleted_at,NULL',
            'start_date'            => 'required|date_format:Y-m-d|before_or_equal:end_date',
            'end_date'              => 'required|date_format:Y-m-d|after_or_equal:start_date',
            'description'           => 'nullable',
            'enabled'               => 'boolean',
        ];
    }
}
