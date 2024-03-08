<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class SchoolListResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'value'     => $this->id,
            'text'      => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt)
        ];
    }
}
