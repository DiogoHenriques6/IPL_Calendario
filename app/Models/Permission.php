<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = ["code", "section_id", "name_pt", "name_en"];

    public $timestamps = false;

    /**
     * Get the Category associated with the Permission.
     */
    public function category()
    {
        return $this->belongsTo(PermissionCategory::class);
    }

    public function section()
    {
        return $this->belongsTo(PermissionSection::class);
    }

    public function group()
    {
        return $this->belongsToMany(Group::class, 'group_permissions');
    }

    public function phase()
    {
        return $this->belongsToMany(CalendarPhase::class, 'group_permissions','phase_id', 'phase_id');
    }

    /*
     * "Hardcoded" permission for "view_calendar"
     * easier to maintain and change
     */
    public static function permissionViewCalendar()
    {
        return Permission::where('code', 'view_calendar')->first()->id;
    }
}
