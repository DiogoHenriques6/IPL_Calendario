<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\InterruptionTypeRequest;
use App\Http\Resources\Admin\Edit\InterruptionTypeEditResource;
use App\Http\Resources\Admin\InterruptionTypeListResource;
use App\Models\InterruptionType;
use Illuminate\Http\Response;

class InterruptionTypeController extends Controller
{
    public function index()
    {
        return InterruptionTypeListResource::collection(InterruptionType::all());
    }

    public function store(InterruptionTypeRequest $request)
    {
        $newInterruptionType = new InterruptionType($request->all());
        $newInterruptionType->save();

        return response()->json("Created!", Response::HTTP_CREATED);
    }

    public function show(InterruptionType $interruptionType)
    {
        return new InterruptionTypeEditResource($interruptionType);
    }

    public function update(InterruptionTypeRequest $request, InterruptionType $interruptionType)
    {
        $interruptionType->fill($request->all());
        $interruptionType->save();
    }

    public function destroy(InterruptionType $interruptionType)
    {
        $interruptionType->delete();
        return InterruptionTypeListResource::collection(InterruptionType::all());
    }
}
