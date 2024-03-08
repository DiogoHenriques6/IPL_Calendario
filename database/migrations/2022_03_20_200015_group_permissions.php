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
        if (Schema::hasTable('group_permissions')) {
            return false;
        }
        Schema::create('group_permissions', function (Blueprint $table) {
            $table->primary(['group_id', 'permission_id', 'phase_id'], 'primary_grouped');
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('permission_id');
            $table->foreignId('phase_id')->nullable()->constrained('calendar_phases');

            $table->boolean('enabled')->default(true);

            $table->foreign('group_id')->references('id')->on('groups');
            $table->foreign('permission_id')->references('id')->on('permissions');

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
        Schema::dropIfExists('group_permissions');
    }
};
