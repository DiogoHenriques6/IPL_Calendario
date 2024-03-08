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
        if (Schema::hasTable('epoch_type_semester')) {
            return false;
        }
        Schema::create('epoch_type_semester', function (Blueprint $table) {
            $table->unsignedBigInteger('epoch_type_id');
            $table->unsignedBigInteger('semester_id');
            $table->foreign('epoch_type_id')->references('id')->on('epoch_types');
            $table->foreign('semester_id')->references('id')->on('semesters');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('epoch_type_semester');
    }
};
