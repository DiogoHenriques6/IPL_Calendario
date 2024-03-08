<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;

class CourseUnitGroup extends Model
{
    use HasFactory, Filterable;

    protected $fillable = [
        "academic_year_id",
        "description_pt",
        "description_en"
    ];

    public function academicYears()
    {
        return $this->belongsToMany(AcademicYear::class);
    }

    public function courseUnits()
    {
        return $this->hasMany(CourseUnit::class);
    }

    public function log()
    {
        return $this->hasMany(UnitLog::class)->orderBy('created_at', 'desc');
    }

    public function scopeOfAcademicYear($query, $academicYearId) {
        return $query->where('academic_year_id', $academicYearId);
    }
}
