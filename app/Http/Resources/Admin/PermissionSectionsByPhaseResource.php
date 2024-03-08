<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Admin\PermissionsPhaseResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionSectionsByPhaseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'phase_id'  => $this->id,
            'label'     => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'sections'  => $this->sections
        ];
    }
}
