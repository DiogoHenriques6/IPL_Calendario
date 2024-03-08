<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\Generic\UserWithGroupsResource;
use App\Services\DegreesUtil;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchesResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name_pt' => $this->name_pt,
            'name_en' => $this->name_en,
            'initials_pt' => $this->initials_pt,
            'initials_en' => $this->initials_en
        ];
    }
}
