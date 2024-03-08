<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class InterrupcaoRequest extends FormRequest
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
            'data_inicio'           => 'required|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:d/m/Y',
            'data_fim'              => 'required|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:d/m/Y',
            'descricao'             => 'nullable|string|max:255',
            'tipo_interrupcao_id'   => 'required|exists:tipos_interrupcoes,id',
            'calendario_id'         => 'required|exists:calendarios_avaliacoes,id',
        ];
    }

    public function messages() {
        return [
            'data_inicio.required'           => 'A Data Inicio é de preenchimento obrigatório.',
            'data_fim.required'              => 'A Data Inicio é de preenchimento obrigatório.',
            'tipo_interrupcao_id.required'   => 'O Tipo de Interrupção é de preenchimento obrigatório.',
            'calendario_id.required'         => 'O Calendário de Avaliação é de preenchimento obrigatório.',
        ];
    }

}
