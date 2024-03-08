<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\FaseCalendario;

class GrupoRequest extends FormRequest {

    public function authorize() {
        return true;
    }

    public function rules() {
        $rules = [
            'nome'      => 'string|max:120|unique:grupos,nome,' . $this->id,
            'descricao' => 'string|max:255',
            'update'    => 'required|boolean',
            'inativo'   => 'required|boolean'
        ];

        // Com este for conseguimos criar uma regra para cada posicao do array de permissões
        if ($this->update) {
            $rules['id'] = 'required|integer|exists:grupos,id';
            $rules['permissoes'] = 'required|array';

            $rules['permissoesFase'] = FaseCalendario::count()>0 ? 'required|' : '';
            $rules['permissoesFase'] .= 'array';

            for ($i = 0; $i < count($this->permissoes); $i++) {
                $rules['permissoes.' . $i . '.id']              = 'required|integer|exists:grupo_permissao_assoc,id';
                $rules['permissoes.' . $i . '.grupo_id']        = 'required|integer|exists:grupos,id';
                $rules['permissoes.' . $i . '.permissao_id']    = 'required|integer|exists:permissoes,id';

                $rules['permissoes.' . $i . '.consultar']       = 'required|boolean';
                $rules['permissoes.' . $i . '.consultar_todos'] = 'required|boolean';
                $rules['permissoes.' . $i . '.adicionar']       = 'required|boolean';
                $rules['permissoes.' . $i . '.modificar']       = 'required|boolean';
                $rules['permissoes.' . $i . '.modificar_todos'] = 'required|boolean';
                $rules['permissoes.' . $i . '.apagar']          = 'required|boolean';
                $rules['permissoes.' . $i . '.apagar_todos']    = 'required|boolean';
            }

            for ($i = 0; $i < count($this->permissoesFase); $i++) {
                $rules['permissoesFase.' . $i . '.id']                  = 'required|integer|exists:fase_permissao_assoc,id';
                $rules['permissoesFase.' . $i . '.grupo_id']            = 'required|integer|exists:grupos,id';
                $rules['permissoesFase.' . $i . '.permissao_id']        = 'required|integer|exists:permissoes,id';
                $rules['permissoesFase.' . $i . '.fase_calendario_id']  = 'required|integer|exists:fases_calendario,id';

                $rules['permissoesFase.' . $i . '.consultar']           = 'required|boolean';
                $rules['permissoesFase.' . $i . '.consultar_todos']     = 'required|boolean';
                $rules['permissoesFase.' . $i . '.adicionar']           = 'required|boolean';
                $rules['permissoesFase.' . $i . '.modificar']           = 'required|boolean';
                $rules['permissoesFase.' . $i . '.modificar_todos']     = 'required|boolean';
                $rules['permissoesFase.' . $i . '.apagar']              = 'required|boolean';
                $rules['permissoesFase.' . $i . '.apagar_todos']        = 'required|boolean';
            }
        }

        return $rules;
    }

    public function messages() {
        return [
            'nome.required' => 'O Nome do Grupo é de preenchimento obrigatório.',
            'nome.unique' => 'O Nome do Grupo já existe.',
            'descricao.required' => 'A Descrição do Grupo é de preenchimento obrigatório.',
            'permissoes.required' => 'As permissões gerais são de preenchimento obrigatório.',
            'permissoesFase.required' => 'As permissões do calendário são de preenchimento obrigatório.'
        ];
    }

}
