<?php

namespace App\Http\Resources;

use App\Models\Exam;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailableMethodsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this["id"],
            'name'          => ($request->header("lang") == "en" ? $this["evaluation_type"]["name_en"] : $this["evaluation_type"]["name_pt"]),
            'description'   => ($request->header("lang") == "en" ? $this["description_en"] : $this["description_pt"]),
            'minimum'       => $this["minimum"],
            'weight'        => $this["weight"],
            'is_done'       => Exam::where("method_id", $this["id"])->exists()
        ];
    }
}
