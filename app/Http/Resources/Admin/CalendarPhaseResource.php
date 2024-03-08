<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarPhaseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                 => $this->id,
            'name'               => $this->code,
            'description'        => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'removable'          => $this->removable,
            'enabled'            => $this->enabled,
            'all_methods_filled' => $this->all_methods_filled,
        ];
    }
}
