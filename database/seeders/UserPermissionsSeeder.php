<?php

namespace Database\Seeders;

use App\Models\CalendarPhase;
use App\Models\Group;
use App\Models\GroupPermission;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $superAdminGroup = Group::where('code', 'super_admin')->first()->id;
        $systemPhaseId = CalendarPhase::where('code', 'system')->first()->id;
        $permissions = Permission::orderBy('id', 'asc')->get();

        foreach ($permissions as $perm) {
            if($perm->id < 45) {
                $newGroupPerm = new GroupPermission();
                $newGroupPerm->group_id = $superAdminGroup;
                $newGroupPerm->permission_id = $perm['id'];
                $newGroupPerm->enabled = true;
                $newGroupPerm->phase_id = $systemPhaseId;
                $newGroupPerm->save();
            } else {
                for($i = 1; $i<11; $i++) {
                    $newGroupPerm = new GroupPermission();
                    $newGroupPerm->group_id = $superAdminGroup;
                    $newGroupPerm->permission_id = $perm['id'];
                    $newGroupPerm->enabled = true;
                    $newGroupPerm->phase_id = $i;
                    $newGroupPerm->save();
                }
            }
        }

        $adminGroup = Group::where('code', 'admin')->first()->id;

        foreach ($permissions as $perm) {
            if($perm['id'] < 45) {
                $newGroupPerm = new GroupPermission();
                $newGroupPerm->group_id = $adminGroup;
                $newGroupPerm->permission_id = $perm['id'];
                $newGroupPerm->enabled = true;
                $newGroupPerm->phase_id = $systemPhaseId;
                $newGroupPerm->save();
            } else {
                for($i = 1; $i<11; $i++) {
                    $newGroupPerm = new GroupPermission();
                    $newGroupPerm->group_id = $adminGroup;
                    $newGroupPerm->permission_id = $perm['id'];
                    $newGroupPerm->enabled = true;
                    $newGroupPerm->phase_id = $i;
                    $newGroupPerm->save();
                }
            }
        }

//        $gopGroup = Group::where('code', 'gop')->first()->id;
//
//        foreach ($permissions as $perm) {
//            $newGroupPerm = new GroupPermission();
//            $newGroupPerm->group_id = $gopGroup;
//            $newGroupPerm->permission_id = $perm['id'];
//            $newGroupPerm->enabled = true;
//            if($perm['id'] < 45) {
//                $newGroupPerm->phase_id = 10;
//                $newGroupPerm->save();
//            }
//        }
//
//        $gopGroup = Group::where('code', 'coordinator')->first()->id;
//
//        foreach ($permissions as $perm) {
//            $newGroupPerm = new GroupPermission();
//            $newGroupPerm->group_id = $gopGroup;
//            $newGroupPerm->permission_id = $perm['id'];
//            $newGroupPerm->enabled = true;
//            if($perm['id'] < 45) {
//                $newGroupPerm->phase_id = 10;
//                $newGroupPerm->save();
//            }
//        }


        /* TODO: Este seeder tem de ser refeito porque as permissões já não batem certo. Não pode usar os IDs */

        DB::table('group_permissions')->insertOrIgnore([
            [ "group_id" => 3,  "permission_id" => 9,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 14,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 41,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 45,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 45,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 45,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 45,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 45,      "phase_id" => 8,    "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 45,      "phase_id" => 9,    "enabled" => 1 ],
            [ "group_id" => 3,  "permission_id" => 47,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 3,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 4,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 5,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 6,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 7,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 8,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 9,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 11,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 13,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 14,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 15,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 16,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 17,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 39,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 40,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 41,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 43,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 8,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 45,      "phase_id" => 9,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 46,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 46,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 46,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 46,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 47,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 47,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 47,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 47,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 47,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 48,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 48,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 48,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 48,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 48,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 49,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 49,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 50,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 50,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 51,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 51,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 52,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 52,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 53,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 53,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 54,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 6,  "permission_id" => 54,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 1,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 2,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 3,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 4,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 5,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 6,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 7,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 8,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 9,       "phase_id" =>  10,  "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 10,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 11,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 12,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 13,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 14,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 15,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 16,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 17,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 18,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 19,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 20,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 21,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 22,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 23,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 24,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 25,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 26,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 27,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 28,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 34,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 35,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 36,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 37,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 38,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 39,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 40,      "phase_id" => 8,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 8,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 9,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 41,      "phase_id" => 10,   "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 42,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 42,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 42,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 42,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 42,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 43,      "phase_id" => 9,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 44,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 44,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 44,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 44,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 44,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 4,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 5,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 7,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 8,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 45,      "phase_id" => 9,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 46,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 46,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 46,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 46,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 47,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 47,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 47,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 47,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 48,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 48,      "phase_id" => 6,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 49,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 50,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 51,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 52,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 52,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 52,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 53,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 53,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 53,      "phase_id" => 3,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 54,      "phase_id" => 1,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 54,      "phase_id" => 2,    "enabled" => 1 ],
            [ "group_id" => 8,  "permission_id" => 54,      "phase_id" => 3,    "enabled" => 1 ],
        ]);
    }
}
