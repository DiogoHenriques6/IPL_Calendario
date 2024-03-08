<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class CalendarioAvaliacaoRequest extends FormRequest
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
            // Ação de ALTERAR FASE fica apenas disponível numa rota à parte
            // 'fase_calendario_id'    => 'nullable|numeric|exists:fases_calendario,id',
            'semestre'                          => 'required|integer|min:1|max:3',
            'observacoes'                       => 'nullable|string|max:255',
            'obsoleto'                          => 'nullable|boolean', // na BD tem default value '0'
            'epocas.periodica.data_inicio'      => $this->semestre == 1 || $this->semestre == 2 ? 'required_if:semestre,==,1,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d|before_or_equal:epocas.periodica.data_fim' : '',
            'epocas.periodica.data_fim'         => $this->semestre == 1 || $this->semestre == 2 ? 'required_if:semestre,==,1,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d|after_or_equal:epocas.periodica.data_inicio' : '',

            'epocas.normal.data_inicio'         => $this->semestre == 1 || $this->semestre == 2 ? 'required_if:semestre,==,1,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d|before_or_equal:epocas.normal.data_fim' : '',
            'epocas.normal.data_fim'            => $this->semestre == 1 || $this->semestre == 2 ? 'required_if:semestre,==,1,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d|after_or_equal:epocas.normal.data_inicio' : '',

            'epocas.recurso.data_inicio'        => $this->semestre == 1 || $this->semestre == 2 ? 'required_if:semestre,==,1,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d|before_or_equal:epocas.recurso.data_fim' : '',
            'epocas.recurso.data_fim'           => $this->semestre == 1 || $this->semestre == 2 ? 'required_if:semestre,==,1,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d|after_or_equal:epocas.recurso.data_inicio' : '',

            'epocas.especial.data_inicio'       => $this->semestre == 3 ? 'required_if:semestre,==,3|date_format:Y-m-d|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|before_or_equal:epocas.especial.data_fim' : '',
            'epocas.especial.data_fim'          => $this->semestre == 3 ? 'required_if:semestre,==,3|date_format:Y-m-d|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|after_or_equal:epocas.especial.data_inicio' : '',

            'interrupcoes.*.tipo_interrupcao_id'        => 'sometimes|exists:tipos_interrupcoes,id',
            'interrupcoes.*.data_inicio'                => 'sometimes|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d',
            'interrupcoes.*.data_fim'                   => 'sometimes|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d',
            'interrupcoes.natal.tipo_interrupcao_id'    => '',
            'interrupcoes.natal.data_inicio'            => $this->semestre == 1 ? 'required_if:semestre,==,1|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d': '',
            'interrupcoes.natal.data_fim'               => $this->semestre == 1 ? 'required_if:semestre,==,1|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d': '',
            'interrupcoes.pascoa.tipo_interrupcao_id'   => '',
            'interrupcoes.pascoa.data_inicio'           => $this->semestre == 2 ? 'required_if:semestre,==,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d': '',
            'interrupcoes.pascoa.data_fim'              => $this->semestre == 2 ? 'required_if:semestre,==,2|before_or_equal:' . Carbon::create(2038,1,1) . '|after_or_equal:' . Carbon::create(1970,1,1) . '|date_format:Y-m-d': '',

            'interrupcoes.length'                       => '', // bypass, não remover
            'interrupcoes.length.data_inicio'           => '', // bypass, não remover
            'interrupcoes.length.data_fim'              => '', // bypass, não remover
            'interrupcoes.length.tipo_interrupcao_id'   => '', // bypass, não remover

            'cursos_todos'                      => 'nullable|boolean',
            'cursos'                            => !$this->cursos_todos ? 'required' : '',
            'cursos.*.id'                       => !$this->cursos_todos ? 'required|exists:cursos,id' : '',
            'importar_feriados'                 => 'nullable|boolean',
        ];
    }
            
    public function messages() {
        return [
            'cursos.required'                       => 'O(s) Curso(s) é(são) de preenchimento obrigatório',
            'semestre.required'                     => 'O Semestre é de preenchimento obrigatório',
            'observacoes.required'                  => 'As Observacoes são de preenchimento obrigatório',
            'epocas.required'                       => 'As Épocas são de preenchimento obrigatório',
            'epocas.*.data_inicio.required'         => 'A Data de Inicio é obrigatória em cada uma das Épocas',
            'epocas.*.data_fim.required'            => 'A Data de Fim é obrigatória em cada uma das Épocas',
            'interrupcoes.required'                 => 'As Épocas são de preenchimento obrigatório',
            'interrupcoes.*.data_inicio.required'   => 'A Data de Inicio é obrigatória em cada uma das Interrupcoes',
            'interrupcoes.*.data_fim.required'      => 'A Data de Fim é obrigatória em cada uma das Interrupcoes',
            'epocas.periodica.data_inicio.before_or_equal'  => 'A Data de Inicio da Época Periódica tem de ser inferior à Data de Fim',
            'epocas.periodica.data_fim.after_or_equal'      => 'A Data de Fim da Época Periódica tem de ser superior à Data de Inicio',

            'epocas.normal.data_inicio.before_or_equal'     => 'A Data de Inicio da Época Normal tem de ser inferior à Data de Fim',
            'epocas.normal.data_fim.after_or_equal'         => 'A Data de Fim da Época Normal tem de ser superior à Data de Inicio',

            'epocas.recurso.data_inicio.before_or_equal'    => 'A Data de Inicio da Época Recurso tem de ser inferior à Data de Fim',
            'epocas.recurso.data_fim.after_or_equal'        => 'A Data de Fim da Época Recurso tem de ser superior à Data de Inicio',

            'epocas.especial.data_inicio.before_or_equal'   => 'A Data de Inicio da Época Especial tem de ser inferior à Data de Fim',
            'epocas.especial.data_fim.after_or_equal'       => 'A Data de Fim da Época Especial tem de ser superior à Data de Inicio',
        ];
    }
}
