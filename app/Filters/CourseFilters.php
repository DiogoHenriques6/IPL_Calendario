<?php

namespace App\Filters;

use App\Models\Course;
use App\Models\Epoch;
use Illuminate\Database\Eloquent\Builder;
use tiagomichaelsousa\LaravelFilters\QueryFilters;

class CourseFilters extends QueryFilters
{

    public function search($search)
    {
        // This will only filter by the field of the selected language
        $lang = (in_array($this->request->header("lang"), ["en", "pt"]) ? $this->request->header("lang") : "pt");

        return $this->builder->where('code', 'LIKE', "%$search%")
            ->orWhere('initials', 'LIKE', "%$search%")
            ->orWhere('name_' . $lang, 'LIKE', "%$search%");
    }
}
