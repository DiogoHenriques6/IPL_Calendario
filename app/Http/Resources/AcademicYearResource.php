<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'code'              => $this->code,
            'display'           => $this->display,
            'selected'          => !!$this->selected,//$request->hasCookie('academic_year') ? $this->id == $request->cookie('academic_year') : $this->active,
            'active'            => !!$this->active,
            's1_sync'           => $this->s1_sync_last,
            's1_sync_active'    => !!$this->s1_sync_active,
            's1_sync_waiting'   => !!$this->s1_sync_waiting,
            's2_sync'           => $this->s2_sync_last,
            's2_sync_active'    => !!$this->s2_sync_active,
            's2_sync_waiting'   => !!$this->s2_sync_waiting,
            'isActiveLoading'   => false,
            'isSelectedLoading' => false
        ];
    }
}
