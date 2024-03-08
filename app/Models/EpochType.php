<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EpochType extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "code",
        "name_pt",
        "name_en"
    ];

    public function epochs() {
        return $this->hasMany(Epoch::class);
    }

    public function semesters() {
        return $this->hasMany(Semester::class);
    }

    public function methods()
    {
        return $this->hasMany(Method::class);
    }

    public function courseUnits()
    {
        return $this->belongsToMany(CourseUnit::class);
    }
}
