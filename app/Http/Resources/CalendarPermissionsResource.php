<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarPermissionsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'name'      => $this->code,
            'phases'    => $this->phases,
        ];
    }
}
