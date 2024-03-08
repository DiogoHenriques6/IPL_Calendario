<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionCategory extends Model
{
    protected $fillable = ["code", "name_pt", "name_en"];

    /**
     * Get the Permissions for the Category.
     */
    public function permissions()
    {
        return $this->hasMany(Permission::class, 'category_id');
    }

    /*
     * "Hardcoded" permission Categories
     * easier to maintain and change
     */
    public static function categoryGeneral()
    {
        return PermissionCategory::where('code', 'general')->first()->id;
    }

    public static function categoryCalendar()
    {
        return PermissionCategory::where('code', 'calendar')->first()->id;
    }
}
