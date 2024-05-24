<?php

namespace App\Http\Resources\Admin\Edit;

use Illuminate\Http\Resources\Json\JsonResource;

class EvaluationTypeEditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'code'      => $this->code,
            'name_pt'   => $this->name_pt,
            'name_en'   => $this->name_en,
            'initials_pt' => $this->initials_pt,
            'initials_en' => $this->initials_en,
            'enabled'   => $this->enabled
        ];
    }
}
