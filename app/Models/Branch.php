<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        "branch_number",
        "academic_year_id",
        "name_pt",
        "name_en",
        "initials_pt",
        "initials_en",
        "course_id"
    ];

    public $timestamps = false;

    public function course() {
        return $this->belongsTo(Course::class);
    }
}
