# WebService de importacao

## Formato CSV
### Cursos com cadeiras
    https://dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs.php?anoletivo=202122&periodo=S1
### Por curso
    http://dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs.php?anoletivo=202122&codcurso=9119
### Por UC
    http://dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs.php?anoletivo=202122&coduc=9119201

## Formato JSON
### Cursos com cadeiras
    http://dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs_json.php?anoletivo=202122&periodo=S2
### Por curso
    http://dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs_json.php?anoletivo=202122&codcurso=9119
### Por UC
    http://dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs_json.php?anoletivo=202122&coduc=9119201


# Public API 

Esta e uma API que ira divulgar os calendarios e exames que estejam publicos, podendo ser filtrados por varios campos


## Formato JSON
Resultados de calendarios
### Todos os calendarios de uma escola e de um ano letivo
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/calendars

### Todos os calendarios de uma escola, de um ano letivo e de um curso
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/calendars/course/{code}

Resultados de exames

### Todos os exames de uma escola e de um ano letivo
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/exams
    
### Todos os exames de uma escola, ano letivo e de um curso
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/exams/course/{code} 

### Todos os exames de uma escola, ano letivo e de uma cadeira
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/exams/unit/{code}
    
### Filtros:
#### - Por semestre
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/exams?semester=1

### Language
Para escolher entre a linguagem de "**PT**" ou "**EN**", basta enviar a opcao no header "**lang**" ou no url
> Default: "**PT**"
#### - Por Lingua
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/exams?lang=pt
    http://172.22.21.74/api/v1/{schoolCode}/{academicYearCode}/exams?lang=en


## Formatos de resposta
### Formato de Calendario
```
{
    "data": [
        {
            "course": {
                "code": "9119",
                "name": "(9119) Licenciatura em Engenharia Informática"
            },
            "date_start": "2008-09-20 00:00:00",
            "date_end": "2011-09-20 00:00:00",
            "date_week_ten":  "2011-09-20 00:00:00",
            "epochs": [
                {
                    "date_start": "2008-09-20 00:00:00",
                    "date_end": "2011-09-20 00:00:00",
                    "name": "Epoca normal",
                    "code": "epoch_normal",
                    "exams": [
                        {
                            "date_start": "2021-09-07",
                            "date_end": "2021-09-07",
                            "in_class": 1,
                            "hour": null,
                            "room": null,
                            "duration_minutes": null,
                            "observations": null,
                            "description": null
                            "method": {
                                "description": "Prova escrita 1",
                                "evaluation_type": "Prova escrita",
                                "minimum": 9.5,
                                "weight": 100
                            },
                            "course_unit": {
                                "code": "9119204",
                                "name": "Programação I ",
                                "initials": "Prog I",
                                "branch": {
                                    "name": "Tronco Comum",
                                    "initials": "TComum"
                                }
                            }
                        },
                    ]
                },
            ],
            "interruptions": [
                {
                    "name": "natal",
                    "date_start": "2008-09-20 00:00:00",
                    "date_end": "2011-09-20 00:00:00",
                }
            ],
            "semester": 1,
        },
    ]
}
```

### Formato de exame
```
{
    "data": [
        {
            "date_start": "2008-09-20 00:00:00",
            "date_end": "2011-09-20 00:00:00",
            "in_class": false,
            "room": "A2.1",
            "observations": "",
            "method": {
                "description": "Prova escrita 1",
                "evaluation_type": "Prova escrita",
                "minimum": 9.5,
                "weight": 100
            },
            "course_unit": {
                "code": "9119204",
                "name": "Programação I ",
                "initials": "Prog I",
                "semester": 1,
                "course": {
                    "code": "9119",
                    "name": "(9119) Licenciatura em Engenharia Informática"
                },
                "branch": {
                    "name": "Tronco Comum",
                    "initials": "TComum"
                }
            }
        },
    ]
}
```
