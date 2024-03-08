import React, { useEffect, useState } from 'react';
import {Card, Container, Table, Form, Button, Header, Icon, List, Dimmer, Loader} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import { errorConfig, successConfig } from '../../utils/toastConfig';
import ShowComponentIfAuthorized from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import EmptyTable from "../../components/EmptyTable";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PaginationDetail from "../../components/Pagination";
import FilterOptionPerPage from "../../components/Filters/PerPage";
import FilterOptionCourseUnits from "../../components/Filters/CourseUnits";

const SweetAlertComponent = withReactContent(Swal);


const ListGroupedUC = () => {
    const { t } = useTranslation();
    const columns = [
        {name: t('Nome')},
        {name: t('Unidades Curriculares'),  style: {width: '60%'} },
        {name: t("Número de UC's"),         style: {width: '10%'},  align: 'center' },
        {name: t('Ações'),                  style: {width: '10%'},  align: 'center' },
    ];

    const [courseUnitGroups, setCourseUnitGroups] = useState([]);
    const [removingCourseUnitGroup, setRemovingCourseUnitGroup] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const [contentLoading, setContentLoading] = useState(true);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [courseUnitFilter, setCourseUnitFilter] = useState();
    const [searchFilter, setSearchFilter] = useState();

    const loadCourseUnitGroups = () => {
        setContentLoading(true);
        let link = '/course-unit-groups?page='      + currentPage;
        link += (courseUnitFilter   ? '&courseUnits='  + courseUnitFilter   : '');
        link += (searchFilter   ? '&search='        + searchFilter   : '');
        link += '&per_page=' + perPage;

        axios.get(link).then((response) => {
            setIsLoading(false);
            setContentLoading(false);
            if (response.status >= 200 && response.status < 300) {
                setCourseUnitGroups(response.data.data);
                setPaginationInfo(response.data.meta);
            }
        });
    };

    useEffect(() => {
        loadCourseUnitGroups();
    }, []);

    const remove = (courseUnitGroupId) => {
        let transl = t('Ao eliminar o agrupamento, as avaliações e métodos já adicionados continuarão a estar acessiveis, no entanto não conseguirá utilizar este agrupamento para novas avaliações/métodos!');
        transl += "<br/><strong>";
        transl += t('Tem a certeza que deseja eliminar este agrupamento de unidades curriculares, em vez de editar?');
        transl += "</strong>";

        let sweetAlertOptions = {
            title: t('Atenção!'),
            html: transl,
            denyButtonText: t('Não'),
            confirmButtonText: t('Sim'),
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: '#21ba45',
            denyButtonColor: '#db2828',
        };

        SweetAlertComponent.fire(sweetAlertOptions).then((result) => {
            if (result.isConfirmed) {
                setRemovingCourseUnitGroup(courseUnitGroupId);

                axios.delete(`/course-unit-groups/${courseUnitGroupId}`).then((res) => {
                    setRemovingCourseUnitGroup(null);
                    loadCourseUnitGroups();

                    if (res.status === 200) {
                        toast( t('Agrupamento eliminado com sucesso!'), successConfig);
                    }
                    else {
                        toast( t('Ocorreu um problema ao eliminar este agrupamento!'), errorConfig);
                    }
                });
            }
        });
    };

    useEffect(() => {
        if(currentPage === 1){
            loadCourseUnitGroups();
        } else {
            setCurrentPage(1);
        }
    }, [courseUnitFilter, searchFilter]);

    useEffect(() => {
        loadCourseUnitGroups();
    }, [currentPage]);


    const handleSearchCourseUnits = (evt, {value}) => {
        setSearchFilter(value);
    };

    const filterByCourseUnit = (course) => {
        setCourseUnitFilter(course);
    };

    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    return (
        <Container>
            <Card fluid>
                <Card.Content>
                    <div className='card-header-alignment'>
                        <Header as="span">{t("Agrupamento de Unidades Curriculares")}</Header>
                        <ShowComponentIfAuthorized permission={[SCOPES.CREATE_UC_GROUPS]}>
                            { !isLoading && (
                                <Link to="/agrupamento-unidade-curricular/novo">
                                    <Button floated="right" color="green">{t("Novo")}</Button>
                                </Link>
                            )}
                        </ShowComponentIfAuthorized>
                    </div>
                </Card.Content>

                <Card.Content>
                    <Form>
                        <Form.Group>
                            <Form.Input icon='search' iconPosition='left' width={5} onChange={_.debounce(handleSearchCourseUnits, 400)} placeholder={t("Pesquisar por nome")} label={t("Pesquisar por nome")} />
                            <FilterOptionCourseUnits widthSize={5} eventHandler={filterByCourseUnit} />
                            <div className={"four wide field"}></div>
                            <FilterOptionPerPage widthSize={2} eventHandler={(value) => setPerPage(value)} />
                        </Form.Group>
                    </Form>
                </Card.Content>

                <Card.Content>
                { courseUnitGroups.length < 1 || isLoading ? (
                    <EmptyTable isLoading={isLoading} label={t("Ohh! Não foi possível encontrar Unidades Agrupadas!")} />
                    ) : (
                        <>
                            <Table celled fixed striped selectable>
                                <Table.Header>
                                    <Table.Row>
                                        {columns.map((col, index) => (
                                            <Table.HeaderCell key={index} textAlign={col.align} style={ col.style } >{col.name}</Table.HeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    { courseUnitGroups?.map(({ id, description, course_units, num_course_units }, index ) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{description}</Table.Cell>
                                            <Table.Cell>
                                                <List bulleted>
                                                    {course_units?.map((uc, ucIndex) => (
                                                        <List.Item key={"uc_" + ucIndex}>
                                                            <List.Content>
                                                                <List.Header>{ uc.name }</List.Header>
                                                                <List.Description className={"margin-top-xs padding-left-base"}>{uc.course_description}</List.Description>
                                                            </List.Content>
                                                        </List.Item>
                                                    ))}
                                                </List>
                                            </Table.Cell>
                                            <Table.Cell textAlign="center">{num_course_units}</Table.Cell>
                                            <Table.Cell textAlign="center">
                                                <ShowComponentIfAuthorized permission={[SCOPES.EDIT_UC_GROUPS]}>
                                                    <Link to={`/agrupamento-unidade-curricular/edit/${id}`}>
                                                        <Button color="yellow" icon>
                                                            <Icon name="edit"/>
                                                        </Button>
                                                    </Link>
                                                </ShowComponentIfAuthorized>
                                                <ShowComponentIfAuthorized permission={[SCOPES.DELETE_UC_GROUPS]}>
                                                    <Button onClick={() => remove(id) } color="red" icon loading={removingCourseUnitGroup === id}>
                                                        <Icon name="trash"/>
                                                    </Button>
                                                </ShowComponentIfAuthorized>
                                            </Table.Cell>
                                        </Table.Row>
                                        ))}
                                </Table.Body>
                            </Table>
                            <PaginationDetail currentPage={currentPage} info={paginationInfo} eventHandler={changedPage} />
                            {contentLoading && (
                                <Dimmer active inverted>
                                    <Loader indeterminate>
                                        { t("A carregar os unidades curriculares") }
                                    </Loader>
                                </Dimmer>
                            )}
                        </>
                    )}
                </Card.Content>
            </Card>
        </Container>
    );
};

export default ListGroupedUC;
