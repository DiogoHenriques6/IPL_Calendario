<?php

namespace App\Http\Resources;

use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\InitialGroups;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class MyGroupsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'key'                        => $this->id,
            'text'                      => ($request->header("lang") == "en" ? $this->name_en : $this->name_pt),
            'value'                     => $this->code,
//            'school_id' => match(true) {
//                str_contains($this->code, InitialGroups::GOP) => $this->gopSchool()->pluck('id'),
//                str_contains($this->code,InitialGroups::BOARD) =>  $this->boardSchool()->pluck('id'),
//                str_contains($this->code,InitialGroups::PEDAGOGIC) =>  $this->pedagogicSchool()->pluck('id'),
//                default => [],
//            },
//            'courseUnit_id'             => $this->code == InitialGroups::RESPONSIBLE ? CourseUnit::where('responsible_user_id', Auth::user()->id)->pluck('id') : [],
//            'course_id'                 => $this->code == InitialGroups::COORDINATOR ? Course::where('coordinator_user_id', Auth::user()->id)->pluck('id') : [],
        ];
    }
}
