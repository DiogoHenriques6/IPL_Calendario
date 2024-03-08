<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(){
        $rules =  [
            'email'         => 'required|string|email',
            'password'      => 'required|string',
            'remember_me'    => 'required|boolean',
        ];

        return $rules;
    }
}
