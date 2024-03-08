<?php

namespace App\Http\Resources\Admin\Edit;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupEditResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                        => $this->id,
            'name'                      => $this->code,
            'description_pt'            => $this->name_pt,
            'description_en'            => $this->name_en,
            'removable'                 => $this->when($this->whenLoaded('permissions', false), $this->removable),
            'enabled'                   => $this->when($this->whenLoaded('permissions', false), $this->enabled),
        ];
    }
}
