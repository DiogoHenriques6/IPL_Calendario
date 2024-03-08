<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\Admin\Edit\GroupEditResource;
use App\Http\Resources\Admin\PermissionSectionsByPhaseResource;
use App\Http\Resources\Admin\PermissionSectionsResource;
use App\Models\CalendarPhase;
use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Http\Requests\GroupRequest;
use App\Http\Resources\GroupsResource;
use App\Models\Permission;
use App\Models\PermissionSection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    public function index()
    {
        return GroupsResource::collection(Group::orderBy('code')->get());
    }

    public function store(GroupRequest $request)
    {
        $newGroup = new Group($request->all());
        $newGroup->save();

        return response()->json("Created!", Response::HTTP_CREATED);
    }

    public function show(Group $group)
    {
        return new GroupEditResource($group);
    }

    public function update(GroupRequest $request, Group $group)
    {
        $group->fill($request->all());
        $group->save();
    }

    public function destroy(Group $group)
    {
        $group->delete();
    }

    public function groupPermissions(Group $group) {
        return $this->getPermissions( 1, $group->id, CalendarPhase::phaseSystem());
    }

    public function groupCalendarPermissions(Group $group){
        $phases = CalendarPhase::all();
        foreach ($phases as $key_phase => $phase){
            $phases[$key_phase]["sections"] = $this->getPermissions( 2, $group->id, $phase->id);
        }
        return PermissionSectionsByPhaseResource::collection($phases);
    }

    private function getPermissions( $categoryId, $groupId, $phaseId) {
        $sections = PermissionSection::whereHas('permissions', function ($query) use ($categoryId) {
            $query->where('category_id', $categoryId);
        })->orderBy('code')->get();

        foreach ($sections as $section) {
            $permList= Permission::selectRaw('permissions.*, group_permissions.enabled as hasPermission')
                ->leftJoin('group_permissions', function ($join) use ($groupId, $phaseId) {
                    $join->on('group_permissions.permission_id', '=', 'permissions.id');
                    $join->on('group_permissions.group_id', '=', DB::raw($groupId));
                    $join->on('group_permissions.phase_id', '=', DB::raw($phaseId));
                })->where([
                    'section_id' => $section['id'],
                    'category_id' => $categoryId
                ])->get();

            $section['perm'] = $permList;
        }
        return PermissionSectionsResource::collection($sections);
    }

    public function cloneGroup(Group $group)
    {
        $newGroup = $group->cloneGroupWithPermissions();
        return response()->json(["id" => $newGroup->id], Response::HTTP_CREATED);
    }


}
