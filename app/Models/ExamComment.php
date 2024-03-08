<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamComment extends Model
{
    use HasFactory;

    protected $fillable = [
        "exam_id",
        "comment",
        "comment_language",
        "language",
        "ignored",
        "user_id",
    ];

    public function exam()
    {
        return $this->hasOne(Exam::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
