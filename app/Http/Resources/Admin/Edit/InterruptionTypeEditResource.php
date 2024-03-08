<?php

namespace App\Http\Resources\Admin\Edit;

use Illuminate\Http\Resources\Json\JsonResource;

class InterruptionTypeEditResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'name_pt'   => $this->name_pt,
            'name_en'   => $this->name_en,
            'enabled'   => $this->enabled,
            'mandatory' => $this->mandatory,
        ];
    }
}
