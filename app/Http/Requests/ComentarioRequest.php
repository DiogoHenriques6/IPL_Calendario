<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class ComentarioRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'avaliacao_id'          => 'required|exists:avaliacoes,id',
            'comentario'            => 'required|string|max:255'
        ];
    }

    public function messages() {
        return [];
    }

}
