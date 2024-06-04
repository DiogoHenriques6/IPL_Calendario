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
        if (Schema::hasTable('permission_categories')) {
            return false;
        }
        Schema::create('permission_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();
            $table->string('code');
            $table->string('name_pt');
            $table->string('name_en');

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
        Schema::dropIfExists('permission_categories');
    }
};
