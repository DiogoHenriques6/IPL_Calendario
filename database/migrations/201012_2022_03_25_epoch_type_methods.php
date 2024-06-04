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
        if (Schema::hasTable('epoch_type_method')) {
            return false;
        }
        Schema::create('epoch_type_method', function (Blueprint $table) {
            $table->unsignedBigInteger('method_id');
            $table->unsignedBigInteger('epoch_type_id');
            $table->foreign('method_id')->references('id')->on('methods')->onDelete('cascade');
            $table->foreign('epoch_type_id')->references('id')->on('epoch_types');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('epoch_type_method');
    }
};
