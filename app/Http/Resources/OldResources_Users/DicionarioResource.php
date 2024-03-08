<?php

namespace App\Http\Resources\OldResources_Users;

use Illuminate\Http\Resources\Json\JsonResource;

class DicionarioResource extends JsonResource
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
            'id'                            => $this->id,
            'idioma_id'                     => $this->idioma_id,
            'idioma_abreviatura'            => $this->idioma_abreviatura,
            'key'                           => $this->key,
            'traducao'                      => $this->traducao,
        ];
    }
}
