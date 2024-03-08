<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\Generic\ExamCommentResource;
use App\Models\ExamComment;
use App\Http\Controllers\Controller;
use App\Http\Requests\ExamCommentRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ExamCommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ExamCommentRequest $request)
    {
        $newComment = new ExamComment($request->all());
        $newComment->comment_language = $request->header("lang");
        $newComment->ignored = false;
        $newComment->user()->associate(Auth::user());
        $newComment->save();
        $comments = ExamComment::where('exam_id', $request->get('exam_id'))->get();
        return response()->json(ExamCommentResource::collection($comments), Response::HTTP_CREATED);
    }

    public function hideComment(ExamComment $comment) {
        $comment->ignored = true;
        $comment->save();

        $comments = ExamComment::where('exam_id', $comment->exam_id)->get();
        return response()->json(ExamCommentResource::collection($comments), Response::HTTP_OK);
    }

    public function showHiddenComment(ExamComment $comment) {
        $comment->ignored = false;
        $comment->save();

        $comments = ExamComment::where('exam_id', $comment->exam_id)->get();
        return response()->json(ExamCommentResource::collection($comments), Response::HTTP_OK);
    }

    public function update(ExamCommentRequest $request, ExamComment $examComment)
    {
        $examComment->fill($request->all());
        $examComment->save();
    }



    public function delete(ExamComment $comment) {
        if(Auth::id() != $comment->user_id){
            return response()->json("Comentario de utilizador diferente", Response::HTTP_FORBIDDEN);
        }
        if(Carbon::now()->diffInMinutes($comment->created_at) >= 15 ){
            return response()->json("Passados 15 minutos da criacao do comentario", Response::HTTP_FORBIDDEN);
        }
        $comment->delete();

        $comments = ExamComment::where('exam_id', $comment->exam_id)->get();
        return response()->json(ExamCommentResource::collection($comments), Response::HTTP_OK);
    }
}
