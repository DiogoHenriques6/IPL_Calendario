<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

class School extends Model
{
    use HasFactory;
    use HasRelationships;

    protected $fillable = [
        'code',
        'name_pt',
        'name_en',
        'gop_group_id',
        'board_group_id',
        'pedagogic_group_id',
        'index_campus'
    ];

    public $timestamps = false;

    public function courses () {
        return $this->hasMany(Course::class);
    }

    public function gopGroup() {
        return $this->belongsTo(Group::class);
    }

    public function boardGroup() {
        return $this->belongsTo(Group::class);
    }

    public function pedagogicGroup() {
        return $this->belongsTo(Group::class);
    }

    public function courseUnits() {
        return $this->hasManyThrough(CourseUnit::class, (new Course)->courseUnits());
    }

}
