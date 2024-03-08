<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class GroupRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "code"      => "required|string|unique:groups,code," . $this->id,
            "name_pt"   => "required|string",
            "name_en"   => "required|string",
            "enabled"   => "boolean"
        ];
    }

    public function messages() {
        return [
            'code.required'     => 'O código é de preenchimento obrigatório.',
            'code.unique'       => 'O código já está a ser utilizado noutro grupo.',
            'name_pt.required'  => 'A Descrição PT é de preenchimento obrigatório.',
            'name_en.required'  => 'A Descrição EN é de preenchimento obrigatório.'
        ];
    }
}
