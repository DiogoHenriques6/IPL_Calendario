<?php

namespace App\Http\Resources\Admin\Edit;

use App\Http\Resources\Admin\IdResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserEditResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'email'         => $this->email,
            'name'          => $this->name,
            'enabled'       => $this->enabled,
            'is_protected'  => $this->protected,
            'groups'        => IdResource::collection($this->whenLoaded('groups'))
        ];
    }
}
