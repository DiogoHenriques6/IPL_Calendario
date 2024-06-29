import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {useSearchParams} from "react-router-dom";

const FilterOptionCourseUnits = ({widthSize, eventHandler, hasGroup, semester, school, hasMethods, currentCourseUnit}) => {
    const [searchParams] = useSearchParams();
    const searchCourseUnit = searchParams.get('curso-unit');

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [courseUnitsOptions, setCourseUnitsOptions] = useState([]);
    const [courseUnit, setCourseUnit] = useState();

    useEffect(() => {
        if(searchCourseUnit){
            setCourseUnit(searchCourseUnit);
        }
    }, [searchCourseUnit]);

    const loadCourses = (search = '', includeCourseUnit) => {
        setLoading(true);
        let link = '/course-units/search';
        const params = new URLSearchParams();
        if(search){
            params.append('search', search);
        }
        if(includeCourseUnit){
            params.append('include', includeCourseUnit);
        }
        if(school){
            params.append('school', school);
        }
        if(semester){
            params.append('semester', semester);
        }
        if(hasGroup){
            params.append('has_groups', hasGroup);
        }
        if(hasMethods){
            params.append('has_methods', hasMethods);
        }
        const queryString = params.toString();
        if (queryString) {
            link += `?${queryString}`;
        }
        axios.get(link).then((res) => {
            if (res.status === 200) {
                if(currentCourseUnit){
                    res.data.data = res.data.data.filter(item => item.id != currentCourseUnit);
                }
                else{
                    res.data.data.unshift({id: '', name: t("Todas as Unidades curriculares")});
                }
                setCourseUnitsOptions(res?.data?.data?.map(({ id, name }) => ({
                    key: id,
                    value: id,
                    text: name
                })));
                setLoading(false);
                if(searchCourseUnit && search === ""){
                    let selected = res.data.data.find((item) => item.value == searchCourseUnit);
                    setCourseUnit(selected.value);
                }
            }
        });

        if(currentCourseUnit){
            setCourseUnitsOptions(prevOptions =>
                prevOptions.filter(option => option.id !== currentCourseUnit)
            );
        }
    };

    useEffect(() => {
        loadCourses('', searchCourseUnit);
    }, []);

    const handleSearchCourses = (evt, {searchQuery}) => {
        loadCourses(searchQuery, searchCourseUnit);
    };

    const filterByCourse = (e, {value}) => {
        setCourseUnit(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} search clearable selection value={courseUnit} defaultValue={(searchCourseUnit ? searchCourseUnit : undefined)} options={courseUnitsOptions}
                       label={t("Unidade Curricular")} placeholder={t("Pesquisar a unidade curricular...")} loading={loading}
                       onSearchChange={_.debounce(handleSearchCourses, 400)} onChange={filterByCourse}/>
    );
};

export default FilterOptionCourseUnits;
