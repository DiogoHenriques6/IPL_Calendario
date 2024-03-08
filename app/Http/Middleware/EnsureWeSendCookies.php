<?php

namespace App\Http\Middleware;

use App\Models\AcademicYear;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class EnsureWeSendCookies
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $selectedAcademicYear = null;
        if ($request->has('switch_to')) {
            $selectedAcademicYear = AcademicYear::findOrFail($request->switch_to)->id;
        } elseif ($request->hasCookie('academic_year') && AcademicYear::where('id', $request->cookie('academic_year'))->count() > 0) {
            $selectedAcademicYear = AcademicYear::find($request->cookie('academic_year'))->id;
        } else {
            if (AcademicYear::where('selected', true)->count() > 0) {
                $selectedAcademicYear = AcademicYear::where('selected', true)->first()->id;
            }
        }
        // Add Cookie if new value
        if($selectedAcademicYear){
            Cookie::queue('academic_year', $selectedAcademicYear, 120);
        }
        if(!$request->hasCookie('academic_year')) {
            $request->cookies->set('academic_year', $selectedAcademicYear);
        }
        return $next($request);
    }
}
