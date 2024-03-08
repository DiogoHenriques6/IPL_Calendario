<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCalendarRequest extends FormRequest
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
            'calendar_phase_id' => 'sometimes|exists:calendar_phases,id',
            'temporary'         => 'sometimes|boolean',
            'published'         => 'sometimes|boolean',
            'groups'            => 'sometimes|array'
        ];
    }
}
