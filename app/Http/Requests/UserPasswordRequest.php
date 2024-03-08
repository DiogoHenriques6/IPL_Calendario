<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserPasswordRequest extends FormRequest
{

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Password::defaults(function () {
            // Require at least 8 characters...
            // Require at least one uppercase and one lowercase letter...
            // Require at least one number...
            $rule = Password::min(8)->mixedCase()->numbers();
            // Require at least one symbol...
            // ->symbols()
            return $rule;
        });
    }

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'old' => 'required',
            'new' => ['required', Password::min(8)->mixedCase()->numbers()],
            'confirm' => 'required|same:new',
        ];
        return $rules;
    }
    public function messages()
    {
        return [
            'old.required'  => 'A password atual é obrigatória',

            'new.required'      => 'A nova password é obrigatória',
            'new.min'           => 'A nova password tem de ter pelo menos 8 digitos',
            'new.mixedCase'     => 'A nova password tem de ter pelo menos uma letra maiuscula e uma minuscula',
            'new.numbers'       => 'A nova password tem de ter pelo menos um numero',

            'confirm.required'  => 'A confirmação da password é obrigatória',
            'confirm.same'      => 'A confirmação da password tem de ser igual à nova password',
        ];
    }
}
