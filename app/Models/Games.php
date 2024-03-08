<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Games extends Model
{
    use HasFactory;

    protected $fillable = [
        'game',
        'time',
        'score',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsToMany(User::class);
    }
}
