<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitGroupSearchResource extends JsonResource
{
    public function toArray($request)
    {
        $lang_header = $request->header("lang");

        return [
            'key'   => $this->id,
            'value' => $this->id,
            'text'  => ($request->header("lang") == "en" ? $this->description_en : $this->description_pt)
        ];
    }
}
