<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EpochResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'code'          => $this->epochType->code,
            'name'          => $request->header("lang") == "en" ? $this->epochType->name_en : $this->epochType->name_pt,
            'start_date'    => $this->start_date,
            'end_date'      => $this->end_date,
            'exams'         => ExamResource::collection($this->whenLoaded('exams')),
        ];
    }
}
