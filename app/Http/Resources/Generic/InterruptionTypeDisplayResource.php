<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class InterruptionTypeDisplayResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'label'     => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'enabled'   => $this->enabled,

        ];
    }
}
