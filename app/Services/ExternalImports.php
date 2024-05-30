<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Branch;
use App\Models\Course;
use App\Models\CourseUnit;
use App\Models\Group;
use App\Models\Interruption;
use App\Models\InterruptionType;
use App\Models\InterruptionTypesEnum;
use App\Models\School;
use App\Models\Semester;
use App\Models\User;
use App\Models\Webservice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Psy\Util\Str;

class ExternalImports
{

    public static function getYearHolidays($yearToImport)
    {
        $apiEndpoint = Config::get('constants.api.sapo_holidays_endpoint');
        $url = "{$apiEndpoint}?year={$yearToImport}";
        $holidays = simplexml_load_file($url);
        //dd($holidays->GetNationalHolidaysResult->Holiday);
        return $holidays->GetNationalHolidaysResult;//->Holiday;
    }

    public static function importYearHolidays($yearToImport, $calendarId)
    {
        $apiEndpoint = Config::get('constants.api.sapo_holidays_endpoint');
        $url = "{$apiEndpoint}?year={$yearToImport}";
        $holidays = simplexml_load_file($url);

        foreach ($holidays->GetNationalHolidaysResult->Holiday as $key => $holiday) {
            $newInterruption = new Interruption();
            $newInterruption->start_date            = $holiday->Date;
            $newInterruption->end_date              = $holiday->Date;
            $newInterruption->description_pt        = $holiday->Name;
            $newInterruption->description_en        = $holiday->Name;
            $newInterruption->interruption_type_id  = InterruptionType::where('name_pt', InterruptionTypesEnum::HOLIDAYS)->first()->id;
            $newInterruption->calendar_id           = $calendarId;
            $newInterruption->save();
        }
    }

    public static function importCoursesFromWebService(int $academicYearCode, int $semester)
    {
        set_time_limit(0);
        ini_set('max_execution_time', 0);

        // update/created counters
        $coursesCount = [
            "created" => 0,
            "updated" => 0,
        ];
        $courseUnitCount = [
            "created" => 0,
            "updated" => 0,
        ];

        $isServer = env('APP_SERVER', false);
        Log::channel('courses_sync')->info('Start "importCoursesFromWebService" sync for Year code (' . $academicYearCode . ') and semester (' . $semester . ')');
        try{
            //validate if the semester is 1 or 2
            if( $semester != 1 && $semester != 2) {
                exit();
            }
            //get AcademicYear Id
            $academicYear = AcademicYear::where('code', $academicYearCode)->firstOrFail();
            if( !$academicYear ){
                exit();
            }
            $semester_code = "first_semester";
            // update flags for front-end
            if( $semester == 1) {
                $academicYear->s1_sync_waiting = false;
                $academicYear->s1_sync_active = true;
            } else {
                $academicYear->s2_sync_waiting = false;
                $academicYear->s2_sync_active = true;
                $semester_code = "second_semester";
            }
            $academicYear->save();

            // save semester ID instead of just a number
            $semester_id = Semester::where("code", $semester_code)->first()->id;
            $academicYearId = $academicYear->id;
            //change academicYearCode to 2023/24 format (change accordingly to the webservice argument)
            $academicYearCode = substr($academicYear->code,0,4). "/" .substr($academicYear->code,4,6);

            // get list of schools that have "base_link" data
            $schools = School::whereNotNull('index_campus')->where('index_campus', '<>', '')->get();
            $webservice = Webservice::where('id', 1)->firstOrFail();


            //IMPORT all docentes
            $apiEndpoint = $webservice->base_link . $webservice->teachers_link.'?formato=json';
//            Log::channel('sync_test')->info($apiEndpoint);
            $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
            if($response->failed()){
                Log::channel('courses_sync')->info('FAILED - "importDocentesFromWebService" sync');
            }
            else{
                $teachers_data = $response->body();
                $teachers = json_decode($teachers_data);
//                LOG::channel("sync_test")->info(sizeof($teachers));
                foreach ($teachers as $teacher) {
                    if (!empty($teacher)) {
                        // if the user is not created, it will create a new record for the user.
                        User::updateOrCreate(
                            [
                                "email" => $teacher->{$webservice->index_docentes_email},
                            ],
                            [
                                "name" => $teacher->{$webservice->index_docentes_name},
                                "password" => "",
                            ]
                        )->groups()->syncWithoutDetaching(Group::isTeacher()->get());
                    }
                }
            }
//            Log::channel('sync_test')->info("Quantity of teachers: " . sizeof($teachers));
            // Loop for each saved school
            foreach ($schools as $school) {
                LOG::channel("sync_test")->info("School: " . $school->code);

                // From URL to get webpage
                //TODO try to change the S to be dinamic
                $apiEndpoint = $webservice->base_link . $webservice->course_units_link. '?' . $webservice->query_param_semester . '=S' . $semester . '&' . $webservice->query_param_campus . '=' . $school->index_campus . '&' . $webservice->query_param_academic_year . '=' . $academicYearCode . '&formato=json';
//                Log::channel('sync_test')->info($apiEndpoint);

                $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
                if($response->failed()){
                    Log::channel('courses_sync')->info('FAILED - "importCoursesFromWebService" sync for Year code (' . $academicYearCode . ') and semester (' . $semester . ')');
                    continue;
                }
                $file_data = $response->body();
                $courseUnits = json_decode($file_data);
//                Log::channel('sync_test')->info($file_data);

                // check if the file has any content (prevent going forward
                if( empty($courseUnits)) {
                    Log::channel('courses_sync')->info('EMPTY Courses - "importCoursesFromWebService" sync for Year code (' . $academicYearCode . ') and semester (' . $semester . ')');
                    continue;
                }
                Log::channel('courses_sync')->info("Quantity of course units: " . sizeof($courseUnits));

                //Get docentes by UCs
                //TODO CHANGE CAMPUS VALUE to dinamic for each school accordingly
                $apiEndpoint = $webservice->base_link . $webservice->teachers_by_uc_link . '?' . $webservice->query_param_semester . '=S' . $semester . '&' . $webservice->query_param_academic_year . '=' . $academicYearCode . '&' . $webservice->query_param_campus . '=' . 2 . '&formato=json';
                Log::channel('sync_test')->info($apiEndpoint);

                $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
                if($response->failed()){
                    Log::channel('courses_sync')->info('FAILED - "importDocentesFromWebService" sync for Year code (' . $academicYearCode . ') and semester (' . $semester . ')');
                    continue;
                }
                $teachers_data = $response->body();
                $teachersByCourseUnit = json_decode($teachers_data);

                if( empty($teachersByCourseUnit)) {
                    Log::channel('courses_sync')->info('EMPTY Teachers - "importTeachersFromWebService" sync for Year code (' . $academicYearCode . ') and semester (' . $semester . ')');
                    continue;
                }
                Log::channel('courses_sync')->info("Total UCs: ". sizeof($teachersByCourseUnit));

                $teachersDictionary = [];


                //TODO codigo de UC e Curso correspondente ao webservice dos docentes
                foreach ($teachersByCourseUnit as $item) {
                    $identifier = $item->codigo_curso . '_' . $item->codigoUC;
                    // Store data in the dictionary using the unique identifier as the key
                    $teachersDictionary[$identifier] = $item;
                }

                // loop for each course unit
                $previousCourse = null;
                foreach ($courseUnits as $courseUnit) {
                    if (!empty($courseUnit)) {
                        //check if course and UC belong to the current school
                        //TODO remove this, if request is done with school filter this validation doesnt need to be done
                        if ($courseUnit->CD_INSTITUIC != $school->code){
                            continue;
                        }
//                        Log::channel('sync_test')->info('Course Unit - ' . json_encode($courseUnit));
                        $teachersByUC = [];
                        $identifier = $courseUnit->{$webservice->index_course_code} . '_' . $courseUnit->{$webservice->index_course_unit_code};
                        if (isset($teachersDictionary[$identifier])) {
                            $teachersByUC = $teachersDictionary[$identifier];
                        }

                        $course = Course::firstOrCreate(
                            [
                                "code" => $courseUnit->{$webservice->index_course_code},
                                "academic_year_id" => $academicYearId
                            ],
                            [
                                "school_id" => $school->id,
                                "initials"  => $teachersByUC->{$webservice->index_course_initials},//$gen_initials,

                                "name_pt"   => $courseUnit->{$webservice->index_course_name_pt},
                                "name_en"   => $courseUnit->{$webservice->index_course_name_en} !== '' ? $courseUnit->{$webservice->index_course_name_en} :$courseUnit->{$webservice->index_course_name_pt}, // this will duplicate the value as default, to prevent empty states// this will duplicate the value as default, to prevent empty states
                                "degree"    => DegreesUtil::getDegreeId($courseUnit->{$webservice->index_course_name_pt}),
                            ]
                        );

                        // check for updates and then update the different value
                        // user just created in the database; it didn't exist before.
                        if( !$course->wasRecentlyCreated ) {
                            $hasUpdate = false;
                            if($course->initials != $teachersByUC->{$webservice->index_course_initials}) {
                                $hasUpdate = true;
                                $course->initials = $teachersByUC->{$webservice->index_course_initials};
                            }
                            if($course->name_pt != $courseUnit->{$webservice->index_course_name_pt}) {
                                $hasUpdate = true;
                                $course->name_pt =  $courseUnit->{$webservice->index_course_name_pt};
                            }
                            if($course->name_en !=  $courseUnit->{$webservice->index_course_name_en} || $course->name_en == '') {
                                $hasUpdate = true;
                                $course->name_en  = $courseUnit->{$webservice->index_course_name_en} !== '' ? $courseUnit->{$webservice->index_course_name_en} : $courseUnit->{$webservice->index_course_name_pt};
                                // this will duplicate the value as default, to prevent empty states
                            }
                            if($course->degree != DegreesUtil::getDegreeId($courseUnit->{$webservice->index_course_name_pt})) {
                                $hasUpdate = true;
                                $course->degree = DegreesUtil::getDegreeId($courseUnit->{$webservice->index_course_name_pt});
                            }
                            if($hasUpdate){
                                $course->save();
                                $coursesCount["updated"]++;
                            }
                        } else {
                            $coursesCount["created"]++;
                        }

//                        Log::channel('sync_test')->info('Cursos (' . $course . ')' );

                        // https://laravel.com/docs/9.x/eloquent-relationships#syncing-associations
                        //$course->academicYears()->syncWithoutDetaching($academicYearId); // -> Old logic, it had a pivot table [academic_year_course]
                        // Retrieve Branch by course_id or create it if it doesn't exist...

                        $branch = Branch::firstOrCreate(
                            [
                                "course_id" => $course->id,
                                "branch_number" => $courseUnit->{$webservice->index_course_unit_branch},
                                "academic_year_id" => $academicYearId
                            ],
                            [
                                "name_pt"       => ($courseUnit->{$webservice->index_course_unit_branch} == 0 ? "Tronco Comum" : "Ramo " . $courseUnit->{$webservice->index_course_unit_branch}) ,
                                "name_en"       => ($courseUnit->{$webservice->index_course_unit_branch} == 0 ? "Common Branch" : "Branch " . $courseUnit->{$webservice->index_course_unit_branch}),
                                "initials_pt"   => ($courseUnit->{$webservice->index_course_unit_branch} == 0 ? "TComum" : "R" . $courseUnit->{$webservice->index_course_unit_branch}),
                                "initials_en"   => ($courseUnit->{$webservice->index_course_unit_branch} == 0 ? "CBranch" : "B" . $courseUnit->{$webservice->index_course_unit_branch}),
                            ]
                        );
//                      Log::channel('sync_test')->info('Branchs (' . $branch );

                        // Retrieve CourseUnit by code or create it if it doesn't exist...
                        $newestCourseUnit = CourseUnit::firstOrCreate(
                            [
                                "code" => $courseUnit->{$webservice->index_course_unit_code},
                                "semester_id" => $semester_id,
                                "academic_year_id" => $academicYear->id
                            ],
                            [
                                "course_id" => $course->id,
                                "branch_id" => $branch->id,
                                "curricular_year" => $courseUnit->{$webservice->index_course_unit_curricular_year},
                                "initials" =>  $courseUnit->{$webservice->index_course_unit_initials},
                                "name_pt" =>  $courseUnit->{$webservice->index_course_unit_name_pt},
                                "name_en"   => $courseUnit->{$webservice->index_course_unit_name_en} !== '' ? $courseUnit->{$webservice->index_course_unit_name_en} :$courseUnit->{$webservice->index_course_unit_name_pt}, // this will duplicate the value as default, to prevent empty states

                                "registered"=>   $teachersByUC->{$webservice->index_course_unit_registered} ? (int)$teachersByUC->{$webservice->index_course_unit_registered}  : 0,
                                "passed"    =>  $teachersByUC->{$webservice->index_course_unit_passed}    ? (int)$teachersByUC->{$webservice->index_course_unit_passed}       : 0,
                                "flunk"     =>  $teachersByUC->{$webservice->index_course_unit_flunk}     ? (int)$teachersByUC->{$webservice->index_course_unit_flunk}       : 0,
                            ]
                        );

                        // check for updates and then update the different value
                        // user just created in the database; it didn't exist before.
                        if( !$newestCourseUnit->wasRecentlyCreated ) {
                            $hasUpdate = false;
                            if($newestCourseUnit->curricular_year != $courseUnit->{$webservice->index_course_unit_curricular_year}) {
                                $hasUpdate = true;
                                $newestCourseUnit->curricular_year = $courseUnit->{$webservice->index_course_unit_curricular_year};
                            }
                            if($newestCourseUnit->initials != $courseUnit->{$webservice->index_course_unit_initials}) {
                                $hasUpdate = true;
                                $newestCourseUnit->initials = $courseUnit->{$webservice->index_course_unit_initials};
                            }
                            if($newestCourseUnit->name_pt != $courseUnit->{$webservice->index_course_unit_name_pt}) {
                                $hasUpdate = true;
                                $newestCourseUnit->name_pt = $courseUnit->{$webservice->index_course_unit_name_pt};
                            }
                            if($newestCourseUnit->name_en != $courseUnit->{$webservice->index_course_unit_name_en} || $newestCourseUnit->name_en == '') {
                                $hasUpdate = true;
                                $newestCourseUnit->name_en = $courseUnit->{$webservice->index_course_unit_name_en} != '' ? $courseUnit->{$webservice->index_course_unit_name_en} : $courseUnit->{$webservice->index_course_unit_name_pt};
                            }

                            if($newestCourseUnit->registered != (int)$teachersByUC->{$webservice->index_course_unit_registered}) {
                                $hasUpdate = true;
                                $newestCourseUnit->registered = (int)$teachersByUC->{$webservice->index_course_unit_registered};
                            }
                            if($newestCourseUnit->passed != (int)$teachersByUC->{$webservice->index_course_unit_passed}) {
                                $hasUpdate = true;
                                $newestCourseUnit->passed = (int)$teachersByUC->{$webservice->index_course_unit_passed};
                            }
                            if($newestCourseUnit->flunk != (int)$teachersByUC->{$webservice->index_course_unit_flunk}) {
                                $hasUpdate = true;
                                $newestCourseUnit->flunk = (int)$teachersByUC->{$webservice->index_course_unit_flunk};
                            }
                            if($hasUpdate){
                                $newestCourseUnit->save();
                                $courseUnitCount["updated"]++;
                            }
                        } else {
                            $courseUnitCount["created"]++;
                        }
//                        LOG::channel("sync_test")->info($newestCourseUnit);

                        // https://laravel.com/docs/9.x/eloquent-relationships#syncing-associations
                        //$newestCourseUnit->academicYears()->syncWithoutDetaching($academicYearId); // -> Old logic, it had a pivot table [academic_year_course_unit]
                        // split teaches from request
                        // 2100;Matemáticas Gerais;210001;Matemática A ;Ana Cristina Felizardo Henriques(ana.f.henriques),Diogo Pedro Ferreira Nascimento Baptista(diogo.baptista),Fátima Maria Marques da Silva(fatima.silva),José Maria Gouveia Martins(jmmartins);1


                        // Retrieve CourseUnit by code or create it if it doesn't exist...

                        if(!empty($teachersByUC->{$webservice->index_course_unit_teachers})) {
                            LOG::channel("courses_sync")->info(["Teacher: " , isset($teachersByUC->{$webservice->index_course_unit_teachers})]);
                            $teachers = explode(",", $teachersByUC->{$webservice->index_course_unit_teachers});
//                            Log::channel('sync_test')->info('Teacher -' . $teachersByUC->{$webservice->index_course_unit_teachers});
                            $teachersForCourseUnit = [];
                            foreach ($teachers as $teacher) {

                                if (!empty($teacher)) {
                                        // validate if user already exists on our USERS table
                                        $foundUser =User::where('name', 'like', "%$teacher%")->orWhere('email', 'like', "%$teacher%")->first();
                                        if (is_null($foundUser)) {
                                            $apiEndpoint = $webservice->base_link . $webservice->teachers_link .'?login=' . $teacher . 'formato=json';
                                            $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
                                            if ($response->failed()) {
//                                                Log::channel('docentes_sync.log')->info('FAILED - "importDocentesFromWebService" sync for Year code (' . $academicYearCode );
                                                continue;
                                            }
                                            $teacher_data = $response->body();
                                            $newTeacher = json_decode($teacher_data);
                                            if(empty($newTeacher)){
                                                continue;
                                            }
                                            $foundUser = User::create([
                                                "email" => $newTeacher->{$webservice->index_docentes_email},
                                                "name" => $newTeacher->{$webservice->index_docentes_name},
                                                "password" => "",
                                            ]);
                                        }
                                        $foundUser->groups()->syncWithoutDetaching(Group::isTeacher()->get());
                                        $teachersForCourseUnit[] = $foundUser->id;
                                }
                            }

                            $newestCourseUnit->teachers()->sync($teachersForCourseUnit, true);
                        }
                    }
                }

                //get all courses without num_years and update the number
                $courses = Course::whereNull('num_years')->get();
                foreach ($courses as $course) {
                    $course->num_years = $course->courseUnits()->max('curricular_year');
                    $course->save();
                }

            }

            if($semester === 1) {
                $academicYear->s1_sync_last = Carbon::now();
                $academicYear->s1_sync_active = false;
                $academicYear->save();
            } else if($semester === 2) {
                $academicYear->s2_sync_last = Carbon::now();
                $academicYear->s2_sync_active = false;
                $academicYear->save();
            }
        } catch(\Exception $e){
            Log::channel('courses_sync')->error('There was an error syncing. -------- ' . $e->getMessage());
            $academicYear = AcademicYear::where('code', $academicYearCode)->firstOrFail();
            if($semester === 1) {
                $academicYear->s1_sync_active = false;
            } else {
                $academicYear->s2_sync_active = false;
            }
            $academicYear->save();
        }
        Log::channel('courses_sync')->info("Count Courses:\r\n   - Created: " . $coursesCount["created"] . "\r\n   - Updated: " . $coursesCount["updated"]);
        Log::channel('courses_sync')->info("Count Courses Units:\r\n   - Created: " . $courseUnitCount["created"] . "\r\n   - Updated: " . $courseUnitCount["updated"]);
        Log::channel('courses_sync')->info('End "importCoursesFromWebService" sync for Year code (' . $academicYearCode . ') and semester (' . $semester . ')');
    }



    public static function importSingleUCFromWebService(int $academicYearCode, int $schoolId, int $courseCode, int $coduc)
    {
        set_time_limit(0);
        ini_set('max_execution_time', 0);

        $isServer = env('APP_SERVER', false);
        Log::channel('courses_sync')->info('Start "importSingleUCFromWebService" sync for Year code (' . $academicYearCode . '), UC Code (' . $coduc . ')');
        try{

            // update/created counters
            $coursesCount = [
                "created" => 0,
                "updated" => 0,
            ];
            $courseUnitCount = [
                "created" => 0,
                "updated" => 0,
            ];

            //get AcademicYear Id
            $academicYear = AcademicYear::where('code', $academicYearCode)->firstOrFail();

            if( !$academicYear ){
                exit();
            }
            $academicYearId = $academicYear->id;
            // TODO change academicYearCode to 2023/24 format (change accordingly to the webservice argument)
            $academicYearCode = substr($academicYear->code,0,4). "/" .substr($academicYear->code,4,6);

            // get list of schools that have "base_link" data
            $school = School::find($schoolId);
            $webservice = Webservice::where('id', 1)->firstOrFail();

            $courseUnits = [];


            // From URL to get webpage contents
            $apiEndpoint = $webservice->base_link . $webservice->course_units_link . '?' . $webservice->index_course_code . '=' .  $courseCode .'&'.$webservice->query_param_academic_year.'=' . $academicYearCode . '&formato=json';

            LOG::channel("sync_test")->info($apiEndpoint);
            $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
            if($response->failed()){
                Log::channel('courses_sync')->info('FAILED - "importSingleUCFromWebService" sync for Year code (' . $academicYearCode . '), UC Code (' . $coduc . ')');
                return false;
            }
            $file_data = $response->body();
            $courseUnits = json_decode($file_data);

            // check if the file has any content (prevent going forward
            if( empty($courseUnits)) {
                Log::channel('courses_sync')->info('EMPTY Courses - "importSingleUCFromWebService" sync for Year code (' . $academicYearCode . '), UC Code (' . $coduc . ')');
                return false;
            }
            Log::channel('courses_sync')->info(sizeof($courseUnits));
            // loop for each course unit
            foreach ($courseUnits as $courseUnit) {
                if (!empty($courseUnit)) {
                    if ($courseUnit->{$school->index_course_unit_code} != $coduc) {
                        continue;
                    }
                    $apiEndpoint = $webservice->base_link . $webservice->teachers_by_uc_link . '?' . $webservice->query_param_course_unit . '=' .$coduc. '&' . $webservice->query_param_academic_year . '=' . $academicYearCode . '&' . $webservice->query_param_campus . '=' . $school->index_campus . '&formato=json';
                    Log::channel('sync_test')->info($apiEndpoint);
                    $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
                    if($response->failed()){
                        Log::channel('courses_sync')->info('FAILED - "importDocentesFromWebService" sync for Year code (' . $academicYearCode . ')');
                        continue;
                    }
                    $teachers_data = $response->body();
                    $teachersByUC = json_decode($teachers_data)[0];

                    $semester = substr($courseUnit->BK_SIGES_PERIODO_TEMPO, 1, 1);
                    $semester_id = Semester::where("number",$semester)->first()->id;
                    // Retrieve Course by code or create it if it doesn't exist...
                    $course = Course::firstOrCreate(
                        [
                            "code" => $courseUnit->{$webservice->index_course_code},
                            "academic_year_id" => $academicYearId
                        ],
                        [
                            "school_id" => $school->id,
                            "initials"  => $teachersByUC->{$webservice->index_course_initials},//$gen_initials,

                            "name_pt"   => $courseUnit->{$webservice->index_course_name_pt},
                            "name_en"   => $courseUnit->{$webservice->index_course_name_en} !== '' ? $courseUnit->{$webservice->index_course_name_en} :$courseUnit->{$webservice->index_course_name_pt}, // this will duplicate the value as default, to prevent empty states
                            "degree"    => DegreesUtil::getDegreeId($courseUnit->{$webservice->index_course_name_pt}),
                        ]
                    );

                    // check for updates and then update the different value
                    // user just created in the database; it didn't exist before.
                    if( !$course->wasRecentlyCreated ) {
                        $hasUpdate = false;
                        if($course->initials != $teachersByUC->{$webservice->index_course_initials}) {
                            $hasUpdate = true;
                            $course->initials = $teachersByUC->{$webservice->index_course_initials};
                        }
                        if($course->name_pt != $courseUnit->{$webservice->index_course_name_pt}) {
                            $hasUpdate = true;
                            $course->name_pt =  $courseUnit->{$webservice->index_course_name_pt};
                        }
                        if($course->name_en !=  $courseUnit->{$webservice->index_course_name_en}) {
                            $hasUpdate = true;
                            $course->name_en = $courseUnit->{$webservice->index_course_name_en} !== '' ? $courseUnit->{$webservice->index_course_name_en} :$courseUnit->{$webservice->index_course_name_pt};
                        }
                        if($course->degree != DegreesUtil::getDegreeId($courseUnit->{$webservice->index_course_name_pt})) {
                            $hasUpdate = true;
                            $course->degree = DegreesUtil::getDegreeId($courseUnit->{$webservice->index_course_name_pt});
                        }
                        if($hasUpdate){
                            $course->save();
                            $coursesCount["updated"]++;
                        }
                    } else {
                        $coursesCount["created"]++;
                    }
                    // https://laravel.com/docs/9.x/eloquent-relationships#syncing-associations
                    //$course->academicYears()->syncWithoutDetaching($academicYearId); // -> Old logic, it had a pivot table [academic_year_course]
                    // Retrieve Branch by course_id or create it if it doesn't exist...
                    $branch = Branch::firstOrCreate(
                        ["course_id" => $course->id],
                        [
                            "name_pt"       => "Tronco Comum",
                            "name_en"       => "Common Branch",
                            "initials_pt"   => "TComum",
                            "initials_en"   => "CBranch",
                        ]
                    );
                    // Retrieve CourseUnit by code or create it if it doesn't exist...
                    $newestCourseUnit = CourseUnit::firstOrCreate(
                        [
                            "code" => $courseUnit->{$webservice->index_course_unit_code},
                            "semester_id" => $semester_id,
                            "academic_year_id" => $academicYear->id
                        ],
                        [
                            "course_id" => $course->id,
                            "branch_id" => $branch->id,
                            "curricular_year" => $courseUnit->{$webservice->index_course_unit_curricular_year},
                            "initials" =>  $courseUnit->{$webservice->index_course_unit_initials},
                            "name_pt" =>  $courseUnit->{$webservice->index_course_unit_name_pt},
                            "name_en" =>  $courseUnit->{$webservice->index_course_unit_name_en}, // this will duplicate the value as default, to prevent empty states
                        ]
                    );
                    // TODO Check branch (ramo)

                    // check for updates and then update the different value
                    // user just created in the database; it didn't exist before.
                    if( !$newestCourseUnit->wasRecentlyCreated ) {
                        $hasUpdate = false;
                        if($newestCourseUnit->curricular_year != $courseUnit->{$webservice->index_course_unit_curricular_year}) {
                            $hasUpdate = true;
                            $newestCourseUnit->curricular_year = $courseUnit->{$webservice->index_course_unit_curricular_year};
                        }
                        if($newestCourseUnit->initials != $courseUnit->{$webservice->index_course_unit_initials}) {
                            $hasUpdate = true;
                            $newestCourseUnit->initials = $courseUnit->{$webservice->index_course_unit_initials};
                        }
                        if($newestCourseUnit->name_pt != $courseUnit->{$webservice->index_course_unit_name_pt}) {
                            $hasUpdate = true;
                            $newestCourseUnit->name_pt = $courseUnit->{$webservice->index_course_unit_name_pt};
                        }
                        if($newestCourseUnit->name_en != $courseUnit->{$webservice->index_course_unit_name_en}) {
                            $hasUpdate = true;
                            $newestCourseUnit->name_en = $courseUnit->{$webservice->index_course_unit_name_en};
                        }
                        if($hasUpdate){
                            $newestCourseUnit->save();
                            $courseUnitCount["updated"]++;
                        }
                    } else {
                        $courseUnitCount["created"]++;
                    }
                    if(!empty($teachersByUC->{$webservice->index_course_unit_teachers})) {

                        $teachers = explode(",", $teachersByUC->{$webservice->index_course_unit_teachers});
                        Log::channel('sync_test')->info('Teacher -' . $teachersByUC->{$webservice->index_course_unit_teachers});
                        $teachersForCourseUnit = [];
                        foreach ($teachers as $teacher) {

                            if (!empty($teacher)) {

                                // validate if user already exists on our USERS table
                                $foundUser =User::where('name', 'like', "%$teacher%")->orWhere('email', 'like', "%$teacher%")->first();
                                if (is_null($foundUser)) {
                                    $apiEndpoint = $webservice->base_link . $webservice->teachers_link .'?login=' . $teacher . 'formato=json';
                                    $response = Http::connectTimeout(5*60)->timeout(5*60)->get($apiEndpoint);
                                    if ($response->failed()) {
                                        Log::channel('courses_sync')->info('FAILED - "importDocentesFromWebService" sync for Year code (' . $academicYearCode );
                                        continue;
                                    }
                                    $teacher_data = $response->body();
//                                    LOG::channel("sync_test")->info("Username " .$teacher_data);
                                    $newTeacher = json_decode($teacher_data);
                                    if(empty($newTeacher)){
                                        continue;
                                    }
                                    LOG::channel("sync_test")->info("UserArray " . $newTeacher->email);

                                    $foundUser = User::create([
                                        "email" => $newTeacher->{$webservice->index_docentes_email},
                                        "name" => $newTeacher->{$webservice->index_docentes_name},
                                        "password" => "",
                                    ]);
                                }
                                $foundUser->groups()->syncWithoutDetaching(Group::isTeacher()->get());
                                $teachersForCourseUnit[] = $foundUser->id;
                            }
                        }
                        $newestCourseUnit->teachers()->sync($teachersForCourseUnit, true);
                    }
                    // https://laravel.com/docs/9.x/eloquent-relationships#syncing-associations
                    $newestCourseUnit->teachers()->sync($teachersForCourseUnit, true);
                }
            }

        } catch(\Exception $e){
            Log::channel('courses_sync')->error('There was an error syncing. -------- ' . $e->getMessage());
            return false;
        }
        Log::channel('courses_sync')->info('End "importSingleUCFromWebService" sync for Year code (' . $academicYearCode . '), UC Code (' . $coduc . ')');
        return true;
    }

    //TODO MISSING STUDENT DATA
    public static function importStudentFromWebService(mixed $email)
    {
        set_time_limit(0);
        ini_set('max_execution_time', 0);

        $isServer = env('APP_SERVER', false);
        Log::channel('students_sync')->info('Start "importStudentFromWebService" sync for email (' . $email . ')');
        try {

            // validate if user already exists on our USERS table
            $user = User::where("email", $email)->first();
            if (is_null($user)) {
                // if the user is not created, it will create a new record for the user.
                $user = User::create([
                    "email" => $email,
                    "name" => $email,
                    "password" => "",
                ]);
            }
        }
        catch(\Exception $e){
            Log::channel('students_sync')->error('There was an error syncing. -------- ' . $e->getMessage());
        }
        Log::channel('students_sync')->info('End "importStudentFromWebService" sync for email (' . $email . ')');
    }
}
