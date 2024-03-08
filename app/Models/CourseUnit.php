<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;

class CourseUnit extends Model
{
    use HasFactory, Filterable;
    use \Staudenmeir\EloquentHasManyDeep\HasRelationships;
    use \Znck\Eloquent\Traits\BelongsToThrough;

    protected $fillable = [
        "course_id",
        "branch_id",
        "academic_year_id",
        "responsible_user_id",
        "code",
        "name_pt",
        "name_en",
        "initials",
        "curricular_year",
        "semester_id",
        "registered",
        "passed",
        "flunk"
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function log()
    {
        return $this->hasMany(UnitLog::class)->orderBy('created_at', 'desc');
    }

    public function academicYears(){
        return $this->belongsToMany(AcademicYear::class);
    }

    public function branch() {
        return $this->belongsTo(Branch::class);
    }

    public function group()
    {
        return $this->belongsTo(CourseUnitGroup::class, 'course_unit_group_id');
    }

    public function methods()
    {
        return $this->belongsToMany(Method::class);
    }

    public function epochTypes()
    {
        return $this->belongsToMany(EpochType::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(User::class);
    }

    public function exams()
    {
        return $this->hasManyDeepFromRelations($this->methods(), (new Method)->exams());
    }

    public function examsDirect()
    {
        return $this->hasMany(Exam::class);
    }

    public function responsibleUser() {
        return $this->belongsTo(User::class, 'responsible_user_id');
    }

    public function scopeOfAcademicYear($query, $academicYearId) {
        return $query->where('academic_year_id', $academicYearId);
    }

    public function school() {
        return $this->belongsToThrough(School::class, Course::class);
    }

}
