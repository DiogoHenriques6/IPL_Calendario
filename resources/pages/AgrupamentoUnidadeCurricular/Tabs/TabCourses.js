import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, Dimmer, Loader, Button, Icon} from 'semantic-ui-react';
import {useTranslation} from "react-i18next";
import moment from 'moment';
import ShowComponentIfAuthorized from "../../../components/ShowComponentIfAuthorized";
import SCOPES from "../../../utils/scopesConstants";
import {Link} from "react-router-dom";

const UnitTabCourses = ({ groupId, isLoading, coursesCount }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    const loadCourses = () => {
        setLoading(true);
        isLoading = true;
        axios.get(`/course-unit-groups/${groupId}/courses`).then((res) => {
            setLoading(false);
            isLoading = false;
            setCourses(res.data.data);
        });
    };

    useEffect(() => {
        loadCourses();
    }, [groupId, coursesCount]);

    return (
        <div>
            { loading && (
                <Dimmer active inverted>
                    <Loader indeterminate>{t('A carregar dados')}</Loader>
                </Dimmer>
            )}
            <Table striped color="green">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{t("Código")}</Table.HeaderCell>
                        <Table.HeaderCell>{t("Curso")}</Table.HeaderCell>
                        <Table.HeaderCell style={{width: '15%'}} textAlign={"right"}>{t("Ações")}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {courses?.map(({code, name, id}, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{code}</Table.Cell>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell textAlign={"right"}>
                                <ShowComponentIfAuthorized permission={[SCOPES.VIEW_COURSES || SCOPES.EDIT_COURSES]}>
                                    <Link to={`/curso/${id}`}>
                                        <Button color="green" icon>
                                            <Icon name="eye"/>
                                        </Button>
                                    </Link>
                                </ShowComponentIfAuthorized>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default UnitTabCourses;
