<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                        => $this->id,
            'name'                      => $this->code,
            'description'               => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'removable'                 => $this->when($this->whenLoaded('permissions', false), $this->removable),
            'enabled'                   => $this->when($this->whenLoaded('permissions', false), $this->enabled),
            'permissions'               => PermissionsResource::collection($this->whenLoaded('permissions')),
            'phase_id'                  => $this->whenPivotLoaded('phase_id', function() {
                return $this->pivot->phase_id;
            })

        ];
    }
}
