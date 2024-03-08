<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Config;

class Interruption extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ["interruption_type_id", "calendar_id", "start_date", "end_date", "description_pt", "description_en", "enabled"];

    public function calendar()
    {
        return $this->belongsTo(Calendar::class);
    }

    public function interruptionType()
    {
        return $this->hasOne(InterruptionType::class);
    }

}
