import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import {useTranslation} from "react-i18next";

const FilterOptionCalendarStatus = ({widthSize, eventHandler, value, disabled = false, className = ""}) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState();

    const perStausOptions = [
        {value: 0, text: t('Todos')},
        {value: 1, text: t('Nao Publicado')},
        {value: 2, text: t('Provisório')},
        {value: 3, text: t('Definitivo')},
    ];

    useEffect(() => {
        setStatus(value);
    }, [value]);

    const filterByStatus = (e, {value}) => {
        setStatus(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown className={className} disabled={disabled} selectOnBlur={false} width={widthSize}
                       clearable selection options={perStausOptions} value={status}
                       label={t("Estado do calendário")} placeholder={ t("Filtrar por estado") } onChange={filterByStatus}/>
    );
};

export default FilterOptionCalendarStatus;
