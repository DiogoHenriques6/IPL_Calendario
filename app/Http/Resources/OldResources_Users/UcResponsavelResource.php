<?php

namespace App\Http\Resources\OldResources_Users;

use Illuminate\Http\Resources\Json\JsonResource;

class UcResponsavelResource extends JsonResource
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
            'id_uc'                                => $this->id,
            'nome_uc'                              => $this->nome,
            'sigla_uc'                         => $this->sigla,
            'id_curso'                                => $this->curso->id,
            'nome_curso'                              => $this->curso->nome,
            'sigla_curso'                         => $this->curso->sigla,
        ];
    }
}
