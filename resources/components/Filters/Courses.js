import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {useSearchParams} from "react-router-dom";

const FilterOptionCourse = ({widthSize, eventHandler}) => {
    const [searchParams] = useSearchParams();
    const searchCourse = searchParams.get('curso');

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [course, setCourse] = useState();

    useEffect(() => {
        if(searchCourse){
            setCourse(searchCourse);
        }
    }, [searchCourse]);

    const loadCourses = (search = '', includeCourse) => {
        setLoading(true);
        let link = '/courses-search';
        link += (search ? '?search=' + search : '');
        link += (includeCourse ? (search ? '&' : '?') + 'include=' + includeCourse : '');
        axios.get(link).then((res) => {
            if (res.status === 200) {
                res.data.data.unshift({value: '', text: t("Todos os Cursos")});
                setCoursesOptions(res.data.data);
                setLoading(false);
                if(searchCourse && search === ""){
                    let selected = res.data.data.find((item) => item.value == searchCourse);
                    setCourse(selected.value);
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
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} search clearable selection value={course} defaultValue={(searchCourse ? searchCourse : undefined)} options={coursesOptions} label={t("Curso")} placeholder={t("Pesquisar o curso...")} loading={loading}
                       onSearchChange={_.debounce(handleSearchCourses, 400)}
                       onChange={filterByCourse}/>
    );
};

export default FilterOptionCourse;
