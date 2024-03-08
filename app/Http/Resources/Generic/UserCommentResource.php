<?php

namespace App\Http\Resources\Generic;

use App\Http\Resources\GroupsResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCommentResource extends JsonResource
{
    public function toArray($request)
    {
        preg_match('/(?:\w+\. )?(\w+).*?(\w+)(?: \w+\.)?$/', $this->name, $result);
        $initials = (str_word_count($this->name) > 1 && isset($result[2]) ? $result[2][0] : '');
        $initials = strtoupper($result[1][0] . $initials);

        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'initials'  => $initials,
        ];
    }
}
