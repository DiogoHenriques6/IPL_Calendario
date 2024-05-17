<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SelectedGroupSwitchRequest extends FormRequest
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
            'switch' => 'required|exists:groups,id'
        ];
    }

    public function messages()
    {
        return [
            'switch.required' => 'The group to switch to is required',
            'switch.exists' => 'The group to switch to does not exist'
        ];
    }
}
