<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'calendar_logs';

    protected $fillable = [
        'calendar_id',
        'course_unit_id',
        'exam_id',
        'user_id',
        'old_date',
        'new_date',
        'is_create',
        'is_update',
    ];

    public function calendar()
    {
        return $this->belongsTo(Calendar::class, 'calendar_id');
    }

    public function courseUnit()
    {
        return $this->belongsTo(CourseUnit::class, 'course_unit_id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
