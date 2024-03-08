<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\Generic\InterruptionDetailResource;
use App\Http\Resources\InterruptionResource;
use App\Models\Epoch;
use App\Models\Interruption;
use App\Models\InterruptionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\NewInterruptionRequest;
use Carbon\Carbon;
use Illuminate\Http\Response;

class InterruptionController extends Controller
{
    public function show(Interruption $interruption){
        return new InterruptionDetailResource($interruption);
    }

    public function store(NewInterruptionRequest $request)
    {
        $newInterruption = new Interruption($request->all());
        if (empty($request->description_pt)) {
            $intType = InterruptionType::find($request->interruption_type_id);
            $newInterruption->description_pt = $intType->name_pt;
            $newInterruption->description_en = $intType->name_en;
        }
        $newInterruption->save();

        $newInterruption->calendar()->touch();

        $epochsWithExams = Epoch::where('calendar_id', $request->calendar_id)
            ->whereHas('exams')
            ->get();

        foreach ($epochsWithExams as $epoch) {
            foreach ($epoch->exams as $exam) {
                if (
                    Carbon::parse($newInterruption->start_date) == Carbon::parse($exam->date)
                    || Carbon::parse($newInterruption->end_date) == Carbon::parse($exam->date)
                ) {
                    return response()->json("The calendar has already exams on the interval specified for the interruption!", Response::HTTP_CONFLICT);
                }
            }
        }

        return response()->json(new InterruptionResource($newInterruption), Response::HTTP_CREATED);
    }

    public function update(NewInterruptionRequest $request, Interruption $interruption) {
        $interruption->fill($request->all());
        $interruption->save();
        return new InterruptionResource($interruption);
    }
    public function destroy(Interruption $interruption)
    {
        $interruption->delete();
        $interruption->calendar()->touch();

        return response()->json("Removed!");
    }
}
