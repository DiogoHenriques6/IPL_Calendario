<?php

namespace App\Filters;

use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Epoch;
use App\Models\Exam;
use App\Models\Method;
use App\Models\Semester;
use Illuminate\Database\Eloquent\Builder;
use tiagomichaelsousa\LaravelFilters\QueryFilters;

class CourseUnitFilters extends QueryFilters
{

    public function search($search) {
        $lang = (in_array($this->request->header("lang"), ["en", "pt"]) ? $this->request->header("lang") : "pt");
        return $this->builder->where(function($query) use ($search, $lang){
            $query->where('code', 'like', "%{$search}%")
                ->orWhere('initials', 'like', "%{$search}%")
                ->orWhere('name_' . $lang, 'like', "%{$search}%");
        });
    }

    public function semester($semester) {
        return $this->builder->where('semester_id',  Semester::where('number', $semester)->first()->id);
    }

    public function school($school) {
        $courses = Course::where('school_id', $school)->pluck('id');
        return $this->builder->whereIn('course_id', $courses);
    }

    public function year($year)
    {
        return $this->builder->where('curricular_year', $year);
    }

    public function course($course)
    {
        Course::findOrFail($course);
        return $this->builder->where('course_id', $course);
    }

    public function group_unit($groupUnit) {
        return $this->builder->where('course_unit_group_id', $groupUnit);
    }

    public function has_groups($hasGroup) {
        return $this->builder->whereNotNull('course_unit_group_id');
    }

    public function has_methods($hasMethods) {
        return $this->builder->whereHas('methods');
    }

    public function including($ids) {
        return $this->builder->orWhereIn('id', json_decode($ids));
    }

    public function onlyRemaining()
    {
        return $this->builder->whereHas('methods', function (Builder $query) {
            $query->whereDoesntHave('exams');
        });
    }
}
