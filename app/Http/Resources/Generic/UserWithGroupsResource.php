<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\GroupsResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserWithGroupsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'    => $this->id,
            'email'  => $this->email,
            'name'   => $this->name,
            'groups' => GroupsResource::collection($this->whenLoaded('groups'))
        ];
    }
}
