<?php

namespace App\Filters;

use App\Models\Course;
use App\Models\CourseUnit;
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
        $isManagement = $user->groups->contains('code', InitialGroups::ADMIN) || $user->groups->contains('code', InitialGroups::SUPER_ADMIN) || $user->groups->contains('code', InitialGroups::GOP);
        $isManagement = $isManagement || $user->groups->contains('code', InitialGroups::BOARD) || $user->groups->contains('code', InitialGroups::PEDAGOGIC) || $user->groups->contains('code', InitialGroups::RESPONSIBLE_PEDAGOGIC);

        $user_groups = [];
        foreach (Auth::user()->groups->toArray() as $group){
            $user_groups[] = $group["id"];
        }
        LOG::channel('sync_test')->info($user_groups);

        $myCourseOnly = $isManagement ? false : $search === "true";
        //get calendars groups can see
        $this->builder->where(function ($query) use ($user_groups, $myCourseOnly) {
            $query->whereHas('viewers', function (Builder $queryIn) use($user_groups) {
                $queryIn->whereIn('group_id', $user_groups);
            });
            //show every published calendar
            if(!$myCourseOnly){
                $query->orWhere('is_published', true)->orWhere('is_temporary', true);
            }
        });
        Log::channel('sync_test')->info($this->builder->toSql());
        if($isManagement){
            return $this;
        }

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


        // List for students
        //      -> meus > do meu curso
        //      -> Todos > mostra todos os publicados (definitivos)
        if (count($user->groups) === 1 && $user->groups->contains('code', InitialGroups::STUDENT)) {
            if ($search === "true") {
                return $this->builder->published()
                            ->whereIn('course_id', Auth::user()->courses->pluck('id'))
                            ->orWhere('calendar_phase_id', CalendarPhase::phaseEvaluationStudents());
            }

            return $this->builder->published()
                        ->orWhere('calendar_phase_id', CalendarPhase::phaseEvaluationStudents())
                        ->whereIn('course_id', Auth::user()->courses->pluck('id'));
        }
        // List for CCP


        // List for teacher
        //      -> meus > cursos das suas UCs
        //      -> Todos > mostra todos os publicados (definitivos)
        if ($user->groups->contains('code', InitialGroups::TEACHER) && $user->groups->count() == 1){
            // $search === "true" -> myCourseOnly = true
            if ($search === "true") {
                return $this->builder->whereIn('course_id', Auth::user()->courseUnits->pluck('course_id'));
            }
        }
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
