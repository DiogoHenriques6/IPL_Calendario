<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class IdiomaRequest extends FormRequest
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
            'nome'                  => 'required|string|max:120|unique:idiomas,nome,'.$this->id,
            'abreviatura'           => 'required|string|max:50|unique:idiomas,abreviatura,'.$this->id,
            'por_omissao'           => 'boolean',
        ];
    }

    public function messages() {
        return [
            'nome.required'                 => 'O Idioma de Interrupção é de preenchimento obrigatório.',
            'abreviatura.required'          => 'A Abreviatura de Interrupção é de preenchimento obrigatório.',
            'tipo_interrupcao_id.required'  => 'Ocorreu um erro a validar o campo "É o idioma principal?"',
        ];
    }

}
