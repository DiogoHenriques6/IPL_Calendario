<?php

namespace App\Http\Resources;

use App\Models\InterruptionType;
use Illuminate\Http\Resources\Json\JsonResource;

class InterruptionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'description'   => $request->header("lang") == "en" ? $this->description_en : $this->description_pt,
            'isHoliday'     => InterruptionType::where('name_pt', InterruptionTypesEnum::HOLIDAYS)->first()->id === $this->interruption_type_id,
            'start_date'    => $this->start_date,
            'end_date'      => $this->end_date,
            'interruption_type_id' => $this->interruption_type_id,
        ];
    }
}

class InterruptionTypesEnum
{
    const HOLIDAYS = "Feriado";
}
