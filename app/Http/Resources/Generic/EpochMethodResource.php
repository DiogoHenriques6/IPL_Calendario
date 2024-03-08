<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class EpochMethodResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'name'      => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'methods'   => [],
        ];
    }
}
