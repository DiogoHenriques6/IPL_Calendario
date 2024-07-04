<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;

class MethodGroup extends Model
{
    use HasFactory, Filterable;

    protected $fillable = [
        "academic_year_id"
    ];

    public function academicYears()
    {
        return $this->belongsToMany(AcademicYear::class);
    }

    public function methods()
    {
        return $this->hasMany(Method::class);
    }

    public function scopeOfAcademicYear($query, $academicYearId) {
        return $query->where('academic_year_id', $academicYearId);
    }
}
