<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PhaseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'name'        => $this->code,
            'description' => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
        ];
    }
}
