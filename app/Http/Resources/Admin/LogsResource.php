<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class LogsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'description'   => $this->description,
            'created'       => $this->created_at,
        ];
    }
}
