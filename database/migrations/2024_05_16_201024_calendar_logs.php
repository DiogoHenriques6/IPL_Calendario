<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('calendar_logs')) {
            return false;
        }
        Schema::create('calendar_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calendar_id');
            $table->unsignedBigInteger('course_unit_id');
            $table->unsignedBigInteger('exam_id');
            $table->unsignedBigInteger('user_id');
            $table->date('old_date')->nullable();
            $table->date('new_date')->nullable();
            $table->boolean('is_create')->default(0);
            $table->boolean('is_update')->default(0);
            $table->timestamp('created_at')->useCurrent();


            $table->foreign('calendar_id')->references('id')->on('calendars');
            $table->foreign('course_unit_id')->references('id')->on('course_units');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendar_logs');
    }
};
