<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\Generic\AcademicYearMenuResource;
use App\Http\Resources\Generic\AcademicYearSearchResource;
use App\Models\AcademicYear;
use App\Http\Controllers\Controller;
use App\Http\Requests\AcademicYearRequest;
use App\Http\Requests\AcademicYearSwitchRequest;
use App\Http\Resources\AcademicYearResource;
use App\Jobs\ProcessNewAcademicYear;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AcademicYearController extends Controller
{
    private function getList(){
        return AcademicYearResource::collection(AcademicYear::all()->sortBy('display'));
    }

    public function index()
    {
        return $this->getList();
    }

    /**
     * This will return a list of active academic years
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function menu()
    {
        return AcademicYearMenuResource::collection(AcademicYear::where('active', true)->get()->sortBy('display'));
    }

    /**
     * This will return a list of active academic years
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function search()
    {
        return AcademicYearSearchResource::collection(AcademicYear::where('active', true)->get()->sortBy('display'));
    }

    public function switch(AcademicYearSwitchRequest $request)
    {
        return response()->json()->withCookie('academic_year', $request->switch_to);
    }

    public function store(AcademicYearRequest $request)
    {
        try {
            DB::beginTransaction();
            $oldYear = AcademicYear::withTrashed()
                ->where('code', $request->code)
                ->first();
            //$numYears = AcademicYear::all()->count();
            if($oldYear){
                $oldYear->restore();
            } else {
                $newAcademicYear = new AcademicYear($request->all());
                $newAcademicYear->active = 0;//$numYears == 0;
                $newAcademicYear->selected = 0;//$numYears == 0;
                $newAcademicYear->save();
            }
            DB::commit();
        } catch (Exception $ex) {
            DB::rollBack();
            return response()->json("An error has occurred! {$ex->getMessage()}", Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return ($this->getList())->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function active($id)
    {
        $year = AcademicYear::find($id);
        $year->active = !$year->active;
        $year->save();
        return response()->json("Updated!", Response::HTTP_OK);
    }

    public function selected($id)
    {
        AcademicYear::where('selected', true)->update(['selected' => false]);
        $year = AcademicYear::find($id);
        $year->selected = !$year->selected;
        $year->save();

        return ($this->getList())->response()->setStatusCode(Response::HTTP_OK);
    }

    public function sync($id, $semester)
    {
        $semester = intval($semester);
        if( $semester != 1 && $semester != 2) {
            return response()->json("error on semester value!", Response::HTTP_BAD_REQUEST);
        }

        $hasWaiting = AcademicYear::where('s1_sync_active', true)->orWhere('s2_sync_active', true)->count();
        if($hasWaiting > 0){
            return response()->json("ano_letivo.Ja existem em sincronizacao, esperar ate acabar antes de comecar a proxima.",Response::HTTP_CONFLICT);
        }
        $year = AcademicYear::findOrFail($id);
        if( $semester == 1) {
            $year->s1_sync_waiting = true;
        } else {
            $year->s2_sync_waiting = true;
        }
        $year->save();

        // TODO Validate response, it returns 200 but will wait for response anyway
        ProcessNewAcademicYear::dispatchAfterResponse($year->code, $semester);

        return response("sync started");
    }

    public function destroy($id)
    {
        AcademicYear::find($id)->delete();
        return ($this->getList())->response()->setStatusCode(Response::HTTP_OK);
    }
}
