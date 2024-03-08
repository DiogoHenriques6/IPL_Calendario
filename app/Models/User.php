<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use LdapRecord\Laravel\Auth\AuthenticatesWithLdap;
use LdapRecord\Laravel\Auth\HasLdapUser;
use LdapRecord\Laravel\Auth\LdapAuthenticatable;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;
use tiagomichaelsousa\LaravelFilters\Traits\Filterable;
use Znck\Eloquent\Traits\BelongsToThrough;

class PermissionTypes
{
    const CALENDAR_PHASE = "calendar_phase";
    const CALENDAR_EVALUATION = "calendar_evaluation";
    const CALENDAR = "calendar";
    const PERMISSIONS = "permissions";
}

class User extends Authenticatable implements LdapAuthenticatable
{
    use HasRelationships;
    use SoftDeletes, Filterable;
    use HasApiTokens, Notifiable, AuthenticatesWithLdap, HasLdapUser;
    use BelongsToThrough;

    const PERMISSION_TYPES = [
        PermissionTypes::CALENDAR_PHASE,
        PermissionTypes::CALENDAR_EVALUATION,
        PermissionTypes::CALENDAR,
        PermissionTypes::PERMISSIONS
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'fillable',
        'enabled'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getLdapDomainColumn()
    {
        return 'domain';
    }

    public function getLdapGuidColumn()
    {
        return 'guid';
    }

    public function gopSchools() {
        return $this->hasManyDeepFromRelations($this->groups(), (new Group)->gopSchool());
    }
    public function boardSchools() {
        return $this->hasManyDeepFromRelations($this->groups(), (new Group)->boardSchool());
    }
    public function pedagogicSchools() {
        return $this->hasManyDeepFromRelations($this->groups(), (new Group)->pedagogicSchool());
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    public function courseUnits()
    {
        return $this->belongsToMany(CourseUnit::class);
    }

    public function permissions()
    {
        return $this->hasManyDeepFromRelations($this->groups(), (new Group)->permissions());
    }

    public function calendars()
    {
        return $this->hasManyDeepFromRelations($this->courses(), (new Course)->calendars());
    }

    public function games()
    {
        return $this->belongsToMany(Games::class);
    }

    public function scopeWithPermissionAndAction($query, $permissionType, $actionType)
    {
        return $this->permissions()
            ->where('permission_id', Permission::where('name', $permissionType)->first()->id);
    }

    public function scopeWithPermissionAndActionInPhase($query, $permissionType, $actionType, $phase)
    {
        $this->permissions()
            ->where('permission_id', Permission::where('name', $permissionType)->first()->id)
            ->where('phase_id', $phase->id);
    }
}
