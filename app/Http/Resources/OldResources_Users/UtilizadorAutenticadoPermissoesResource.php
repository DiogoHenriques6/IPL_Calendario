<?php

namespace App\Http\Resources\OldResources_Users;

use App\Models\Dicionario;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilizadorAutenticadoPermissoesResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id'                     => $this->id,
            'categoria'              => $this->categoria,
            'nome'                   => $this->nome,
            'isolada'                => $this->isolada,
            //'grupo_id'               => $this->grupo_id,
            //'fase_calendario_id'     => $this->fase_calendario_id,
            'consultar'              => $this->consultar,
            'consultar_todos'        => $this->consultar_todos,
            'adicionar'              => $this->adicionar,
            'modificar'              => $this->modificar,
            'modificar_todos'        => $this->modificar_todos,
            'apagar'                 => $this->apagar,
            'apagar_todos'           => $this->apagar_todos,
        ];
    }
}
