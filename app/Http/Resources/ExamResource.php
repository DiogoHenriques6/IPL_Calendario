<?php

namespace App\Http\Resources;

use App\Http\Resources\Generic\CourseUnitExamResource;
use App\Http\Resources\Generic\ExamCommentResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'academic_year'     => ($this->courseUnitDirect ? $this->courseUnitDirect : $this->courseUnit)->curricular_year,
            'method'            => new MethodResource($this->method),
            'course_unit'       => new CourseUnitExamResource(($this->courseUnitDirect ? $this->courseUnitDirect : $this->courseUnit)),
            'epoch_id'          => $this->epoch_id,
            'method_id'         => $this->method_id,
            'room'              => $this->room,
            'group_id'          => $this->group_id,
            'date_start'        => $this->date_start,
            'date_end'          => $this->date_end,
            'in_class'          => $this->in_class,
            'hour'              => $this->hour,
            'duration_minutes'  => $this->duration_minutes,
            'observations'      => ($request->header("lang") == "en" ? $this->observations_en : $this->observations_pt),
            'observations_pt'   => $this->observations_pt,
            'observations_en'   => $this->observations_en,
            'description'       => ($request->header("lang") == "en" ? $this->description_en : $this->description_pt),
            'description_pt'    => $this->description_pt,
            'description_en'    => $this->description_en,
            'comments'          => ExamCommentResource::collection($this->whenLoaded('comments')),
        ];
    }
}
