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
        if (Schema::hasTable('calendars')) {
            return false;
        }
        Schema::create('calendars', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->unsignedBigInteger('previous_calendar_id')->nullable();

            $table->decimal('version', $precision = 8, $scale = 2)->default(0.0);

            $table->unsignedBigInteger('course_id');
            $table->foreign('course_id')->references('id')->on('courses');
            $table->unsignedBigInteger('calendar_phase_id');
            $table->foreign('calendar_phase_id')->references('id')->on('calendar_phases');
            $table->unsignedBigInteger('academic_year_id');
            $table->foreign('academic_year_id')->references('id')->on('academic_years');

            $table->unsignedBigInteger('semester_id');
            $table->foreign('semester_id')->references('id')->on('semesters');

            $table->date('week_ten')->nullable();

            $table->string('observations_pt')->nullable();
            $table->string('observations_en')->nullable();
            $table->boolean('is_temporary')->default(false);
            $table->boolean('is_published')->default(false);
            $table->json('difference_from_previous_calendar')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->softDeletes();
        });


        Schema::table('calendars', function (Blueprint $table) {
            $table->foreign('previous_calendar_id')->references('id')->on('calendars');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendars');
    }
};
