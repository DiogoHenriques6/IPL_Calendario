<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Epoch extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "epochs";

    protected $dates = [
        "start_date",
        "end_date"
    ];

    protected $fillable = [
        "name",
        "start_date",
        "end_date",
        "epoch_type_id"
    ];

    public function calendar()
    {
        return $this->belongsTo(Calendar::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function epochType()
    {
        return $this->belongsTo(EpochType::class);
    }
}
