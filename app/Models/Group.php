<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// TODO validate this to be dynamic with the groups table and have in account the multi school (eg: "gop_estg")
class InitialGroups
{
    const SUPER_ADMIN = "super_admin";
    const ADMIN = "admin";
    const COMISSION_CCP = "comission";
    const PEDAGOGIC = "pedagogic";
    const COORDINATOR = "coordinator";
    const BOARD = "board";
    const GOP = "gop";
    const TEACHER = "teacher";
    const RESPONSIBLE_PEDAGOGIC = "responsible_pedagogic";
    const RESPONSIBLE = "responsible_course_unit";
    const STUDENT = "student";
}

class Group extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ["code", "name_pt", "name_en", "enabled"];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function gopSchool() {
        return $this->belongsTo(School::class, 'id', 'gop_group_id');
    }
    public function boardSchool() {
        return $this->belongsTo(School::class, 'id', 'board_group_id');
    }
    public function pedagogicSchool() {
        return $this->belongsTo(School::class, 'id', 'pedagogic_group_id');
    }

    public function permissions()
    {
        return $this->belongsToMany( Permission::class, 'group_permissions')->withPivot(['phase_id', 'enabled']);
    }

    public function permissionsCalendar()
    {
        $categoryId = PermissionCategory::categoryCalendar();
        return $this->permissions()->where('category_id', $categoryId);
    }

    public function associatedPermissions()
    {
        return $this->hasMany(GroupPermission::class);
    }


    public function viewers()
    {
        return $this->hasMany(CalendarViewers::class);
    }

    public function scopeCoordinator($query)
    {
        return $query->where('code', 'like', InitialGroups::COORDINATOR . "%");
    }

    public function scopeBoard($query)
    {
        return $query->where('code', 'like', InitialGroups::BOARD . "%");
    }

    public function scopeSuperAdmin($query)
    {
        return $query->where('code', InitialGroups::SUPER_ADMIN);
    }

    public function scopeAdmin($query)
    {
        return $query->where('code', InitialGroups::ADMIN);
    }

    public function scopePedagogic($query)
    {
        return $query->where('code', 'like', InitialGroups::PEDAGOGIC . "%");
    }

    public function scopeResponsiblePedagogic($query)
    {
        return $query->where('code', InitialGroups::RESPONSIBLE_PEDAGOGIC);
    }

    public function scopeGop($query)
    {
        return $query->where('code', 'like', InitialGroups::GOP . "%");
    }

    public function scopeResponsible($query) {
        return $query->where('code', 'like', InitialGroups::RESPONSIBLE . "%");
    }

    public function scopeIsTeacher($query) {
        return $query->where('code', 'like', InitialGroups::TEACHER . "%");
    }

    public function scopeIsStudent($query) {
        return $query->where('code', InitialGroups::STUDENT);
    }

    /*
     * Clone Group with permissions
     * */
    public function cloneGroupWithPermissions()
    {
        $clone = $this->replicate();
        $clone->code = $this->code . '_copy';
        $clone->name_pt = 'Cópia de ' . $this->name_pt;
        $clone->name_en = 'Copy of ' . $this->name_en;
        $clone->removable = true;
        $clone->push();
        foreach($this->associatedPermissions as $permission)
        {
            $clone->associatedPermissions()->create($permission->toArray());
        }
        $clone->save();
        return $clone;
    }
}
