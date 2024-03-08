<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class SchoolResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'name'        => $this->code,
            'description' => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'is_configured'   => ($this->base_link != '' && !empty($this->gop_group_id) && !empty($this->board_group_id) && !empty($this->pedagogic_group_id)),

            'has_link'      => $this->base_link != '',
            'has_gop'       => !empty($this->gop_group_id),
            'has_board'     => !empty($this->board_group_id),
            'has_pedagogic' => !empty($this->pedagogic_group_id),
        ];
    }
}
