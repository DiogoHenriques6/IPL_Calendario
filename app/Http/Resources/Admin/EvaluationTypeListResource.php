<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class EvaluationTypeListResource extends JsonResource
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
            'name'      => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'name_pt'   => $this->name_pt,
            'name_en'   => $this->name_en,
            'enabled'   => $this->enabled
        ];
    }
}
