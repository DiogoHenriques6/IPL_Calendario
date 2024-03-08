<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class PermissaoRequest extends FormRequest
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
            'nome'              => 'required|string|max:120|unique:permissoes,nome,'.$this->id,
            'descricao'         => 'required|string|max:50|unique:permissoes,descricao,'.$this->id,
            'categoria'         => 'required|string|max:50|unique:permissoes,categoria,'.$this->id
        ];
    }

    public function messages() {
        return [
            'nome.required'         => 'O Idioma de Interrupção é de preenchimento obrigatório.',
            'descricao.required'    => 'A Abreviatura de Interrupção é de preenchimento obrigatório.',
            'categoria.required'    => 'Ocorreu um erro a validar o campo "É o idioma principal?"',
        ];
    }

}
