import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import _ from "lodash";

const FilterOptionTeacher = ({ widthSize, eventHandler, value, isSearch = true, isDisabled = false}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [teachersOptions, setTeachersOptions] = useState([]);
    const [teacher, setTeacher] = useState(value);

    const getList = (search) => {
        setLoading(true);
        setTeachersOptions([]);
        axios.get('/search/users' + (search ? "?q=" + search : "")).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(teachersOptions);
                response.data.unshift({value: '', text: t((isSearch ? "Todos os Professores" : "Professores"))});
                setTeachersOptions(response.data);
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

    const handleSearchTeacher = (e, {searchQuery}) => {
        getList(searchQuery);
    }
    return (
        <Form.Dropdown search selectOnBlur={false} width={widthSize} selection value={teacher} options={teachersOptions} label={t("Professores")}
                       placeholder={ t((isSearch ? "Todos os Professores" : "Professores")) } loading={loading}
                       disabled={isDisabled}
                       onSearchChange={_.debounce(handleSearchTeacher, 600)}
                       onChange={filterByTeacher} />
    );
};

export default FilterOptionTeacher;
