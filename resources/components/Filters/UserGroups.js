import React, {useEffect, useState} from 'react';
import {Form} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";

const FilterOptionUserGroups = ({widthSize, values, eventHandler, forStudent}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [userGroupsOptions, setUserGroupsOptions] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [studentGroup, setStudentGroup] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get('/user-group').then((response) => {
            if (response.status === 200) {
                setLoading(false);
                if(!forStudent) {
                    setUserGroupsOptions(response?.data?.data?.map(({id, description}) => ({
                        key: id,
                        value: id,
                        text: description
                    })));
                }
                else{
                    setUserGroupsOptions(
                        response?.data?.data?.filter(item =>
                            item.name.startsWith("pedagogic") ||
                            item.name.startsWith("comission") ||
                            item.name.startsWith("student")
                        ).map(({id, description}) => ({
                            key: id,
                            value: id,
                            text: description
                        }))
                    );
                    setStudentGroup(response?.data?.data?.filter(item =>
                        item.name.startsWith("student")).map(item => item.id)
                    );
                }
            }
        });
    }, []);

    useEffect(() => {
        setUserGroups(studentGroup)
    }, [studentGroup]);


    // This will make sure the values are defined when the "values" variable is not empty
    useEffect(() => {
        if ( Array.isArray(values) ){
            setUserGroups(values);
        }
    }, [values]);



    const filterByUserGroup = (e, {value}) => {
        if (forStudent && studentGroup.length > 0) {
            studentGroup.forEach(studentId => {
                if (!value.includes(studentId)) {
                    value.push(studentId);
                }
            });
        }
        setUserGroups(value);
        eventHandler(value);
    };

    return (
        <Form.Dropdown selectOnBlur={false} width={widthSize} options={userGroupsOptions} value={userGroups} selection search multiple clearable label={t("Grupo de Utilizador")} placeholder={t("Grupo de Utilizador")} loading={loading} onChange={filterByUserGroup}/>
    );
};

export default FilterOptionUserGroups;
