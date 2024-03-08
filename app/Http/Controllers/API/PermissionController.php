<?php

namespace App\Http\Controllers\API;

use App\Models\CalendarPhase;
use App\Models\Group;
use App\Models\GroupPermission;
use App\Models\Permission;
use App\Models\PermissionCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionRequest;
use App\Http\Resources\CalendarPermissionsResource;
use App\Http\Resources\GroupsPermissionsResource;
use App\Http\Resources\GroupsResource;
use App\Http\Resources\PermissionsResource;
use App\Http\Resources\PhaseResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PermissionController extends Controller
{
    public function index()
    {
        return Auth::user()
            ->permissions()
            ->where('group_permissions.enabled', true)
            ->groupBy('permissions.code')->pluck('permissions.code')->values()->toArray();
    }

    public function calendar()
    {
        $calendarPhaseId = CalendarPhase::phaseSystem();
        $userGroupsId = Auth::user()->groups->pluck('id');

        $permissions = Permission::select("code")->addSelect([
            'phases' => GroupPermission::select(DB::raw('group_concat(phase_id)'))->where('phase_id', '!=', $calendarPhaseId)
                        ->whereColumn('permission_id', 'permissions.id')
                        ->where('group_permissions.enabled', true)
                        ->whereIn('group_id', $userGroupsId)
                        //->pluck('phases')
            ])->leftJoin('group_permissions', 'permissions.id', '=', 'group_permissions.permission_id')
                ->where("category_id", 2)
                ->where("enabled", true)
                ->whereIn('group_permissions.group_id', $userGroupsId)
                ->groupBy('code', 'phases')
                ->get();

        return CalendarPermissionsResource::collection($permissions);
    }

    public function store(PermissionRequest $request)
    {
        $isAlreadyRegistered = GroupPermission::where([
            'group_id' => $request['group_id'],
            'permission_id' => $request['permission_id']
        ]);

        if ($request['phase_id']) {
            $isAlreadyRegistered->where('phase_id', '=', $request['phase_id']);
        }

        if ($isAlreadyRegistered->count() > 0) {
            $isAlreadyRegistered->update(['enabled' => $request['enabled']]);
        } else {
            $permission = Permission::find($request['permission_id']);
            $permission->group()->attach(
                [
                    $request['group_id']
                ],
                [
                    'phase_id' => $request['phase_id'] ?? CalendarPhase::phaseSystem(),
                    'enabled' => $request['enabled'],
                ]
            );
        }

        return response()->json("Created/Updated", 200);
    }

    public function list($type)
    {
        Validator::make(['type' => $type], [
            'type' => 'string|in:general,calendar',
        ])->validate();

        $operator = '!=';
        $phases = null;
        $isCalendarPermissions = $type === 'calendar';
        if ($isCalendarPermissions) {
            $operator = '=';
            $phases = CalendarPhase::whereNotIn('code', [CalendarPhase::phaseSystem(), CalendarPhase::phasePublished()])->get();
        }

        $category = PermissionCategory::where('code', '=', 'calendar')->first('id');
        $permissions = Permission::where('category_id', $operator, $category->id)->get();

        return response()->json([
            'permissions' => PermissionsResource::collection($permissions),
            'groups' => GroupsResource::collection(Group::with(['permissions' => function ($q) use($operator, $category) {
                $q->where('permissions.category_id', $operator, $category->id);
                $q->where('group_permissions.enabled', true);
            }])->where('enabled', true)->get()),
            'phases' => $isCalendarPermissions ? PhaseResource::collection($phases) : null,
        ]);
    }

    public function listGroupPermissions($type, $phaseId = null)
    {
        Validator::make(['type' => $type], [
            'type' => 'string|in:general,calendar',
            'phaseId' => 'integer|sometimes|exists:calendar_phases,id'
        ])->validate();

        $operator = '!=';
        $isCalendarPermissions = $type === 'calendar';
        if ($isCalendarPermissions) {
            $operator = '=';
        }

        $category = PermissionCategory::where('code', '=', 'calendar')->first('id');

        $groupsPermissions = GroupPermission::whereHas('permission', function ($query) use ($operator, $category) {
            $query->where('category_id', $operator, $category->id);
        })->where('enabled', '=', true);

        if ($phaseId) {
            $groupsPermissions->where('phase_id', '=', $phaseId);
        }

        return GroupsPermissionsResource::collection($groupsPermissions->get());
    }


    public function show($id)
    {
        //
    }
    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
