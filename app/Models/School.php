<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

class School extends Model
{
    use HasFactory;
    use HasRelationships;

    protected $fillable = [
        'code',
        'name_pt',
        'name_en',
        'base_link',

        'index_course_code',
        'index_course_name_pt',
        'index_course_name_en',
        'index_course_initials',
        'index_course_unit_code',
        'index_course_unit_name_pt',
        'index_course_unit_name_en',
        'index_course_unit_initials',
        'index_course_unit_curricular_year',
        'index_course_unit_teachers',

        'index_course_unit_registered',
        'index_course_unit_passed',
        'index_course_unit_flunk',

        'index_course_unit_branch',

        'query_param_academic_year',
        'query_param_semester',
        'gop_group_id',
        'board_group_id',
        'pedagogic_group_id'
    ];

    public $timestamps = false;

    public function courses () {
        return $this->hasMany(Course::class);
    }

    public function gopGroup() {
        return $this->belongsTo(Group::class);
    }

    public function boardGroup() {
        return $this->belongsTo(Group::class);
    }

    public function pedagogicGroup() {
        return $this->belongsTo(Group::class);
    }

    public function courseUnits() {
        return $this->hasManyThrough(CourseUnit::class, (new Course)->courseUnits());
    }

}
