<?php

namespace App\Http\Resources\Generic;

use App\Models\InterruptionType;
use Illuminate\Http\Resources\Json\JsonResource;

class InterruptionDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'description_pt'    => $this->description_pt,
            'description_en'    => $this->description_en,
            'start_date'        => $this->start_date,
            'end_date'          => $this->end_date,
            'interruption_type_id' => $this->interruption_type_id,
        ];
    }
}

class InterruptionTypesEnum
{
    const HOLIDAYS = "Feriado";
}
