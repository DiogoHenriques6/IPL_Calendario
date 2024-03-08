import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionSchool = ({widthSize, eventHandler}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [schoolsOptions, setSchoolsOptions] = useState([]);
    const [school, setSchool] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get('/schools-list').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                response.data.data.unshift({value: '', text: t("Todas as Escolas")});
                setSchoolsOptions(response.data.data);
                setLoading(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filterBySchool = (e, {value}) => {
        setSchool(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} selection value={school} options={schoolsOptions} label={t("Escolas")} placeholder={t("Todas as Escolas")} loading={loading} onChange={filterBySchool}/>
    );
};

export default FilterOptionSchool;
