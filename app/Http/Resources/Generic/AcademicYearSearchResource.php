<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearSearchResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'key'           => $this->id,
            'value'         => $this->id,
            'text'          => $this->display,
            'description'   => (!!$this->selected ? ($request->header("lang") == "en" ? "Current Year" : "Ano a decorrer") : null)
        ];
    }
}
