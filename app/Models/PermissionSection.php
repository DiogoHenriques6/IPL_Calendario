<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionSection extends Model
{
    protected $fillable = ["code", "name_pt", "name_en"];

    /**
     * Get the Permissions for the Category.
     */
    public function permissions()
    {
        return $this->hasMany(Permission::class, 'section_id');
    }

    public function permissionsGeneral()
    {
        return $this->hasMany(Permission::class, 'section_id');
        //$query->where('category_id', '1');
    }
    public function permissionsCalendar()
    {
        return $this->hasMany(Permission::class, 'section_id');
        //$query->where('category_id', '2');
    }

}
