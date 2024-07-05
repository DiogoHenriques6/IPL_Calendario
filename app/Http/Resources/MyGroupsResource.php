<?php

namespace App\Http\Resources;

use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\InitialGroups;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class MyGroupsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'key'                        => $this->id,
            'text'                      => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'value'                     => $this->code,
        ];
    }
}
