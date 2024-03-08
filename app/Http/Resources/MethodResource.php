<?php

namespace App\Http\Resources;

use App\Models\EvaluationType;
use Illuminate\Http\Resources\Json\JsonResource;

class MethodResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                    => $this->id,
            'evaluation_type_id'    => $this->evaluation_type_id,
            'name'                  => ($request->header("lang") == "en" ? $this->evaluationType->name_en : $this->evaluationType->name_pt),
            'minimum'               => (float) $this->minimum,
            'weight'                => (float) $this->weight,
            'description'           => ($request->header("lang") == "en" ? $this->description_en : $this->description_pt),
            'description_pt'        => $this->description_pt,
            'description_en'        => $this->description_en,
            'is_blocked'            => $this->evaluation_type_id == EvaluationType::typeStatementRelease() || $this->evaluation_type_id == EvaluationType::typePublicOralPresentation(),
            'grouped_id'            => ''//TODO group by id of "parent" (like projet has those above in "blocked"
            //'epoch' => EpochResource::collection($this->epochs),
        ];
    }
}
