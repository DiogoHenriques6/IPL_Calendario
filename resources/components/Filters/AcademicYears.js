import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionAcademicYear = ({widthSize, eventHandler, value, disabled, className, isSearch = true}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [academicYearOptions, setAcademicYearOptions] = useState([]);
    const [academicYear, setAcademicYear] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get('/academic-years/search').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(isSearch){
                    response.data.data.unshift({value: '', text: t("Todos")});
                }
                setAcademicYearOptions(response.data.data);
                setLoading(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setAcademicYear(value);
    }, [value]);

    const filterByYear = (e, {value}) => {
        setAcademicYear(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} disabled={disabled} selectOnBlur={false} width={widthSize} selection search={isSearch} value={academicYear}
                       options={academicYearOptions} label={t("Ano Académico")} placeholder={ t((isSearch ? "Todos" : "Ano Académico")) }
                       loading={loading} onChange={filterByYear}/>
    );
};

export default FilterOptionAcademicYear;
