import React, { useState} from 'react';
import {Form} from 'semantic-ui-react';
import {useTranslation} from "react-i18next";

const FilterOptionPerPage = ({widthSize, eventHandler}) => {
    const { t } = useTranslation();
    const [perPage, setPerPage] = useState(10);

    const perPageOptions = [
        {value:10, text: 10},
        {value:25, text: 25},
        {value:50, text: 50},
        {value:100, text: 100}
    ];

    const filterByPerPage = (e, {value}) => {
        setPerPage(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} selection value={perPage} options={perPageOptions} label={t("Por Página")} placeholder={t("Por Página")} onChange={filterByPerPage}/>
    );
};

export default FilterOptionPerPage;
