<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class PermissionRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        $rules = [
            'group_id'      => 'required|integer|exists:groups,id,deleted_at,NULL',
            'permission_id' => 'required|integer|exists:permissions,id',
            'enabled'       => 'required|boolean',
            'phase_id'      => 'integer|nullable|exists:calendar_phases,id',
        ];

        return $rules;
    }
}
