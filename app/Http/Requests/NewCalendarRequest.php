<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewCalendarRequest extends FormRequest
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
            'semester'                              => 'required|string|exists:semesters,code',
            'observations'                          => 'nullable|string|max:255',
            'epochs'                                => 'required',
            'week_ten'                              => $this->week_ten ? 'date_format:Y-m-d' : 'nullable',
            'epochs.*.code'                         => 'required|string|exists:epoch_types,code',
            'epochs.*.start_date'                   => 'required|date_format:Y-m-d|before:epochs.*.end_date',
            'epochs.*.end_date'                     => 'required|date_format:Y-m-d|after:epochs.*.start_date',
            'interruptions.*.start_date'            => 'required|date_format:Y-m-d|before_or_equal:interruptions.*.end_date',
            'interruptions.*.end_date'              => 'required|date_format:Y-m-d|after_or_equal:interruptions.*.start_date',
            'interruptions.*.description'           => 'nullable',
            'interruptions.*.interruption_type_id'  => 'required|exists:interruption_types,id',
            'is_all_courses'                        => 'required|boolean',
            'courses'                               => ['exists:courses,id,deleted_at,NULL', Rule::requiredIf(function () {
                return !$this->is_all_courses;
            })]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'semester.required'     => 'Tem de preencher qual o semestre/época do calendário',
            'semester.exists'       => 'O semestre/época tem de ser valida para criar do calendário',
            'epochs.required'                       => 'Tem de preencher as datas do calendário',
            'epochs.*.code.required'                => 'Tem de preencher as datas do calendário',
            'epochs.*.start_date.required'          => 'Tem de preencher as datas do calendário',
            'epochs.*.end_date.required'            => 'Tem de preencher as datas do calendário',
            'epochs.*.start_date.before_or_equal'   => "A data de inicio tem de ser inferior a data de fim",
            'epochs.*.end_date.after_or_equal'      => "A data de inicio tem de ser superior a data de inicio",
            'interruptions.*.start_date.required'            => "Tem de preencher o campo data de inicio para poder criar o calendário",
            'interruptions.*.end_date.required'              => "Tem de preencher o campo data de fim para poder criar o calendário",
            'interruptions.*.start_date.before_or_equal'     => "A data de inicio tem de ser inferior a data de fim",
            'interruptions.*.end_date.after_or_equal'        => "A data de inicio tem de ser superior a data de inicio",
            'interruptions.*.description.required'           => "Tem de preencher o campo descrição para poder criar o calendário",
            'interruptions.*.interruption_type_id.required'  => "Tem de preencher o campo tipo de interrupção para poder criar o calendário",
        ];
    }
}
