<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class SemestersSearchResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'key'   => $this->id,
            'value' => $this->id,
            'text'  => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
        ];
    }
}
