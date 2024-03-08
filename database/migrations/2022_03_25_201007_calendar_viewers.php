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
        if (Schema::hasTable('calendar_viewers')) {
            return false;
        }
        Schema::create('calendar_viewers', function (Blueprint $table) {
            $table->unsignedBigInteger('calendar_id');
            $table->unsignedBigInteger('group_id');
            $table->foreign('calendar_id')->references('id')->on('calendars');
            $table->foreign('group_id')->references('id')->on('groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendar_viewers');
    }
};
