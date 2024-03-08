<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Games;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class GamesController extends Controller
{
    //
    function score(Request $request)
    {
        Games::updateOrCreate(
            [
                'game'      => $request->input('game'),
                'user_id'   => Auth::id()
            ],
            [
                'time'  => $request->input('time'),
                'score' => $request->input('score'),
            ]
        );
    }
}
