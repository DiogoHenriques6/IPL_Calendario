import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, Dimmer, Loader} from 'semantic-ui-react';
import {useTranslation} from "react-i18next";
import moment from 'moment';

const UnitTabLogs = ({ groupId, isLoading }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    const loadLogs = () => {
        setLoading(true);
        isLoading = true;
        axios.get(`/course-unit-groups/${groupId}/logs`).then((res) => {
            setLoading(false);
            isLoading = false;
            setLogs(res.data.data);
        });
    };

    useEffect(() => {
        loadLogs();
    }, [groupId]);

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
                        <Table.HeaderCell>{t("Descrição")}</Table.HeaderCell>
                        <Table.HeaderCell style={{width: '15%'}} textAlign={"right"}>{t("Data")}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {logs?.map((log, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{log.description}</Table.Cell>
                            <Table.Cell textAlign={"right"}>{moment(log.created).fromNow()}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default UnitTabLogs;
