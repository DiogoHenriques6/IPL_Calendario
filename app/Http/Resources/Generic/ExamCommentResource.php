<?php

namespace App\Http\Resources\Generic;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamCommentResource extends JsonResource
{
    public function toArray($request)
    {
        $commentDate = Carbon::parse($this->created_at);
        $hoursOfComment = $commentDate->format('H:i');
        $differenceInDays = Carbon::now()->diffInDays($commentDate);

        $formatedDate = "";

        if ($commentDate->isSameDay(Carbon::now())) {
            $formatedDate = "Hoje às {$hoursOfComment}";
        } else if ($commentDate->isYesterday()) {
            $formatedDate = "Ontem às {$hoursOfComment}";
        } else {
            $formatedDate = "Há {$differenceInDays} dias";
        }
        return [
            'id'        => $this->id,
            'comment'   => $this->comment,
            'ignored'   => $this->ignored,
            'date_label'=> $formatedDate,
            'date'      => $this->created_at,
            'user'      => new UserCommentResource($this->user),
        ];

    }
}
