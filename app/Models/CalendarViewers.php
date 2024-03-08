<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CalendarViewers extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        "calendar_id",
        "group_id",
    ];

    public function calendar()
    {
        return $this->hasOne(Calendar::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }
}
