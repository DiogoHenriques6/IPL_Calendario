<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationType extends Model
{
    use HasFactory;

    protected $fillable = ["code", "name_pt", "name_en", "enabled"];

    public function exams()
    {
        return $this->belongsToMany(Exam::class);
    }

    public static function typePublicOralPresentation()
    {
        //return $this->where('code', 'public_oral_presentation')->first()->id;
        return 5;
    }

    public static function typeStatementRelease()
    {
        //return $this->where('code', 'statement_release')->first()->id;
        return 11;
    }
}
