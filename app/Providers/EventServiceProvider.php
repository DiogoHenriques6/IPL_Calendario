<?php

namespace App\Providers;

use App\Events\AcademicYearRegistered;
use App\Events\CalendarChanged;
use App\Events\CalendarDeleted;
use App\Events\CalendarPublished;
use App\Listeners\CalculateDifferencesFromLastCalendar;
use App\Listeners\ImportCourses;
use App\Listeners\LogCalendarChange;
use App\Listeners\SoftDeleteRelatedModels;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        CalendarChanged::class => [
            LogCalendarChange::class,
        ],
        CalendarDeleted::class => [
            SoftDeleteRelatedModels::class,
        ],
        AcademicYearRegistered::class => [
            ImportCourses::class,
        ],
        CalendarPublished::class => [
            CalculateDifferencesFromLastCalendar::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
