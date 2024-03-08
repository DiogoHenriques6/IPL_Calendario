<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;

class Course extends Model
{
    use HasFactory, Filterable, SoftDeletes;

    protected $fillable = [
        "code",
        "name_pt",
        "name_en",
        "initials",
        "degree",
        "academic_year_id",
        "num_years",
        "coordinator_user_id",
        "school_id"
    ];

    public function academicYears()
    {
        return $this->belongsToMany(AcademicYear::class);
    }

    public function coordinatorUser() {
        return $this->belongsTo(User::class, 'coordinator_user_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_user');
    }

    public function calendars()
    {
        return $this->hasMany(Calendar::class);
    }

    public function school() {
        return $this->belongsTo(School::class);
    }

    public function branches() {
        return $this->hasMany(Branch::class);
    }

    public function courseUnits() {
        return $this->hasMany(CourseUnit::class);
    }

    public function scopeOfAcademicYear($query, $academicYear) {
        return $query->where('academic_year_id', AcademicYear::findOrFail($academicYear)->id);
    }
}
