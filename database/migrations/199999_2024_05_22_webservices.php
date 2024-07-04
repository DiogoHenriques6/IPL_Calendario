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
        if (Schema::hasTable('webservices')) {
            return false;
        }
        Schema::create('webservices', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();

            $table->string('base_link')->nullable();
            $table->string('course_units_link')->nullable();
            $table->string('teachers_by_uc_link')->nullable();
            $table->string('teachers_link')->nullable();

            // TODO still missing cod_uc, cod_curso no webservice teachers_by_uc_link

            $table->string('index_course_code')->nullable();                    // 3
            $table->string('index_course_name_pt')->nullable();                 // 4
            $table->string('index_course_name_en')->nullable();                 // 14
            $table->string('index_course_initials')->nullable();                // docentes_course_link webservice
            $table->string('index_course_schedule')->nullable();

            $table->string('index_course_unit_code')->nullable();               // 5
            $table->string('index_course_unit_name_pt')->nullable();            // 6
            $table->string('index_course_unit_name_en')->nullable();            // 13
            $table->string('index_course_unit_initials')->nullable();           // docentes_course_link webservice


            $table->string('index_course_unit_registered')->nullable();         // docentes_course_link webservice
            $table->string('index_course_unit_passed')->nullable();             // docentes_course_link webservice
            $table->string('index_course_unit_flunk')->nullable();              // docentes_course_link webservice

            $table->string('index_course_unit_branch')->nullable();             // 15

            $table->string('index_course_unit_curricular_year')->nullable();

            $table->string('index_docentes_name')->nullable();                  // docentes webservice
            $table->string('index_docentes_email')->nullable();                 // docentes webservice
            $table->string('index_course_unit_teachers')->nullable();

            $table->string('query_param_academic_year')->nullable();
            $table->string('query_param_semester')->nullable();
            $table->string('query_param_course')->nullable();
            $table->string('query_param_campus')->nullable();
            $table->string('query_param_course_unit')->nullable();

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('webservices');
    }
};
