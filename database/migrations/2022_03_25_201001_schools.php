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
        if (Schema::hasTable('schools')) {
            return false;
        }
        Schema::create('schools', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->string('code')->unique();
            $table->string('name_pt');
            $table->string('name_en');
            $table->unsignedBigInteger('gop_group_id')->nullable();
            $table->unsignedBigInteger('board_group_id')->nullable();
            $table->unsignedBigInteger('pedagogic_group_id')->nullable();
            $table->foreign('gop_group_id')->references('id')->on('groups');
            $table->foreign('board_group_id')->references('id')->on('groups');
            $table->foreign('pedagogic_group_id')->references('id')->on('groups');
            $table->unsignedBigInteger('index_campus')->nullable();
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
        Schema::dropIfExists('schools');
    }
};
