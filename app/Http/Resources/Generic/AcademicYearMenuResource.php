<?php

namespace App\Http\Resources\Generic;

use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearMenuResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'code'              => $this->code,
            'display'           => $this->display,
            'selected'          => $request->hasCookie('academic_year') ? $this->id == $request->cookie('academic_year') : $this->selected,
            'default'            => $this->selected
        ];
    }
}
