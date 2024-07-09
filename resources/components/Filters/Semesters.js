import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionSemester = ({withSpecial, widthSize, eventHandler, value, disabled, className, isSearch = true}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [semestersOptions, setSemestersOptions] = useState([]);
    const [semester, setSemester] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get('/semesters' + (withSpecial ? "?special=1" : "")).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(isSearch){
                    response.data.data.unshift({value: '', text: t("Todos os Semestres")});
                }
                setSemestersOptions(response.data.data);
                setLoading(false);
                const semesterAux = sessionStorage.getItem('semester');
                setSemester(semesterAux ? parseInt(semesterAux) : semester)
            }
        });
    }, []);

    useEffect(() => {
        setSemester(value);
    }, [value]);

    const filterBySemester = (e, {value}) => {
        setSemester(value);
        sessionStorage.setItem('semester', value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} disabled={disabled} selectOnBlur={false} width={widthSize} selection search={isSearch} value={semester}
                       options={semestersOptions} label={t("Semestre")} placeholder={ t((isSearch ? "Todos os Semestres" : "Semestre")) }
                       loading={loading} onChange={filterBySemester}/>
    );
};

export default FilterOptionSemester;
