import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionGroupUnit = ({widthSize, eventHandler, value, disabled, className, isSearch = true}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [groupUnitsOptions, setGroupUnitsOptions] = useState([]);
    const [groupUnits, setGroupUnits] = useState();

    useEffect(() => {
        setLoading(true);
        axios.get('/course-unit-groups/search').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(isSearch){
                    response.data.data.unshift({value: '', text: t("Todos")});
                }
                setGroupUnitsOptions(response.data.data);
                setLoading(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setGroupUnits(value);
    }, [value]);

    const filterByYear = (e, {value}) => {
        setGroupUnits(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} disabled={disabled} selectOnBlur={false} width={widthSize} selection search={isSearch} value={groupUnits}
                       options={groupUnitsOptions} label={t("Agrupamento")} placeholder={ t((isSearch ? "Todos" : "Agrupamento")) }
                       loading={loading} onChange={filterByYear}/>
    );
};

export default FilterOptionGroupUnit;
