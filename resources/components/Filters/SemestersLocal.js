import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionSemesterLocal = ({semestersList, widthSize, eventHandler, value, disabled, className, isSearch = true}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [semestersOptions, setSemestersOptions] = useState([]);
    const [semester, setSemester] = useState();

    useEffect(() => {
        setSemestersOptions(semestersList);
    }, [semestersList]);

    useEffect(() => {
        setSemester(value);
    }, [value]);

    const filterBySemester = (e, {value}) => {
        setSemester(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} disabled={disabled} selectOnBlur={false} width={widthSize} selection search={isSearch} value={semester}
                       options={semestersOptions} label={t("Semestre")} placeholder={ t((isSearch ? "Todas os Semestres" : "Semestre")) }
                       clearable loading={loading} onChange={filterBySemester}/>
    );
};

export default FilterOptionSemesterLocal;
