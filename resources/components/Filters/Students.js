import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import _ from "lodash";

const FilterOptionStudents = ({ widthSize, eventHandler, value, isSearch = true, isDisabled = false}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [teachersOptions, setTeachersOptions] = useState([]);
    const [teacher, setTeacher] = useState(value);

    const getList = (search) => {
        setLoading(true);
        axios.get('/search/students' + (search ? "?q=" + search : "")).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(isSearch){
                    response.data.data.unshift({value: '', text: t("Todos os Professores")});
                }
                setTeachersOptions(response.data.data);
                setLoading(false);
            }
        });
    }

    useEffect(() => {
        getList();
    }, []);

    const filterByTeacher = (e, {value}) => {
        setTeacher(value);
        eventHandler(value);
    };

    const handleSearchResponsible = (e, {searchQuery}) => {
        getList(searchQuery);
    }
    return (
        <Form.Dropdown search selectOnBlur={false} width={widthSize} selection value={teacher} options={teachersOptions} label={t("Professores")}
                       placeholder={ t((isSearch ? "Todos os Professores" : "Professores")) } loading={loading}
                       disabled={isDisabled}
                       onSearchChange={_.debounce(handleSearchResponsible, 400)}
                       onChange={filterByTeacher} />
    );
};

export default FilterOptionStudents;
