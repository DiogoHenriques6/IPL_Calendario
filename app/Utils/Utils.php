<?php

namespace App\Utils;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class Utils
{
    public function getCurrentAcademicYear(Request $request){
        $selectedAcademicYear = 0;
        if ($request->hasCookie('academic_year') && AcademicYear::where('id', $request->cookie('academic_year'))->count() > 0) {
            $selectedAcademicYear = AcademicYear::find($request->cookie('academic_year'))->id;
        } elseif (AcademicYear::where('selected', true)->count() > 0) {
            $selectedAcademicYear = AcademicYear::where('selected', true)->first()->id;
        }

        return $selectedAcademicYear;
    }

    public function getFullYearsAcademicYear($academicYear){
        $years = 0;
        if($academicYear != 0){
            $rawYears = explode("-", $academicYear);
            $years = $rawYears[0] . "-20" . $rawYears[1];
        }
        return $years;
    }
}
