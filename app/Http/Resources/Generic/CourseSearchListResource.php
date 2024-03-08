<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\Generic\UserWithGroupsResource;
use App\Services\DegreesUtil;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSearchListResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'key'   => $this->id,
            'value' => $this->id,
            'text'  => '(' . $this->code . ') ' . ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
        ];
    }
}
