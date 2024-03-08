<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AvaliacaoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'data'                  => 'required|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:d/m/Y',
            'unidade_curricular_id' => 'required|exists:unidades_curriculares,id',
            'epoca_id'              => 'required|exists:epocas,id',
            'hora'                  => 'required|integer|min:0|max:23',
            'minuto'                => 'required|integer|min:0|max:59',
            'duracao_minutos'       => 'nullable|integer|min:1|max:300',
            'sala'                  => 'nullable|string|max:255',
            'observacoes'           => 'nullable|string|max:255',
        ];
    }

    public function messages() {
        return [];
    }

}
