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
        if (Schema::hasTable('course_unit_user')) {
            return false;
        }
        Schema::create('course_unit_user', function (Blueprint $table) {
            $table->unsignedBigInteger('course_unit_id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('course_unit_id')->references('id')->on('course_units');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course_unit_user');
    }
};
