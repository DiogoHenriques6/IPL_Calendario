<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class Calendar_SemesterResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'code'      => $this->code,
            'name'      => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'epochs'    => EpochTypesResource::collection($this->epochTypes),
        ];
    }
}
