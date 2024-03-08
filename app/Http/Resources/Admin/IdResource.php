<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class IdResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id'          => $this->id
        ];
    }
}
