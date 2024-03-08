<?php

namespace App\Http\Resources\Admin\Edit;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarPhaseDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                  => $this->id,
            'code'                => $this->code,
            'name_pt'             => $this->name_pt,
            'name_en'             => $this->name_en,
            'removable'           => $this->removable,
            'enabled'             => $this->enabled,
            'all_methods_filled'  => $this->all_methods_filled,
        ];
    }
}
