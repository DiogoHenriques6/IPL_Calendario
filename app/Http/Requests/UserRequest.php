<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'enabled' => 'sometimes|boolean',
            'groups' => 'sometimes|array',
            'groups.*' => 'required|exists:groups,id'
        ];
        return $rules;
    }
}
