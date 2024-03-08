import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {Card, Container, Form, Icon, Input, Table, Button, Popup, Dimmer, Loader} from 'semantic-ui-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ShowComponentIfAuthorized from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import FilterOptionPerPage from "../../components/Filters/PerPage";
import FilterOptionUserGroups from "../../components/Filters/UserGroups";
import PaginationDetail from "../../components/Pagination";
import {useTranslation} from "react-i18next";
import EmptyTable from "../../components/EmptyTable";

const SweetAlertComponent = withReactContent(Swal);

const List = () => {
    const { t } = useTranslation();
    const [userList, setUserList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(true);
    // Filters
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState();
    const [perPage, setPerPage] = useState(10);
    const [userGroups, setUserGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Table columns
    const columns = [
        {name: t('Nome')},
        {name: t('Email') },
        {name: t('Ativo?'), align: 'center', style: {width: '10%'} },
        {name: t('Ações'),  align: 'center', style: {width: '10%'} },
    ];

    useEffect(() => {
        if(currentPage === 1){
            fetchUserList(1, searchTerm, userGroups, perPage);
        } else {
            setCurrentPage(1);
        }
    }, [searchTerm, userGroups, perPage]);

    useEffect(() => {
        fetchUserList(currentPage, searchTerm, userGroups, perPage);
    }, [currentPage]);

    const fetchUserList = useCallback((page = 1, search, groups, per_page) => {
        if (search || groups) {
            setSearching(true);
        }
        setContentLoading(true);

        let searchLink = `/users?page=${page}`;
        searchLink += `${search ? `&search=${search}` : ''}`;
        searchLink += `${groups?.length ? `&groups=${JSON.stringify(groups)}` : ''}`;
        searchLink += '&per_page=' + per_page;

        axios.get(searchLink)
            .then((response) => {
                setLoading(false);
                setContentLoading(false);
                if (search || groups) {
                    setSearching(false);
                }
                setPaginationInfo(response.data.meta);
                setUserList(response?.data?.data);
            });
    }, []);

    // Handle Pagination
    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    const setUserEnabled = (userId, enabled) => {
        axios.patch(`/user/${userId}`, {enabled})
            .then((response) => {
                if (response.status === 200) {
                    fetchUserList();
                    SweetAlertComponent.fire({
                        title: t('Sucesso!'),
                        text: t('Utilizador atualizado com sucesso'),
                        icon: 'success',
                        confirmButtonColor: '#21ba45',
                    });
                }
            });
    };

    const searchUser = ({target: {value}}) => {
        setSearchTerm(value);
    };

    return (
        <Container>
            <Card fluid>
                <Card.Content header={t("Utilizadores")} />
                <Card.Content>
                    <Form>
                        <Form.Group>
                            <Form.Field width={7}>
                                <label>{ t("Utilizador") }</label>
                                <Input icon='search' iconPosition='left' fluid loading={searching} placeholder={t("Pesquisar utilizador...")} onChange={_.debounce(searchUser, 900)}/>
                            </Form.Field>
                            <FilterOptionUserGroups widthSize={7} eventHandler={(value) => setUserGroups(value)} />
                            <FilterOptionPerPage widthSize={2} eventHandler={(value) => setPerPage(value)} />
                        </Form.Group>
                    </Form>
                </Card.Content>
                <Card.Content>
                    { userList.length < 1 || loading ? (
                        <EmptyTable isLoading={loading} label={t("Ohh! Não foi possível encontrar Utilizadores!")}/>
                    ) : (
                        <>
                            <Table celled fixed>
                                <Table.Header>
                                    <Table.Row>
                                        {columns.map((col, index) => (
                                            <Table.HeaderCell key={index} textAlign={col.align} style={ col.style } >{col.name}</Table.HeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {userList.map(({id, email, name, enabled}, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{name}</Table.Cell>
                                            <Table.Cell>{email}</Table.Cell>
                                            <Table.Cell textAlign="center">
                                                <Icon name={enabled ? 'checkmark' : 'close'}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <ShowComponentIfAuthorized permission={[SCOPES.EDIT_USERS]}>
                                                    <Link to={`/utilizador/edit/${id}`}>
                                                        <Button color="yellow" icon>
                                                            <Icon name="edit"/>
                                                        </Button>
                                                    </Link>
                                                </ShowComponentIfAuthorized>
                                                <ShowComponentIfAuthorized permission={[SCOPES.LOCK_USERS]}>
                                                    <Popup content={t(`${enabled ? 'Bloquear' : 'Desbloquear'} a conta do utilizador.`)}
                                                        trigger={(
                                                            <Button color={enabled ? 'red' : 'green'} icon onClick={() => setUserEnabled(id, !enabled,)}>
                                                                <Icon name={enabled ? 'lock' : 'unlock'}/>
                                                            </Button>
                                                        )}
                                                    />
                                                </ShowComponentIfAuthorized>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            {contentLoading && (
                                <Dimmer active inverted>
                                    <Loader indeterminate>
                                        { t("A carregar os utilizadores") }
                                    </Loader>
                                </Dimmer>
                            )}
                            <PaginationDetail currentPage={currentPage} info={paginationInfo} eventHandler={changedPage} />
                        </>
                    )}
                </Card.Content>
            </Card>
        </Container>
    );
};

export default List;
