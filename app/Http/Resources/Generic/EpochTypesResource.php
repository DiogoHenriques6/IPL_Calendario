<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class EpochTypesResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'    => $this->id,
            'code'  => $this->code,
            'name'  => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
        ];
    }
}
