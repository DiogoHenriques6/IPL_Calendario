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
        if (Schema::hasTable('course_unit_logs')) {
            return false;
        }
        Schema::create('course_unit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_unit_id')->nullable();
            $table->unsignedBigInteger('course_unit_group_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('course_unit_id')->references('id')->on('course_units');
            $table->foreign('course_unit_group_id')->references('id')->on('course_unit_groups');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('description');

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
        Schema::dropIfExists('course_unit_logs');
    }
};
