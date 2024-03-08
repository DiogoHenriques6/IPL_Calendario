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

            $table->string('base_link')->nullable();

            $table->string('index_course_code')->nullable();                    // 3
            $table->string('index_course_name_pt')->nullable();                 // 4
            $table->string('index_course_name_en')->nullable();                 // 14
            $table->string('index_course_initials')->nullable();                // 11

            $table->string('index_course_unit_code')->nullable();               // 5
            $table->string('index_course_unit_name_pt')->nullable();            // 6
            $table->string('index_course_unit_name_en')->nullable();            // 13
            $table->string('index_course_unit_initials')->nullable();           // 12

            $table->string('index_course_unit_registered')->nullable();         // 8
            $table->string('index_course_unit_passed')->nullable();             // 9
            $table->string('index_course_unit_flunk')->nullable();              // 10

            $table->string('index_course_unit_branch')->nullable();             // 15

            $table->string('index_course_unit_curricular_year')->nullable();
            $table->string('index_course_unit_teachers')->nullable();

            $table->string('query_param_academic_year')->nullable();
            $table->string('query_param_semester')->nullable();
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
