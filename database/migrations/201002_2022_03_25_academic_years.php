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
        if (Schema::hasTable('academic_years')) {
            return false;
        }
        Schema::create('academic_years', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->string('code')->unique();
            $table->string('display');
            $table->boolean('active')->default(true);
            $table->boolean('selected')->default(true);

            $table->timestamp('s1_sync_last')->nullable();
            $table->boolean('s1_sync_active')->default(false);
            $table->boolean('s1_sync_waiting')->default(false);
            $table->timestamp('s2_sync_last')->nullable();
            $table->boolean('s2_sync_active')->default(false);
            $table->boolean('s2_sync_waiting')->default(false);

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
        Schema::dropIfExists('academic_years');
    }
};
