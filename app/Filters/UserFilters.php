<?php

namespace App\Filters;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use tiagomichaelsousa\LaravelFilters\QueryFilters;

class UserFilters extends QueryFilters
{

    public function search($search)
    {
        return $this->builder
            ->where('name', 'LIKE', "%$search%")
            ->orWhere('email', 'LIKE', "%$search%");
    }

    public function groups($groups)
    {
        $query = DB::table('group_user')->select('user_id')->whereIn('group_id', json_decode($groups));
        foreach (json_decode($groups) as $gp ) {
            $query->whereIn('user_id', DB::table('group_user')->select('user_id')->where('group_id', $gp));
        }

        return $this->builder->whereIn('id', $query);
    }
}
