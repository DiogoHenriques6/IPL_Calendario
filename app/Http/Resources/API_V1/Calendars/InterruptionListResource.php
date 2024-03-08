<?php

namespace App\Http\Resources\API_V1\Calendars;

use Illuminate\Http\Resources\Json\JsonResource;

class InterruptionListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'date_start'        => $this->start_date,
            'date_end'          => $this->end_date,
            'name'              => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->description_en : $this->description_pt)
        ];
    }
}
