<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;

class MethodGroup extends Model
{
    use HasFactory, Filterable;

    protected $fillable = [
        "academic_year_id"
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function methods()
    {
        return $this->hasMany(Method::class);
    }

    public function scopeOfAcademicYear($query, $academicYearId)
    {
        return $query->whereHas('academicYear', function (Builder $q) use ($academicYearId) {
            $q->where('academic_years.id', $academicYearId);
        });
    }
}
