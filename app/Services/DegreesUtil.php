<?php
/**
 * Created by PhpStorm.
 * Project: calendar-v2
 * User: Miguel Cerejo
 * Date: 4/10/2022
 * Time: 1:56 AM
 *
 * File: Utils.php
 */

namespace App\Services;

class DegreesUtil
{

    public static function getDegreesList($lang)
    {
        $list = [
            [ "value" => 5, "text" => "TeSP"],
            [ "value" => 6, "text" => ($lang == "pt" ? "Licenciatura" : "Undergraduate")],
            [ "value" => 7, "text" => ($lang == "pt" ? "Mestrado" : "Master")],
            [ "value" => 8, "text" => ($lang == "pt" ? "Doutoramento" : "PhD")],
        ];
        return $list;
    }

    public static function getDegreeLabel($id)
    {
        switch ($id) {
            case 5:
                return "TeSP";
            case 6:
                return "Licenciatura";
            case 7:
                return "Mestrado";
            case 8:
                return "Doutoramento";
        }
        return null;
    }

    public static function getDegreeId($name)
    {
        switch ($name) {
            case str_contains($name, "Curso Técnico Superior Profissional"):
            case str_contains($name, "Professional Higher Tecnhical Courses"):
                return 5;//"TeSP";
            case str_contains($name, "Licenciatura"):
            case str_contains($name, "Undergraduate"):
                return 6;//"Licenciatura";
            case str_contains($name, "Mestrado"):
            case str_contains($name, "Master"):
                return 7;//"Mestrado";
            case str_contains($name, "Doutoramento"):
                return 8;//"Doutoramento";
        }
        return 0;
    }
}
