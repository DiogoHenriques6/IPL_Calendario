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
        if (Schema::hasTable('exams')) {
            return false;
        }
        Schema::create('exams', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->unsignedBigInteger('epoch_id');
            $table->unsignedBigInteger('method_id');
            $table->unsignedBigInteger('group_id')->nullable();
            $table->unsignedBigInteger('course_unit_id');

            $table->string('room')->nullable();
            $table->timestamp('date_start')->useCurrent();
            $table->timestamp('date_end')->useCurrent();
            $table->boolean('in_class')->default(false);
            $table->string('hour')->nullable();
            $table->string('duration_minutes')->nullable();
            $table->string('observations_pt')->nullable();
            $table->string('observations_en')->nullable();
            $table->string('description_pt')->nullable();
            $table->string('description_en')->nullable();
            $table->foreign('epoch_id')->references('id')->on('epochs');
            $table->foreign('method_id')->references('id')->on('methods')->onDelete('cascade');
            $table->foreign('course_unit_id')->references('id')->on('course_units');

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
        Schema::dropIfExists('exams');
    }
};
