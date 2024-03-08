<?php

namespace App\Models;

use App\Observers\CalendarObserver;
use App\Scopes\PublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;

class Calendar extends Model
{
    use HasFactory, SoftDeletes, Filterable;

    protected $fillable = [
        "version",
        "calendar_phase_id",
        "semester_id",
        "week_ten",
        "observations_pt",
        "observations_en",
        "is_temporary",
        "is_published",
        "created_by",
        "updated_by",
        "previous_calendar_id",
        "difference_from_previous_calendar",
        "academic_year_id"
    ];

    public static function boot()
    {
        parent::boot();
        parent::observe(new CalendarObserver);
    }

    public function previousCalendar()
    {
        return $this->belongsTo(Calendar::class)->withTrashed();
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class);
    }

    public function scopeCreatedBy($query, $userId)
    {
        return $query->where('created_by', $userId);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrPublished($query) {
        return $query->orWhere('is_published', true);
    }

    public function calendarChanges()
    {
        return $this->hasMany(CalendarChange::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function interruptions()
    {
        return $this->hasMany(Interruption::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function phase()
    {
        return $this->belongsTo(CalendarPhase::class, 'calendar_phase_id');
    }

    public function semester() {
        return $this->belongsTo(Semester::class);
    }

    public function epochs()
    {
        return $this->hasMany(Epoch::class);
    }

    public function exams()
    {
        return $this->hasManyThrough(Exam::class, Epoch::class);
    }

    public function viewers()
    {
        return $this->hasMany(CalendarViewers::class);
    }



    public function firstDayOfSchool()
    {
        return $this->epochs()->min('start_date');
    }

    public function lastDayOfSchool()
    {
        return $this->epochs()->max('end_date');
    }

    public function scopeOfAcademicYear($query, $academicYearId) {
        return $query->where('academic_year_id', $academicYearId);
    }
}
