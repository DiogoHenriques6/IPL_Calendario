<?php

namespace App\Http\Resources\API_V1\Exams;

use Illuminate\Http\Resources\Json\JsonResource;

class MethodResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'description'           => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->description_en : $this->description_pt),
            'evaluation_type'       => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->evaluationType->name_en : $this->evaluationType->name_pt),
            'minimum'               => (float) $this->minimum,
            'weight'                => (float) $this->weight,
        ];
    }
}
