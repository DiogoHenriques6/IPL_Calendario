<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InterruptionTypesEnum
{
    const HOLIDAYS = "Feriado";
}

class InterruptionType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        "name_pt",
        "name_en",
        "mandatory",
        "enabled"
    ];
}
