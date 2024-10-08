<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\SelectedGroupSwitchRequest;
use App\Http\Resources\Admin\Edit\GroupEditResource;
use App\Http\Resources\Admin\PermissionSectionsByPhaseResource;
use App\Http\Resources\Admin\PermissionSectionsResource;
use App\Http\Resources\MyGroupsResource;
use App\Models\CalendarPhase;
use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Http\Requests\GroupRequest;
use App\Http\Resources\GroupsResource;
use App\Models\InitialGroups;
use App\Models\Permission;
use App\Models\PermissionSection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use function Laravel\Prompts\select;

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

    public function clonePermissions(Group $group, Request $request)
    {
        //TODO: Implement clonePermissions method
        if($request->group_id  != null){
            $groupToClone = Group::find($request->group_id);
            //get group permissions
            $permissions = $groupToClone->associatedPermissions;
            $permissionsId = $permissions->pluck('permission_id');
            //get permissions to insert
            $permissionsToInsert = $permissionsId->diff($group->permissions()->pluck('id'));
            Log::channel('sync_test')->info('Permissions to insert: '.json_encode($permissionsToInsert));

            //get permissions to remove
            $permissionsToRemove = $group->permissions()->whereNotIn('id', $permissionsId)->pluck('id');
            Log::channel('sync_test')->info('Permissions to remove: '.json_encode($permissionsToRemove));

            $group->associatedPermissions()->whereIn('permission_id', $permissionsToRemove)->delete();
            foreach($groupToClone->associatedPermissions as $permission)
            {

                if($permissionsToInsert->contains($permission->permission_id)){
                    $group->associatedPermissions()->create($permission->toArray());
                }
            }

//            return $this->getPermissions( 1, $group->id, CalendarPhase::phaseSystem());
            return response()->json($group, Response::HTTP_OK);
        }
        else{
            return response()->json("Group not found!", Response::HTTP_NOT_FOUND);
        }
    }

    public function cloneGroup(Group $group)
    {
        $newGroup = $group->cloneGroupWithPermissions();
        return response()->json(["id" => $newGroup->id], Response::HTTP_CREATED);
    }

    public function getUserGroup()
    {
        if(!request()->cookie('selectedGroup')){
            $selectedGroup = Auth::user()->groups()->first();
            if($selectedGroup->code == InitialGroups::STUDENT){
                return (new MyGroupsResource($selectedGroup))->withCookie('selectedGroup', $selectedGroup->id);
            }
            $response = MyGroupsResource::collection(Auth::user()->groups);
            return response($response)->withCookie('selectedGroup', $selectedGroup->id);
        }
        else{
            $selectedGroup = Group::where('id', request()->cookie('selectedGroup'))->first();
            if($selectedGroup->code == InitialGroups::STUDENT){
                return new MyGroupsResource($selectedGroup);
            }
            return MyGroupsResource::collection(Auth::user()->groups);
        }
    }

    public function switch(SelectedGroupSwitchRequest $request)
    {
        $group = Group::find($request->switch);
        $permissions = $group->permissions()->where('group_permissions.enabled', true)
            ->groupBy('permissions.code')->pluck('permissions.code')
            ->values()->toArray();
        return response()->json($permissions)->withCookie('selectedGroup', $request->switch);
    }
}
