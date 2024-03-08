<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarPhase extends Model
{
    use HasFactory;

    protected $fillable = ["code", "name_pt", "name_en", "enabled", "all_methods_filled"];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permissions');
    }

    public function calendars()
    {
        return $this->hasMany(Calendar::class);
    }

    /*
     * "Hardcoded" phases
     * easier to maintain and change
     */
    public static function phaseSystem()
    {
        //return $this->where('code', 'system')->first()->id;
        return 10;
    }
    public static function phasePublished()
    {
        //return $this->where('code', 'published')->first()->id;
        return 9;
    }
    public static function phaseEvaluationStudents()
    {
        //return $this->where('code', 'evaluation_students')->first()->id;
        return 4;
    }
    public static function phaseEditGop()
    {
        //return $this->where('code', 'evaluation_students')->first()->id;
        return 1;
    }
    public static function phaseEditCC()
    {
        //return $this->where('code', 'evaluation_students')->first()->id;
        return 2;
    }
}
