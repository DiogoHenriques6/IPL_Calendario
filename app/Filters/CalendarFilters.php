<?php

namespace App\Filters;

use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\CalendarPhase;
use App\Models\Semester;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use tiagomichaelsousa\LaravelFilters\QueryFilters;

class CalendarFilters extends QueryFilters
{

    public function myCourseOnly($search)
    {
        $user = Auth::user();
        // Filtragem por grupo
        //
        // Responsável Conselho Pedagógico / Conselho Pedagógico / Comissão Científico-Pedagógica / Direção
        //      -> meus > a espera de acoes pelo user
        //      -> Todos > mostra todos os publicados (provisorios e definitivos)
        //
        // GOP
        //      -> Todos os calendarios
        // TODO -> todos os calendarios da escola respetiva

        // TODO Make this filter be more dynamic to have in account the groups for the schools (eg: "gop_estg")
        //TODO Make this filter to have in account multiple groups at the same time (eg: "cc", "responsible")
        $selectedGroupId = request()->cookie('selectedGroup');
        $currentGroup = Group::where('id', $selectedGroupId)->first();
        $isManagement = false;
        $schoolId = null;
        $courseId = null;
        $isWatcher = false;
        switch ($currentGroup->code) {
            case InitialGroups::SUPER_ADMIN:
            case InitialGroups::ADMIN :
                $isManagement = true;
                break;
            case str_contains($currentGroup->code, InitialGroups::GOP):
                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->gopSchool()->pluck('id');
                LOG::channel('sync_test')->info($schoolId);
                break;
            case str_contains($currentGroup->code,InitialGroups::BOARD):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->boardSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::PEDAGOGIC):
//                Log::channel('sync_test')->info($currentGroup->code);
                $schoolId = $currentGroup->pedagogicSchool()->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::RESPONSIBLE_PEDAGOGIC):
//                Log::channel('sync_test')->info($currentGroup->code);
                $isManagement = true;
                break;
            case str_contains($currentGroup->code,InitialGroups::COMISSION_CCP):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Auth::user()->courses->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::COORDINATOR):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = Course::where('coordinator_user_id', Auth::user()->id)->pluck('id');
                break;
            case str_contains($currentGroup->code,InitialGroups::RESPONSIBLE):
//                Log::channel('sync_test')->info($currentGroup->code);
                $courseId = CourseUnit::where('responsible_user_id',Auth::user()->id)->pluck('course_id');
                break;
            default:
                $isWatcher = true;
        }

        if($isManagement){
            return $this;
        }

        if($schoolId != null){
            if(count($schoolId) > 0){
                $this->builder->whereIn('course_id', Course::where('school_id', $schoolId)->pluck('id'));
                return $this;
            }
        }

//        $this->builder->where(function ($query) use ($user_groups, $myCourseOnly) {
//            $query->whereHas('viewers', function (Builder $queryIn) use($user_groups) {
//                $queryIn->whereIn('group_id', $user_groups);
//            });
        if($courseId != null){
            $this->builder->whereIn('course_id', $courseId)
                ->where(function ($query) use ($currentGroup, $search) {
                    $query->whereHas('viewers', function (Builder $queryIn) use($currentGroup) {
                        $queryIn->where('group_id', $currentGroup->id);
                    });
                });
            if(!$search)
                $this->builder->orWhere('is_published', true)->orWhere('is_temporary', true);
            return $this;
        }



        if($isWatcher){
            $this->builder->where(function ($query) use ($currentGroup, $search) {
                    $query->whereHas('viewers', function (Builder $queryIn) use($currentGroup) {
                        $queryIn->where('group_id', $currentGroup->id);
                    });
                });
            if(!$search)
                $this->builder->orWhere('is_published', true)->orWhere('is_temporary', true);
            return $this;
        }



//        Log::channel('sync_test')->info($this->builder->toSql());


        // List for coordinator
        //      -> meus > curso
        //      -> Todos > mostra todos os publicados (provisorios e definitivos)

        if ($user->groups->contains('code', InitialGroups::COORDINATOR)) {
            if($search === "true")
                return $this->builder->whereIn('course_id', Course::where('coordinator_user_id', Auth::user()->id)->pluck('id'));
            else
                return $this->builder->whereIn('course_id', Course::where('coordinator_user_id', Auth::user()->id)->pluck('id'))
                            ->orWhere('is_published', true)->orWhere('is_temporary', true);
        }

        if ($user->groups->contains('code', InitialGroups::RESPONSIBLE)) {
            if($search === "true")
                return $this->builder->whereIn('course_id', CourseUnit::where('responsible_user_id',Auth::user()->id)->pluck('course_id'));
            else
                return $this->builder->whereIn('course_id', CourseUnit::where('responsible_user_id',Auth::user()->id)->pluck('course_id'))
                    ->orWhere('is_published', true)->orWhere('is_temporary', true);
        }

        if ($user->groups->contains('code', InitialGroups::COMISSION_CCP)) {
            if ($search === "true") {
                $this->builder->whereIn('course_id', Auth::user()->courses->pluck('id'));
            }
            else{
                $this->builder->whereIn('course_id', Auth::user()->courses->pluck('id'))
                    ->orWhere('is_published', true)->orWhere('is_temporary', true);
            }
        }

        // List for CCP

    }


    public function semester($semester) {
        return $this->builder->where('semester_id',  Semester::find($semester)->id);
    }


    public function status($status) {
        if($status == 1) {
            return $this->builder->where('is_temporary', 0)->where('is_published', 0);
        }
        if($status == 2) {
            return $this->builder->where('is_temporary', 1)->where('is_published', 0);
        }
        if($status == 3) {
            return $this->builder->where('is_temporary', 0)->where('is_published', 1);
        }
    }

    public function phase($phase) {
        return $this->builder->where('calendar_phase_id',  $phase);
    }


    public function course($course)
    {
        $user = Auth::user();
        Course::findOrFail($course);

        if ($user->groups->contains('code', InitialGroups::ADMIN) || $user->groups->contains('code', InitialGroups::SUPER_ADMIN)){
            return $this->builder->where('course_id', $course);
        }

        if (count($user->groups) === 1 && $user->groups->contains('code', InitialGroups::STUDENT)) {
            return $this->builder->whereIn('course_id', Auth::user()->courses->pluck('id'))
                                ->where('course_id', $course);
        }

        if ($user->groups->contains('code', InitialGroups::COORDINATOR)) {
            return $this->builder->whereIn('course_id', Course::where('coordinator_user_id', Auth::user()->id)->pluck('id'))
                                ->where('course_id', $course);
        }

        if ($user->groups->contains('code', InitialGroups::TEACHER)) {

            return $this->builder->whereIn('course_id', Auth::user()->courseUnits->pluck('course_id'))
                                ->where('course_id', $course);
        }
    }
}
