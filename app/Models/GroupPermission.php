<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupPermission extends Model
{
    use HasFactory;

    protected $fillable = ["group_id", "permission_id", "phase_id", "enabled"];

    protected $table = "group_permissions";

    public function permission()
    {
        return $this->hasOne(Permission::class, 'id', "permission_id");
    }

    public function phase()
    {
        return $this->hasOne(CalendarPhase::class);
    }

    public function group()
    {
        return $this->hasOne(Group::class);
    }

    public function groupPermissions()
    {
        return $this->belongsTo(Group::class);
    }
}
