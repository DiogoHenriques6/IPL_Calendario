import React, { useEffect, useState } from 'react';
import {Card, Container, Table, Button, Header, Icon, Popup, List} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import ShowComponentIfAuthorized from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import EmptyTable from "../../components/EmptyTable";

const ListSchools = () => {
    const { t } = useTranslation();
    const columns = [
        {name: t('Iniciais'), style: {width: '10%'} },
        {name: t('Descrição')},
        {name: t('Configurada?'), align: 'center', style: {width: '10%'} },
        {name: t('Ações'),  align: 'center', style: {width: '10%'} },
    ];

    const [schoolList, setSchoolList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSchools = () => {
        setIsLoading(true);

        axios.get('/schools/').then((response) => {
            setIsLoading(false);
            if (response.status >= 200 && response.status < 300) {
                setSchoolList(response.data?.data);
            }
        });
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    return (
        <Container>
            <Card fluid>
                <Card.Content>
                    <div className='card-header-alignment'>
                        <Header as="span">{t("Escolas")}</Header>
                        <ShowComponentIfAuthorized permission={[SCOPES.CREATE_SCHOOLS]}>
                            { !isLoading && (
                                <Link to="/escola/novo">
                                    <Button floated="right" color="green">{t("Novo")}</Button>
                                </Link>
                            )}
                        </ShowComponentIfAuthorized>
                    </div>
                </Card.Content>

                <Card.Content>
                { schoolList.length < 1 || isLoading ? (
                    <EmptyTable isLoading={isLoading} label={t("Ohh! Não foi possível encontrar Escolas!")}/>
                    ) : (
                    <Table celled fixed>
                        <Table.Header>
                            <Table.Row>
                                {columns.map((col, index) => (
                                    <Table.HeaderCell key={index} textAlign={col.align} style={ col.style } >{col.name}</Table.HeaderCell>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { schoolList?.map(({ id, name, description, is_configured, has_link, has_gop, has_board, has_pedagogic }, index ) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{description}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {   is_configured ?
                                            (
                                                <Icon name={'check'} />
                                            ) :
                                            (
                                                <Popup trigger={<Icon name='close' />} >
                                                    <List divided relaxed>
                                                        { !has_link &&      ( <List.Item icon='linkify' content={ t("Link de sincronização não configurado.") } />) }
                                                        { !has_gop &&       ( <List.Item icon='users'   content={ t("Grupo GOP da escola não configurado.") } />) }
                                                        { !has_board &&     ( <List.Item icon='users'   content={ t("Grupo Direção da escola não configurado.") } />) }
                                                        { !has_pedagogic && ( <List.Item icon='users'   content={ t("Grupo Pedagógico da escola não configurado.") } />) }
                                                    </List>
                                                </Popup>
                                            )
                                        }
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <ShowComponentIfAuthorized permission={[SCOPES.EDIT_SCHOOLS]}>
                                            <Link to={`/escola/edit/${id}`}>
                                                <Button color="yellow" icon>
                                                    <Icon name="edit"/>
                                                </Button>
                                            </Link>
                                        </ShowComponentIfAuthorized>
                                    </Table.Cell>
                                </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                    )}
                </Card.Content>
            </Card>
        </Container>
    );
};

export default ListSchools;
