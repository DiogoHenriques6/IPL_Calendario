<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Method extends Model
{
    use HasFactory;

    protected $fillable = ["evaluation_type_id", "academic_year_id", "minimum", "weight", "description_pt", "description_en", "enabled"];

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class);
    }

    public function epochType()
    {
        return $this->belongsToMany(EpochType::class);
    }

    public function evaluationType()
    {
        return $this->belongsTo(EvaluationType::class);
    }

    public function courseUnits()
    {
        return $this->belongsToMany(CourseUnit::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }


    public function scopeOfAcademicYear($query, $academicYearId) {
        return $query->whereHas('academicYear', function (Builder $q) use($academicYearId) {
            $q->where('academic_year_id', $academicYearId);
        });
    }
    public function scopeByCourseUnit($query, $courseUnitId) {
        return $query->join('course_unit_method', function ($join) use($courseUnitId) {
            $join->on('course_unit_method.method_id', '=', 'methods.id')->where('course_unit_method.course_unit_id', $courseUnitId);
        });
    }
    public function byEpochType($query, $epochTypeId) {
        return $query->join('epoch_type_method', function ($join) use($epochTypeId) {
            $join->on('epoch_type_method.method_id', '=', 'methods.id')->where('epoch_type_method.epoch_type_id', $epochTypeId);
        });
    }

}
