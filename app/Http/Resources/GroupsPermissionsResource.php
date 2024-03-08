<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupsPermissionsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'group_id'      => $this->group_id,
            'permission_id' => $this->permission_id,
            'phase_id'      => $this->phase_id,
            'enabled'       => $this->enabled,
        ];
    }
}
