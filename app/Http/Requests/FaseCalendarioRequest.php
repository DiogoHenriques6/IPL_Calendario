<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class FaseCalendarioRequest extends FormRequest
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
    public function rules(){
        $rules =  [
            'nome'                                  => 'string|max:120|unique:fases_calendario,nome,'.$this->id,
            'descricao'                             => 'string|max:255|unique:fases_calendario,descricao,'.$this->id,
            'update'                                => 'required|boolean',
            'inativo'                               => 'required|boolean',
            'traducoes'                             => 'required|array',
            'traducoes.*.id_idioma'                 => 'required|integer|exists:idiomas,id',
            'traducoes.*.por_omissao'               => 'required|boolean',
            'traducoes.*.nome_in_idiomas'           => 'required|string|max:255',
            'traducoes.*.abreviatura_in_idiomas'    => 'required|string|max:50',
        ];

        // Com este for conseguimos criar uma regra para cada posicao do array de traduções, nomeadamente os uniques
        // Cada unique leva à frente o id da tradução, para forçar que o mesmo seja ignorado em caso de update, para aquela tradução especifica
        // no IF validamos que aqueles id's só têm de existir na tabelas em caso de update. Na inserção de novo TipoInterrupçao, como vem a false esses ids são ignorados
        for ($i = 0; $i < count($this->traducoes); $i++) {
            if($this->update) {
                $rules['id']                            = 'required|integer|exists:fases_calendario,id';
                $rules['traducoes.' . $i . '.id']       = 'required|integer|exists:traducoes,id';
            }
            // $rules['traducoes.' . $i . '.nome']         = 'required|string|max:255|unique:traducoes,nome,' . $this->traducoes[$i]['id'];
            // $rules['traducoes.' . $i . '.descricao']    = 'required|string|max:255|unique:traducoes,descricao,' . $this->traducoes[$i]['id'];
        }

        return $rules;
    }

    public function messages() {
        return [
            'nome.required'         => 'A Tipo de Interrupção é de preenchimento obrigatório.',
            'descricao.required'    => 'A Descrição é de preenchimento obrigatório.',
            'traducoes.required'    => 'Não foi encontrado o array de idiomas com as traduções! O mesmo é obrigatório.'
        ];
    }

}
