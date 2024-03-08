import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionUserGroups = ({widthSize, values, eventHandler}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [userGroupsOptions, setUserGroupsOptions] = useState([]);
    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get('/user-group').then((response) => {
            if (response.status === 200) {
                setLoading(false);
                setUserGroupsOptions(response?.data?.data?.map(({id, description}) => ({key: id, value: id, text: description})));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // This will make sure the values are defined when the "values" variable is not empty
    useEffect(() => {
        if ( Array.isArray(values) ){
            setUserGroups(values);
        }
    }, [values]);

    const filterByUserGroup = (e, {value}) => {
        setUserGroups(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} options={userGroupsOptions} value={userGroups} selection search multiple clearable label={t("Grupo de Utilizador")} placeholder={t("Grupo de Utilizador")} loading={loading} onChange={filterByUserGroup}/>
    );
};

export default FilterOptionUserGroups;
