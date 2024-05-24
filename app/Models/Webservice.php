<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Webservice extends Model
{
    use HasFactory;
    protected $fillable = [
        "base_link",
        "course_units_link" ,
        "teachers_by_uc_link" ,
        "teachers_link",
        'index_course_code',
        'index_course_name_pt',
        'index_course_name_en',
        'index_course_initials',
        'index_course_unit_code',
        'index_course_unit_name_pt',
        'index_course_unit_name_en',
        'index_course_unit_initials',
        'index_course_unit_registered',
        'index_course_unit_passed',
        'index_course_unit_flunk',
        'index_course_unit_branch',
        'index_course_unit_curricular_year',
        'index_docentes_name',
        'index_docentes_email',
        'index_course_unit_teachers',
        'query_param_academic_year',
        'query_param_semester',
        'query_param_course',
        'query_param_campus',
        'query_param_course_unit'
    ];
}
