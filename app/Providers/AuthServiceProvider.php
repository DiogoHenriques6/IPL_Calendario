<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

use App\Models\Calendar;
use App\Policies\CalendarPolicy;
use Laravel\Passport\Passport;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App' => 'App\Policies\ModelPolicy',
        Calendar::class => CalendarPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Passport::tokensExpireIn(Carbon::now()->addDays(5));
        Passport::tokensCan([
            'create_calendar'                   => '',
            'delete_calendar'                   => '',
            'view_calendar_info'                => '',
            'view_comments'                     => '',
            'view_calendar_history'             => '',
            'view_actual_phase'                 => '',
            'publish_calendar'                  => '',
            'create_copy'                       => '',
            'view_course_units'                 => '',
            'create_course_units'               => '',
            'edit_course_units'                 => '',
            'delete_course_units'               => '',
            'manage_evaluation_methods'         => '',
            'view_uc_groups'                    => '',
            'create_uc_groups'                  => '',
            'edit_uc_groups'                    => '',
            'delete_uc_groups'                  => '',
            'edit_user_groups'                  => '',
            'delete_user_groups'                => '',
            'create_user_groups'                => '',
            'edit_users'                        => '',
            'lock_users'                        => '',
            'create_evaluation_types'           => '',
            'edit_evaluation_types'             => '',
            'delete_evaluation_types'           => '',
            'create_interruption_types'         => '',
            'edit_interruption_types'           => '',
            'delete_interruption_types'         => '',
            'create_calendar_phases'            => '',
            'edit_calendar_phases'              => '',
            'delete_calendar_phases'            => '',
            'create_schools'                    => '',
            'edit_schools'                      => '',
            'create_academic_years'             => '',
            'edit_academic_years'               => '',
            'delete_academic_years'             => '',
            'change_permissions'                => '',
            'define_course_coordinator'         => '',
            'define_course_unit_responsible'    => '',
            'define_course_unit_teachers'       => '',
            'view_courses'                      => '',
            'create_courses'                    => '',
            'edit_courses'                      => '',
            'delete_courses'                    => '',
            'view_calendar'                     => '',
            'add_comments'                      => '',
            'ignore_comments'                   => '',
            'change_calendar_phase'             => '',
            'add_exams'                         => '',
            'edit_exams'                        => '',
            'remove_exams'                      => '',
            'add_interruption'                  => '',
            'edit_interruption'                 => '',
            'remove_interruption'               => ''
        ]);

        Passport::routes();
    }
}





















































