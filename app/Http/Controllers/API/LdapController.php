<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use LdapRecord\Connection;

class LdapController extends Controller
{
    protected $connection;

    public function __construct()
    {
        $this->connection = new Connection([
            'hosts'    => [env('LDAP_HOST')],
            'username' => env('LDAP_USERNAME'),
            'password' => env('LDAP_PASSWORD'),
            'version' => 3
         ]);
    }

    public function searchStudents(Request $request) {
        return $this->getLocalUsers('OU=Estudantes,dc=ipleiria,dc=pt', $request->q, true);
    }

    public function searchUsers(Request $request) {
        return $this->getLocalUsers('OU=Docentes,OU=Funcionarios,dc=ipleiria,dc=pt', $request->q);
    }

    // Get necessary search results
    private function getLocalUsers($querySearchLDAP, $search, $isStudent = false){
        $results = [];
        if(env('APP_SERVER') && $search) {
            $query = $this->connection->query()->setDn($querySearchLDAP);
            $query->whereContains('displayName', $search);
            if($isStudent){
                $query->orWhereContains('mail', $search);
            }
            $records = $query->orWhereContains('cn', $search)->get();

            foreach ($records as $foundObj) {
                if (isset($foundObj['mail'])) {
                    $results[] = ["value" => $foundObj['mail'][0], "text" => $foundObj["cn"][0] ." - (" . $foundObj['mail'][0] . ")" ];
                }
            }
       }

        $usersFound = User::where('name', 'like', "%$search%")->orWhere('email', 'like', "%$search%")->limit(30)->get();
        foreach ($usersFound as $user) {
            if (array_search($user->email, array_column($results, 'mail')) === false) {
                $results[] = ["value" => $user->email, "text" => $user->name . " - (" . $user->email . ")"];
            }
        }
        // sort array by email
        $values = array_column($results, 'value');
        array_multisort($values, SORT_ASC, $results);
        return response()->json($results);
    }

    public function getUserInfoByEmail($userEmail, $isStudent = false){
        $results = [];
        $link = ($isStudent ? 'OU=Estudantes,dc=ipleiria,dc=pt' : 'OU=Docentes,OU=Funcionarios,dc=ipleiria,dc=pt');
        if(env('APP_SERVER')) {
            $query = $this->connection->query()->setDn($link);
            $records = $query->whereContains('mail', $userEmail)->get();

            foreach ($records as $foundObj) {
                if (isset($foundObj['mail'])) {
                    $results = ["value" => $foundObj['mail'][0], "text" => $foundObj["cn"][0] ." - (" . $foundObj['mail'][0] . ")" ];
                }
            }
        }
        return $results;
    }
}
