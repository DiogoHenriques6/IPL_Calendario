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
        if (Schema::hasTable('interruptions')) {
            return false;
        }
        Schema::create('interruptions', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->unsignedBigInteger('interruption_type_id');
            $table->unsignedBigInteger('calendar_id');
            $table->timestamp('start_date')->useCurrent();
            $table->timestamp('end_date')->useCurrent();
            $table->string('description_pt')->nullable();
            $table->string('description_en')->nullable();
            $table->boolean('enabled')->default(true);
            $table->foreign('interruption_type_id')->references('id')->on('interruption_types');
            $table->foreign('calendar_id')->references('id')->on('calendars');

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
        Schema::dropIfExists('interruptions');
    }
};
