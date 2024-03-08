<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalendarPhaseRequest;
use App\Http\Resources\Admin\Edit\CalendarPhaseDetailResource;
use App\Http\Resources\Admin\CalendarPhaseResource;
use App\Models\CalendarPhase;
use Illuminate\Http\Response;

class CalendarPhaseController extends Controller
{
    public function index()
    {
        return CalendarPhaseResource::collection(CalendarPhase::all());
    }

    public function store(CalendarPhaseRequest $request)
    {
        $newCalendarPhase = new CalendarPhase($request->all());
        $newCalendarPhase->save();

        return response()->json("Created!", Response::HTTP_CREATED);
    }

    public function show(CalendarPhase $calendarPhase)
    {
        return new CalendarPhaseDetailResource($calendarPhase);
    }

    public function update(CalendarPhaseRequest $request, CalendarPhase $calendarPhase)
    {
        $calendarPhase->fill($request->all())->save();
    }

    public function destroy(CalendarPhase $calendarPhase)
    {
        $calendarPhase->delete();

        return CalendarPhaseResource::collection(CalendarPhase::all());
    }
}
