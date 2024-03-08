import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {useSearchParams} from "react-router-dom";

const FilterOptionCourseUnits = ({widthSize, eventHandler}) => {
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
        link += (search ? '?search=' + search : '');
        link += (includeCourseUnit ? (search ? '&' : '?') + 'include=' + includeCourseUnit : '');
        axios.get(link).then((res) => {
            if (res.status === 200) {
                res.data.data.unshift({value: '', text: t("Todas as Unidades curriculares")});

                setCourseUnitsOptions(res?.data?.data?.map(({key, value, text}) => ({key, value, text})));
                setLoading(false);
                if(searchCourseUnit && search === ""){
                    let selected = res.data.data.find((item) => item.value == searchCourseUnit);
                    setCourseUnit(selected.value);
                }
            }
        });
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
