import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {useSearchParams} from "react-router-dom";

const FilterOptionCourse = ({widthSize, eventHandler, school}) => {
    const [searchParams] = useSearchParams();
    const searchCourse = searchParams.get('curso');

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [course, setCourse] = useState();

    useEffect(() => {
        if(searchCourse){
            setCourse(searchCourse);
            sessionStorage.setItem('course', searchCourse);
        }
    }, [searchCourse]);

    useEffect(() => {
        loadCourses()
    }, [school]);

    const loadCourses = (search = '', includeCourse) => {
        setLoading(true);
        let link = '/courses-search';
        const params = new URLSearchParams();

        if (school) {
            params.append('school', school);
        }

        if (search) {
            params.append('search', search);
        }

        if (includeCourse) {
            params.append('include', includeCourse);
        }

        const queryString = params.toString();
        if (queryString) {
            link += `?${queryString}`;
        }


        axios.get(link).then((res) => {
            if (res.status === 200) {
                res.data.data.unshift({value: '', text: t("Todos os Cursos")});
                setCoursesOptions(res.data.data);
                setLoading(false);
                if(searchCourse && search === ""){
                    let selected = res.data.data.find((item) => item.value == searchCourse);
                    setCourse(selected.value);
                }
                if(!course){
                    const sessionCourse = parseInt(sessionStorage.getItem('course')) || -1;
                    if(sessionCourse !== -1){
                        console.log(sessionCourse)
                        setCourse(sessionCourse);
                    }
                }
            }
        });
    };

    useEffect(() => {
        loadCourses('', searchCourse);
    }, []);

    const handleSearchCourses = (evt, {searchQuery}) => {
        loadCourses(searchQuery, searchCourse);
    };

    const filterByCourse = (e, {value}) => {
        setCourse(value);
        sessionStorage.setItem('course', value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} search clearable selection value={course} defaultValue={(searchCourse ? searchCourse : undefined)} options={coursesOptions} label={t("Curso")} placeholder={t("Pesquisar o curso...")} loading={loading}
                       onSearchChange={_.debounce(handleSearchCourses, 400)}
                       onChange={filterByCourse}/>
    );
};

export default FilterOptionCourse;
