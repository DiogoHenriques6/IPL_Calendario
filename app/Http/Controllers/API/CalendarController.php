<?php

namespace App\Http\Controllers\API;

use App\Events\CalendarDeleted;
use App\Filters\CalendarDetailsFilters;
use App\Filters\CalendarFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\NewCalendarRequest;
use App\Http\Requests\UpdateCalendarRequest;
use App\Http\Resources\Generic\CalendarDetailResource;
use App\Http\Resources\Generic\CalendarListResource;
use App\Http\Resources\Generic\Calendar_SemesterResource;
use App\Http\Resources\Generic\SemestersSearchResource;
use App\Models\Calendar;
use App\Models\Exam;
use App\Models\Group;
use App\Models\InitialGroups;
use App\Models\Semester;
use App\Services\CalendarService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CalendarController extends Controller
{


    public function index(Request $request, CalendarFilters $filters)
    {
        $lang = (in_array($request->header("lang"), ["en", "pt"]) ? $request->header("lang") : "pt");
        $perPage = request('per_page', 20);
        $calendars = [];

        $calendars = Calendar::filter($filters)->ofAcademicYear($request->cookie('academic_year'));
        if(!$request->has("myCourseOnly")){
            $calendars->filter(new CalendarFilters(['myCourseOnly' => false]));
        }
        return CalendarListResource::collection($calendars->orderBy('previous_calendar_id')->paginate($perPage));
    }

    public function store(NewCalendarRequest $request)
    {
        $response = CalendarService::store($request);
        return response()->json($response, Response::HTTP_CREATED);
    }

    public function show(Calendar $calendar, CalendarDetailsFilters $filters, Request $request)
    {
        $filters->setCalendar($calendar);
        $calendar->load(['epochs', 'interruptions']);

        $exams = Exam::filter($filters)->get();

        $epochs = $calendar->epochs->map(function ($epoch) use ($exams) {
            $epoch->setRelation('exams', $exams->where('epoch_id', $epoch->id));
            return $epoch;
        });
        $calendar->setRelation('epochs', $epochs);

        return new CalendarDetailResource($calendar);

//        return new CalendarDetailResource($calendar->load(['epochs', 'interruptions'])->filter($filters));
    }

    public function update(UpdateCalendarRequest $request, Calendar $calendar)
    {
        CalendarService::update($request, $calendar);
    }

    public function destroy(Calendar $calendar)
    {
        if($calendar->is_published){
            return response()->json("Calendario ja publicado, nao sera possivel apagar este calendario", Response::HTTP_CONFLICT);
        }
        $calendar->delete();
        CalendarDeleted::dispatch($calendar);
    }

    public function publish(Request $request, Calendar $calendar)
    {
        $response = CalendarService::publish($calendar);
        return response()->json($response);
    }

    public function copyCalendar(Request $request, Calendar $calendar)
    {
        $response = CalendarService::copyCalendar($calendar);
        return response()->json($response);
    }

    public function info(Request $request)
    {
        $response = CalendarService::info($request);
        return response()->json($response);
    }

    public function getAvailableMethods(Request $request, Calendar $calendar)
    {
        $response = CalendarService::getAvailableMethods($request, $calendar);
        return $response;
    }

    public function getAvailableMethodsOthers(Request $request, Calendar $calendar)
    {
        $response = CalendarService::getAvailableMethodsOthers($request, $calendar);
        return $response;
    }

    public function listSemesters(Request $request)
    {
        if($request->has('special')){
            return SemestersSearchResource::collection(Semester::all());
        }
        return SemestersSearchResource::collection(Semester::where("special", 0)->get());
    }

    public function calendarSemesters()
    {
        return Calendar_SemesterResource::collection(Semester::all());
    }

    public function calendarInterruptions(Request $request)
    {
        $response = CalendarService::calendarInterruptions($request);
        return response()->json($response, Response::HTTP_OK);
    }

    public function getCalendarWarnings(Request $request, Calendar $calendar)
    {
        return CalendarService::getCalendarWarnings($calendar);
    }


    public function phases(Request $request)
    {
        $response = CalendarService::phases($request);
        return response()->json($response, Response::HTTP_OK);
    }


    public function phasesGroups(Request $request)
    {
        return CalendarService::phasesGroups($request);
    }


    public function approval(Request $request, Calendar $calendar)
    {
        return CalendarService::approval($request, $calendar);
    }
}
