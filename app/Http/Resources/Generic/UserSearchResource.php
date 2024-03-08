<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class UserSearchResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'email'     => $this->email,
            'name'      => $this->name,
        ];
    }
}
