<?php

namespace App\Http\Resources\API_V1\Exams;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseUnitResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'code'                  => $this->code,
            'name'                  => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->name_en : $this->name_pt),
            'initials'              => $this->initials,
            'semester'              => $this->semester->number,

            'course'        => [
                "code"          => $this->course->code,
                'name'          => "(" . $this->course->code . ") " . (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->course->name_en : $this->course->name_pt),
            ],
            'branch'        => [
                "id"            => $this->branch_id,
                "name"          => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->branch->name_en : $this->branch->name_pt),
                "initials"      => (($request->header("lang") == "en" || $request->query("lang") == "en") ? $this->branch->initials_en : $this->branch->initials_pt),
            ],
        ];
    }
}

