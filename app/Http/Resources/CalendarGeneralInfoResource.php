<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarGeneralInfoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'version'               => $this['version'],
            'temporary'             => $this['calendar']->is_temporary,
            'calendar_last_update'  => $this['calendar']->updated_at,
            'semester'              => $this['semester'],
            'semester_number'       => $this['semester_number'],
            'academic_year'         => $this['academic_year'],
        ];
    }
}
