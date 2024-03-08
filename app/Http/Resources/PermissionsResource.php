<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PermissionsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                        => $this->id,
            'name'                      => $this->code,
            'description'               => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'phase_id'                  => $this->whenPivotLoaded('group_permissions', function() {
                return $this->pivot->phase_id;
            })
        ];
    }
}
