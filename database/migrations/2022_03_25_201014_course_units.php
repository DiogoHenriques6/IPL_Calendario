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
        if (Schema::hasTable('course_units')) {
            return false;
        }
        Schema::create('course_units', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('responsible_user_id')->nullable();
            $table->unsignedBigInteger('course_unit_group_id')->nullable();
            $table->unsignedBigInteger('academic_year_id');

            $table->string('code');
            $table->string('name_pt');
            $table->string('name_en');
            $table->string('initials')->nullable();
            $table->integer('curricular_year');

            $table->unsignedBigInteger('semester_id');
            $table->foreign('semester_id')->references('id')->on('semesters');

            $table->foreign('course_id')->references('id')->on('courses');
            $table->foreign('academic_year_id')->references('id')->on('academic_years');
            $table->foreign('responsible_user_id')->references('id')->on('users');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
            $table->foreign('course_unit_group_id')->references('id')->on('course_unit_groups')->onDelete('set null');

            $table->integer('registered')->nullable();
            $table->integer('passed')->nullable();
            $table->integer('flunk')->nullable();

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course_units');
    }
};
