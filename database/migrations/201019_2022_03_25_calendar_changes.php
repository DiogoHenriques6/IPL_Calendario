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
        if (Schema::hasTable('calendar_changes')) {
            return false;
        }
        Schema::create('calendar_changes', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->unsignedBigInteger('calendar_id');
            $table->unsignedBigInteger('calendar_phase_id');
            $table->string('observations_pt')->nullable();
            $table->string('observations_en')->nullable();
            $table->boolean('is_temporary');

            $table->foreign('calendar_id')->references('id')->on('calendars');
            $table->foreign('calendar_phase_id')->references('id')->on('calendar_phases');

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
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
        Schema::dropIfExists('calendar_changes');
    }
};
