import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionCurricularYear = ({widthSize, eventHandler, value, disabled, className, isSearch = true}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [curricularYearOptions, setCurricularYearOptions] = useState([]);
    const [curricularYear, setCurricularYear] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get('/course-units/years').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(isSearch){
                    response.data.data.unshift({value: '', text: t("Todos")});
                }
                setCurricularYearOptions(response.data.data);
                setLoading(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCurricularYear(value);
    }, [value]);

    const filterByYear = (e, {value}) => {
        setCurricularYear(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} disabled={disabled} selectOnBlur={false} width={widthSize} selection search={isSearch} value={curricularYear}
                       options={curricularYearOptions} label={t("Ano Curricular")} placeholder={ t((isSearch ? "Todos" : "Ano Curricular")) }
                       loading={loading} onChange={filterByYear}/>
    );
};

export default FilterOptionCurricularYear;
