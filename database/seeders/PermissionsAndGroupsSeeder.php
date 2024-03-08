<?php

namespace Database\Seeders;

use App\Models\CalendarPhase;
use App\Models\EpochType;
use App\Models\EvaluationType;
use App\Models\Group;
use App\Models\InterruptionType;
use App\Models\Permission;
use App\Models\PermissionCategory;
use App\Models\PermissionSection;
use App\Models\School;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Database\Seeder;

class PermissionsAndGroupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $userGroups = [
            ["code" => "super_admin",             "is_removable" => false,  "name_pt" => "Super Admin",                     "name_en" => "Super Admin"                       ],
            ["code" => "admin",                   "is_removable" => false,  "name_pt" => "Administrador de Sistema",        "name_en" => "System Admin"                      ],
            ["code" => "student",                 "is_removable" => false,  "name_pt" => "Estudante",                       "name_en" => "Student"                           ],
            ["code" => "comission",               "is_removable" => false,  "name_pt" => "Comissão Científico-Pedagógica",  "name_en" => "Scientific-Pedagogical Commission" ],
            ["code" => "pedagogic",               "is_removable" => false,  "name_pt" => "Conselho Pedagógico",             "name_en" => "Pedagogical Council"               ],
            ["code" => "coordinator",             "is_removable" => false,  "name_pt" => "Coordenador de Curso",            "name_en" => "Course coordinator"                ],
            ["code" => "board",                   "is_removable" => false,  "name_pt" => "Direção",                         "name_en" => "Management"                        ],
            ["code" => "gop",                     "is_removable" => false,  "name_pt" => "GOP",                             "name_en" => "GOP"                               ],
            ["code" => "teacher",                 "is_removable" => false,  "name_pt" => "Docente",                         "name_en" => "Teacher"                           ],
            ["code" => "responsible_pedagogic",   "is_removable" => false,  "name_pt" => "Responsável Conselho Pedagógico", "name_en" => "Responsible Pedagogical Council"   ],
            ["code" => "responsible_course_unit", "is_removable" => false,  "name_pt" => "Responsável Unidade Curricular",  "name_en" => "Responsible Curricular Unit"       ],
            ["code" => "board_estg",              "is_removable" => true,   "name_pt" => "Direção ESTG",                    "name_en" => "Management ESTG"                   ],
            ["code" => "gop_estg",                "is_removable" => true,   "name_pt" => "GOP ESTG",                        "name_en" => "GOP ESTG"                          ],
            ["code" => "pedagogic_estg",          "is_removable" => true,   "name_pt" => "Conselho Pedagógico ESTG",        "name_en" => "Pedagogical Council ESTG"          ],
        ];

        foreach ($userGroups as $userGroup) {
            $newUserGroup = new Group();
            $newUserGroup->code = $userGroup['code'];
            $newUserGroup->name_pt = $userGroup['name_pt'];
            $newUserGroup->name_en = $userGroup['name_en'];
            $newUserGroup->enabled = true;
            $newUserGroup->removable = $userGroup['is_removable'];
            $newUserGroup->save();
        }

        $users = [
            ["name" => "Administrador",             "email" => "admin@ipleiria.pt",             "group_code" => "super_admin"             ],
            ["name" => "Administrador de Sistema",  "email" => "sys_admin@ipleiria.pt",         "group_code" => "admin"                   ],
            ["name" => "CCP",                       "email" => "ccp@ipleiria.pt",               "group_code" => "comission"               ],
            ["name" => "CP",                        "email" => "cp@ipleiria.pt",                "group_code" => "pedagogic"               ],
            ["name" => "CC",                        "email" => "cc@ipleiria.pt",                "group_code" => "coordinator"             ],
            ["name" => "Direção",                   "email" => "direcao@ipleiria.pt",           "group_code" => "board"                   ],
            ["name" => "GOP",                       "email" => "gop@ipleiria.pt",               "group_code" => "gop"                     ],
            ["name" => "Docente",                   "email" => "docente@ipleiria.pt",           "group_code" => "teacher"                 ],
            ["name" => "Responsável CP",            "email" => "responsavel_cp@ipleiria.pt",    "group_code" => "responsible_pedagogic"   ],
            ["name" => "Responsável UC",            "email" => "responsavel_uc@ipleiria.pt",    "group_code" => "responsible_course_unit" ],
        ];

        foreach ($users as $user) {
            $newUser = new User();
            $newUser->name = $user['name'];
            $newUser->email = $user['email'];
            $newUser->password = bcrypt('password');
            $newUser->protected = true;
            $newUser->save();
            $newUser->groups()->attach(Group::where('code', $user['group_code'])->get());
            $newUser->save();
        }

        $schools = [
            ["code" => "ESAD.CR",   "name_pt" => "Escola Superior de Artes e Design - Caldas da Rainha",   "name_en" => "School of Arts and Design - Caldas da Rainha"  ],
            ["code" => "ESECS",     "name_pt" => "Escola Superior de Educação e Ciências Sociais",         "name_en" => "School of Education and Social Sciences"       ],
            ["code" => "ESSLEI",    "name_pt" => "Escola Superior de Saúde",                               "name_en" => "School of Health Sciences"                     ],
            [
                "code"                              => "ESTG",
                "name_pt"                           => "Escola Superior de Tecnologia e Gestão",
                "name_en"                           => "School of Technology and Management",
                "base_link"                         => "http://www.dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs.php",

                "index_course_code"                 => "3",//"0",
                "index_course_name_pt"              => "4",//"1",
                "index_course_name_en"              => "14",
                "index_course_initials"             => "11",

                "index_course_unit_code"            => "5",//"2",
                "index_course_unit_name_pt"         => "6",//"3",
                "index_course_unit_name_en"         => "13",
                "index_course_unit_initials"        => "12",

                "index_course_unit_teachers"        => "7",//"4",
                "index_course_unit_curricular_year" => "2",//"5",

                "index_course_unit_registered"      => "8",
                "index_course_unit_passed"          => "9",
                "index_course_unit_flunk"           => "10",

                "index_course_unit_branch"          => "15",

                "query_param_academic_year"         => "anoletivo",
                "query_param_semester"              => "periodo",
                "gop_group_id"                      => "12",
                "board_group_id"                    => "13",
                "pedagogic_group_id"                => "14",
            ],
            ["code" => "ESTM",  "name_pt" => "Escola Superior de Turismo e Tecnologia do Mar - Peniche",    "name_en" => "School of Tourism and Maritime Technology - Peniche" ],
        ];

        foreach ($schools as $school) {
            $newSchool = new School($school);
            $newSchool->save();
        }

        $interruptionTypes = [
            ["name_pt" => "Natal",               "name_en" => "Christmas",       "mandatory" => true  ],
            ["name_pt" => "Páscoa",              "name_en" => "Easter",          "mandatory" => true  ],
            ["name_pt" => "Desfile do caloiro",  "name_en" => "Freshman Parade", "mandatory" => false ],
            ["name_pt" => "Abertura solene",     "name_en" => "Solemn Opening",  "mandatory" => false ],
            ["name_pt" => "Desfile académico",   "name_en" => "Academic parade", "mandatory" => false ],
            ["name_pt" => "Feriado",             "name_en" => "Holiday",         "mandatory" => false ],
            ["name_pt" => "Semana académica",    "name_en" => "Academic week",   "mandatory" => false ],
            ["name_pt" => "Dia aberto",          "name_en" => "Open Day",        "mandatory" => false ],
            ["name_pt" => "Carnaval",            "name_en" => "Carnival",        "mandatory" => false ],
        ];

        foreach ($interruptionTypes as $interruptionType) {
            $newInterruptionType = new InterruptionType($interruptionType);
            //$newInterruptionType->name_pt = $interruptionType["name_pt"];
            //$newInterruptionType->name_en = $interruptionType["name_en"];
            $newInterruptionType->save();
        }

        $evaluationTypes = [
            ["code" => "written_exam",              "name_pt" => "Prova escrita",                    "name_en" => "Written test"                     ],
            ["code" => "oral_exam",                 "name_pt" => "Prova oral",                       "name_en" => "Oral test"                        ],
            ["code" => "practical_exam",            "name_pt" => "Teste prático",                    "name_en" => "Practical test"                   ],
            ["code" => "report",                    "name_pt" => "Relatório ou trabalho escrito",    "name_en" => "Report or written work"           ],
            ["code" => "public_oral_presentation",  "name_pt" => "Apresentação oral pública",        "name_en" => "Public oral presentation"         ],
            ["code" => "prototype",                 "name_pt" => "Protótipo",                        "name_en" => "Prototype"                        ],
            ["code" => "laboratory_work",           "name_pt" => "Trabalho laboratorial",            "name_en" => "Laboratory work"                  ],
            ["code" => "project",                   "name_pt" => "Projeto",                          "name_en" => "Project"                          ],
            ["code" => "internship",                "name_pt" => "Estágios ou projetos externos",    "name_en" => "Internships or external projects" ],
            ["code" => "portfolio",                 "name_pt" => "Portfólio",                        "name_en" => "Portfolio"                        ],
            ["code" => "statement_release",         "name_pt" => "Lançamento do enunciado",          "name_en" => "Statement release"                ],
        ];

        foreach ($evaluationTypes as $evaluationType) {
            $newEvaluationType = new EvaluationType($evaluationType);
            $newEvaluationType->save();
        }

        $phases = [
            ["code"=> "edit_gop",            "name_pt" => "Em edição (GOP)",                    "name_en" => "In edit (GOP)",                          "all_methods_filled" => false  ],
            ["code"=> "edit_cc",             "name_pt" => "Em edição (Coordenador de Curso)",   "name_en" => "In edit (Course coordinator)",           "all_methods_filled" => false  ],
            ["code"=> "edit_responsible",    "name_pt" => "Em edição (Responsável UC)",         "name_en" => "In edit (UC responsible)",               "all_methods_filled" => false  ],
            ["code"=> "evaluation_students", "name_pt" => "Em avaliação (Estudantes)",          "name_en" => "Under evaluation (Students)",            "all_methods_filled" => true   ],
            ["code"=> "evaluation_ccp",      "name_pt" => "Em avaliação (CCP)",                 "name_en" => "Under evaluation (CCP)",                 "all_methods_filled" => true   ],
            ["code"=> "evaluation_gop",      "name_pt" => "Em avaliação (GOP)",                 "name_en" => "Under evaluation (GOP)",                 "all_methods_filled" => true   ],
            ["code"=> "evaluation_cp",       "name_pt" => "Em avaliação (Conselho Pedagógico)", "name_en" => "Under evaluation (Pedagogical Council)", "all_methods_filled" => true   ],
            ["code"=> "evaluation_board",    "name_pt" => "Em avaliação (Direção)",             "name_en" => "Under evaluation (Direction)",           "all_methods_filled" => true   ],
            ["code"=> "published",           "name_pt" => "Publicado",                          "name_en" => "Published",                              "all_methods_filled" => true   ],
            ["code"=> "system",              "name_pt" => "System",                             "name_en" => "System",                                 "all_methods_filled" => false  ],
            // ["code"=> "approved",            "name_pt" => "Aprovado",                           "name_en" => "Approved",                               "all_methods_filled" => true   ],
        ];

        foreach ($phases as $phase) {
            $newPhase = new CalendarPhase();
            $newPhase->code = $phase["code"];
            $newPhase->name_pt = $phase["name_pt"];
            $newPhase->name_en = $phase["name_en"];
            $newPhase->removable = false;
            $newPhase->all_methods_filled = $phase["all_methods_filled"];
            $newPhase->save();
        }

        $categories = [
            ["code"=> "general",    "name_pt" => "Geral",       "name_en" => "General"  ],
            ["code"=> "calendar",   "name_pt" => "Calendário",  "name_en" => "Calendar" ],
        ];

        $categoryGeneral = new PermissionCategory($categories[0]);
        $categoryGeneral->save();
        $categoryCalendar = new PermissionCategory($categories[1]);
        $categoryCalendar->save();

        $permissionSections = [
            ["code" => "calendar",          "name_pt" => "Calendário",               "name_en" => "Calendar"            ],
            ["code" => "ucs",               "name_pt" => "UCs",                      "name_en" => "CUs"                 ],
            ["code" => "uc_grouping",       "name_pt" => "Agrupamentos de UCs",      "name_en" => "CUs Grouping"        ],
            ["code" => "users",             "name_pt" => "Utilizadores",             "name_en" => "Users"               ],
            ["code" => "user_groups",       "name_pt" => "Grupos de Utilizador",     "name_en" => "Users Groups"        ],
            ["code" => "courses",           "name_pt" => "Cursos",                   "name_en" => "Courses"             ],
            ["code" => "evaluation",        "name_pt" => "Tipos de Avaliações",      "name_en" => "Evaluation Types"    ],
            ["code" => "interruption",      "name_pt" => "Tipos de Interrupções",    "name_en" => "Interruption Types"  ],
            ["code" => "calendar_phases",   "name_pt" => "Fases do calendário",      "name_en" => "Calendar Phases"     ],
            ["code" => "schools",           "name_pt" => "Escolas",                  "name_en" => "schools"             ],
            ["code" => "academic_years",    "name_pt" => "Anos Letivos",             "name_en" => "Academic Years"      ],
            ["code" => "permissions",       "name_pt" => "Permissões",               "name_en" => "Permissions"         ],
        ];

        foreach ($permissionSections as $section) {
            $newSection = new PermissionSection();
            $newSection->code = $section["code"];
            $newSection->name_pt = $section["name_pt"];
            $newSection->name_en = $section["name_en"];
            $newSection->save();
        }

        $newPermissions = [
            ["code" => "create_calendar",                   "section_code" => "calendar",           "name_pt" => "Criar calendário",                                "name_en" => "Create calendar",                 "is_general" => true  ],
            ["code" => "delete_calendar",                   "section_code" => "calendar",           "name_pt" => "Eliminar calendário",                             "name_en" => "Delete calendar",                 "is_general" => true  ],
            ["code" => "view_calendar_info",                "section_code" => "calendar",           "name_pt" => "Ver informações do calendário",                   "name_en" => "View calendar information",       "is_general" => true  ],
            ["code" => "view_comments",                     "section_code" => "calendar",           "name_pt" => "Ver comentários",                                 "name_en" => "See comments",                    "is_general" => true  ],
            ["code" => "view_calendar_history",             "section_code" => "calendar",           "name_pt" => "Ver o histórico do calendário",                   "name_en" => "View calendar history",           "is_general" => true  ],
            ["code" => "view_actual_phase",                 "section_code" => "calendar",           "name_pt" => "Ver fase atual",                                  "name_en" => "See current phase",               "is_general" => true  ],

            ["code" => "publish_calendar",                  "section_code" => "calendar",           "name_pt" => "Publicar calendário",                             "name_en" => "Publish calendar",                "is_general" => true  ],
            ["code" => "create_copy",                       "section_code" => "calendar",           "name_pt" => "Criar cópia",                                     "name_en" => "Create copy",                     "is_general" => true  ],

            ["code" => "view_course_units",                 "section_code" => "ucs",                "name_pt" => "Ver UCs",                                         "name_en" => "See CUs",                         "is_general" => true  ],
            ["code" => "create_course_units",               "section_code" => "ucs",                "name_pt" => "Criar UCs",                                       "name_en" => "Create CUs",                      "is_general" => true  ],
            ["code" => "edit_course_units",                 "section_code" => "ucs",                "name_pt" => "Editar UCs",                                      "name_en" => "Edit CUs",                        "is_general" => true  ],
            ["code" => "delete_course_units",               "section_code" => "ucs",                "name_pt" => "Eliminar UCs",                                    "name_en" => "Delete CUs",                      "is_general" => true  ],
            ["code" => "manage_evaluation_methods",         "section_code" => "ucs",                "name_pt" => "Gerir métodos de Avaliação",                      "name_en" => "Manage evaluations Methods",      "is_general" => true  ],

            ["code" => "view_uc_groups",                    "section_code" => "uc_grouping",        "name_pt" => "Ver Agrupamentos de UCs",                         "name_en" => "See CUs Grouping",                "is_general" => true  ],
            ["code" => "create_uc_groups",                  "section_code" => "uc_grouping",        "name_pt" => "Criar Agrupamentos de UCs",                       "name_en" => "Create CUs Grouping",             "is_general" => true  ],
            ["code" => "edit_uc_groups",                    "section_code" => "uc_grouping",        "name_pt" => "Editar Agrupamentos de UCs",                      "name_en" => "Edit CUs Grouping",               "is_general" => true  ],
            ["code" => "delete_uc_groups",                  "section_code" => "uc_grouping",        "name_pt" => "Eliminar Agrupamentos de UCs",                    "name_en" => "Delete CUs Grouping",             "is_general" => true  ],

            ["code" => "edit_user_groups",                  "section_code" => "user_groups",        "name_pt" => "Editar Grupos de Utilizador",                     "name_en" => "Edit User Groups",                "is_general" => true  ],
            ["code" => "delete_user_groups",                "section_code" => "user_groups",        "name_pt" => "Eliminar Grupos de Utilizador",                   "name_en" => "Delete User Groups",              "is_general" => true  ],
            ["code" => "create_user_groups",                "section_code" => "user_groups",        "name_pt" => "Criar Grupos de Utilizador",                      "name_en" => "Create User Groups",              "is_general" => true  ],

            ["code" => "edit_users",                        "section_code" => "users",              "name_pt" => "Editar utilizadores",                             "name_en" => "Edit users",                      "is_general" => true  ],
            ["code" => "lock_users",                        "section_code" => "users",              "name_pt" => "Bloquear utilizadores",                           "name_en" => "Block users",                     "is_general" => true  ],

            ["code" => "create_evaluation_types",           "section_code" => "evaluation",         "name_pt" => "Criar tipos de avaliações",                       "name_en" => "Create types of evaluations",     "is_general" => true  ],
            ["code" => "edit_evaluation_types",             "section_code" => "evaluation",         "name_pt" => "Editar tipos de avaliações",                      "name_en" => "Edit types of evaluations",       "is_general" => true  ],
            ["code" => "delete_evaluation_types",           "section_code" => "evaluation",         "name_pt" => "Eliminar tipos de avaliações",                    "name_en" => "Delete types of evaluations",     "is_general" => true  ],

            ["code" => "create_interruption_types",         "section_code" => "interruption",       "name_pt" => "Criar tipos de interrupções",                     "name_en" => "Create types of interruptions",   "is_general" => true  ],
            ["code" => "edit_interruption_types",           "section_code" => "interruption",       "name_pt" => "Editar tipos de interrupções",                    "name_en" => "Edit types of interruptions",     "is_general" => true  ],
            ["code" => "delete_interruption_types",         "section_code" => "interruption",       "name_pt" => "Eliminar tipos de interrupções",                  "name_en" => "Delete types of interruptions",   "is_general" => true  ],

            ["code" => "create_calendar_phases",            "section_code" => "calendar_phases",    "name_pt" => "Criar fases de calendário",                       "name_en" => "Create calendar phases",          "is_general" => true  ],
            ["code" => "edit_calendar_phases",              "section_code" => "calendar_phases",    "name_pt" => "Editar fases de calendário",                      "name_en" => "Edit calendar phases",            "is_general" => true  ],
            ["code" => "delete_calendar_phases",            "section_code" => "calendar_phases",    "name_pt" => "Eliminar fases de calendário",                    "name_en" => "Delete calendar phases",          "is_general" => true  ],

            ["code" => "create_schools",                    "section_code" => "schools",            "name_pt" => "Criar escolas",                                   "name_en" => "Create schools",                  "is_general" => true  ],
            ["code" => "edit_schools",                      "section_code" => "schools",            "name_pt" => "Editar escolas",                                  "name_en" => "Edit schools",                    "is_general" => true  ],

            ["code" => "create_academic_years",             "section_code" => "academic_years",     "name_pt" => "Criar anos letivos",                              "name_en" => "Create academic years",           "is_general" => true  ],
            ["code" => "edit_academic_years",               "section_code" => "academic_years",     "name_pt" => "Editar anos letivos",                             "name_en" => "Edit academic years",             "is_general" => true  ],
            ["code" => "delete_academic_years",             "section_code" => "academic_years",     "name_pt" => "Eliminar anos letivos",                           "name_en" => "Delete academic years",           "is_general" => true  ],

            ["code" => "change_permissions",                "section_code" => "permissions",        "name_pt" => "Gerir permissões",                                "name_en" => "Manage permissions",              "is_general" => true  ],
            ["code" => "define_course_coordinator",         "section_code" => "permissions",        "name_pt" => "Definir Coordenador de Curso",                    "name_en" => "Define course coordinator",       "is_general" => true  ],
            ["code" => "define_course_unit_responsible",    "section_code" => "permissions",        "name_pt" => "Definir Responsável da Unidade Curricular",       "name_en" => "Define course unit responsible",  "is_general" => true  ],
            ["code" => "define_course_unit_teachers",       "section_code" => "permissions",        "name_pt" => "Definir Professores das Unidades Curriculares",   "name_en" => "Define course unit teachers",     "is_general" => true  ],

            ["code" => "view_courses",                      "section_code" => "courses",            "name_pt" => "Ver cursos",                                      "name_en" => "See courses",                     "is_general" => true  ],
            ["code" => "create_courses",                    "section_code" => "courses",            "name_pt" => "Criar cursos",                                    "name_en" => "Create courses",                  "is_general" => true  ],
            ["code" => "edit_courses",                      "section_code" => "courses",            "name_pt" => "Editar cursos",                                   "name_en" => "Edit courses",                    "is_general" => true  ],
            ["code" => "delete_courses",                    "section_code" => "courses",            "name_pt" => "Eliminar cursos",                                 "name_en" => "Delete courses",                  "is_general" => true  ],

            // for each phase
            ["code" => "view_calendar",                     "section_code" => "calendar",           "name_pt" => "Ver calendário",                                  "name_en" => "See calendar",                    "is_general" => false ],
            ["code" => "add_comments",                      "section_code" => "calendar",           "name_pt" => "Adicionar comentários",                           "name_en" => "Add comments",                    "is_general" => false ],
            ["code" => "ignore_comments",                   "section_code" => "calendar",           "name_pt" => "Ignorar comentários",                             "name_en" => "Ignore comments",                 "is_general" => false ],
            ["code" => "change_calendar_phase",             "section_code" => "calendar",           "name_pt" => "Mudar fase de calendário",                        "name_en" => "Change calendar phase",           "is_general" => false ],
            ["code" => "add_exams",                         "section_code" => "evaluation",         "name_pt" => "Adicionar avaliações",                            "name_en" => "Add exams",                       "is_general" => false ],
            ["code" => "edit_exams",                        "section_code" => "evaluation",         "name_pt" => "Editar avaliações",                               "name_en" => "Edit exams",                      "is_general" => false ],
            ["code" => "remove_exams",                      "section_code" => "evaluation",         "name_pt" => "Remover avaliações",                              "name_en" => "Remove exams",                    "is_general" => false ],
            ["code" => "add_interruption",                  "section_code" => "interruption",       "name_pt" => "Adicionar interrupções",                          "name_en" => "Add interruption",                "is_general" => false ],
            ["code" => "edit_interruption",                 "section_code" => "interruption",       "name_pt" => "Editar interrupções",                             "name_en" => "Edit interruptions",              "is_general" => false ],
            ["code" => "remove_interruption",               "section_code" => "interruption",       "name_pt" => "Remover interrupções",                            "name_en" => "Remove interruptions",            "is_general" => false ],
        ];

        $super_admin_id = Group::where('code', 'super_admin')->first()->id;
        $phase_system_id = CalendarPhase::where('code', 'system')->first()->id;

        foreach ($newPermissions as $newPerm) {
            $newPermission = new Permission();
            $newPermission->code = $newPerm["code"];
            $newPermission->name_pt = $newPerm["name_pt"];
            $newPermission->name_en = $newPerm["name_en"];
            $newPermission->category_id = $newPerm["is_general"] ? $categoryGeneral->id : $categoryCalendar->id;
            $newPermission->section_id = PermissionSection::where('code', $newPerm["section_code"])->first()->id;
            $newPermission->save();
        }

        $epochTypes = [
            ["name_pt" => "Época Periódica",        "name_en" => "Periodic Season",      "code" => "periodic_season"       ],
            ["name_pt" => "Época Normal",           "name_en" => "Normal Season",        "code" => "normal_season"         ],
            ["name_pt" => "Época Recurso",          "name_en" => "Resource Season",      "code" => "resource_season"       ],
            ["name_pt" => "Época Especial",         "name_en" => "Special Season",       "code" => "special_season"        ],
            ["name_pt" => "Época Especialíssima",   "name_en" => "Very Special Season",  "code" => "very_special_season"   ],
        ];
        foreach ($epochTypes as $epochType) {
            $newEpochType = new EpochType($epochType);
            $newEpochType->save();
        }

        $semesters = [
            ["code" => "first_semester",    "number" => 1, "name_pt" => "1º Semestre",     "name_en" => "1st Semester",  "special" => 0, "epoch_types" => [1, 2, 3]   ],
            ["code" => "second_semester",   "number" => 2, "name_pt" => "2º Semestre",     "name_en" => "2nd Semester",  "special" => 0, "epoch_types" => [1, 2, 3]   ],
            ["code" => "special",           "number" => 0, "name_pt" => "Especial",        "name_en" => "Special",       "special" => 1, "epoch_types" => [4]         ],
            ["code" => "very_special",      "number" => 0, "name_pt" => "Especialíssima",  "name_en" => "Very Special",  "special" => 1, "epoch_types" => [5]         ],
        ];

        foreach ($semesters as $semester) {
            $newSemester = new Semester();
            $newSemester->code    = $semester["code"];
            $newSemester->number  = $semester["number"];
            $newSemester->name_pt = $semester["name_pt"];
            $newSemester->name_en = $semester["name_en"];
            $newSemester->special = $semester["special"];
            $newSemester->save();

            $newSemester->epochTypes()->attach($semester["epoch_types"]);
        }
    }
}
