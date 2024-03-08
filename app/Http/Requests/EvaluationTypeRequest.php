<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EvaluationTypeRequest extends FormRequest
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

    public function rules()
    {
        $rules =  [
            'code'      => 'string|max:120|unique:evaluation_types,code,' . $this->id,
            'name_pt'   => 'string|max:255|unique:evaluation_types,name_pt,' . $this->id,
            'name_en'   => 'string|max:255|unique:evaluation_types,name_en,' . $this->id,
            'enabled'   => 'required|boolean',
        ];

        return $rules;
    }
}
