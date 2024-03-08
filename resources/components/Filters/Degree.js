import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionDegree = ({widthSize, eventHandler, disabled, value, className, showAllDegrees, isSearch=true}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [degreeOptions, setDegreeOptions] = useState([]);
    const [degree, setDegree] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get('/courses/degrees').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (showAllDegrees){
                    response.data.unshift({value: 'no-degree', text: t("Sem curso")});
                }
                if (isSearch){
                    response.data.unshift({value: '', text: t("Tipo de curso")});
                }

                setDegreeOptions(response.data);
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        setDegree(value);
    }, [value]);

    const filterByDegree = (e, {value}) => {
        setDegree(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} selectOnBlur={false} width={widthSize} clearable disabled={disabled} selection value={degree} options={degreeOptions} label={t("Tipo de curso")} placeholder={t("Tipo de curso")} loading={loading} onChange={filterByDegree}/>
    );
};

export default FilterOptionDegree;
