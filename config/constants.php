<?php

return [
    'app' => [
        'url'   => 'localhost',
        'lang'  => 'PT-PT'
    ],
    'api' => [
        'url' => 'localhost/api',
        'sapo_feriados_url' => 'http://services.sapo.pt/Holiday/GetNationalHolidays?year=',
        'sapo_holidays_endpoint' => 'http://services.sapo.pt/Holiday/GetNationalHolidays',
        'courses' => [
            'estg' => 'http://www.dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs.php'
        ]
    ],
    'calendario' => [
        'fases' => [
            'criado' => 1
        ]
    ],
    'semestres' => [
        'primeiro'  => 1,
        'segundo'   => 2,
        'especial'  => 3,
    ],
    // ID's da BD a configurar aquando do deploy
    'interrupcoes'  => [
        'natal'     => 1,
        'pascoa'    => 2,
        'feriado'   => 3,
    ],
    'paginacao' => [
        'calendarios'        => 20,
        'idiomas'            => 10,
        'tipos_avaliacoes'   => 10,
        'tipos_interrupcoes' => 10,
        'fases_calendario'   => 15,
        'grupos'             => 15,
        'utilizadores'       => 15,
    ],
    'entidades' => [
        'tipos_interrupcoes'    => 'tipos_interrupcoes',
        'tipos_avaliacoes'      => 'tipos_avaliacoes',
        'fases_calendario'      => 'fases_calendario',
    ]
];
