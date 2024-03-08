import React, {useEffect, useState} from 'react';
import {Card, Container, Table, Icon, Modal, Button, Header, Message, Dimmer, Loader, Label, Form} from 'semantic-ui-react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import _ from 'lodash';
import SCOPES from '../../utils/scopesConstants';
import ShowComponentIfAuthorized from '../../components/ShowComponentIfAuthorized';
import {errorConfig, successConfig} from '../../utils/toastConfig';
import {useTranslation} from "react-i18next";
import Courses from "../../components/Filters/Courses";
import FilterOptionPerPage from "../../components/Filters/PerPage";
import EmptyTable from "../../components/EmptyTable";
import PaginationDetail from "../../components/Pagination";
import SemestersLocal from "../../components/Filters/SemestersLocal";
import CalendarStatus from "../../components/Filters/CalendarStatus";

const MessageFading = styled(Message)`
    @keyframes flickerAnimation {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.05;
        }
        100% {
            opacity: 1;
        }
    }
    animation: flickerAnimation 1s infinite;
`;

let filterDebounce = null;

const CalendarList = () => {
    const { t } = useTranslation();
    const [calendars, setCalendars] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState();
    const [messageVisible, setMessageVisible] = useState(false);
    const [removingCalendar, setRemovingCalendar] = useState([]);
    const [myCourseOnly, setMyCourseOnly] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [contentLoading, setContentLoading] = useState(true);
    const [courseFilter, setCourseFilter] = useState();
    const [semesterFilter, setSemesterFilter] = useState();
    const [phaseFilter, setPhaseFilter] = useState();
    const [statusFilter, setStatusFilter] = useState();
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [calendarInfo, setCalendarInfo] = useState();


    const loadBase = () => {
        axios.get('/calendar-info').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                setCalendarInfo(response.data);
            }
        });
    };

    useEffect(() => {
        if (!calendarInfo) {
            loadBase();
        }
    }, []);


    const loadCalendars = () => {
        setContentLoading(true);
        let link = '/calendar?page=' + currentPage;
        link += (myCourseOnly   ? '&myCourseOnly='  + myCourseOnly      : '');
        link += (semesterFilter ? '&semester='      + semesterFilter    : '');
        link += (courseFilter   ? '&course='        + courseFilter      : '');
        link += (phaseFilter    ? '&phase='         + phaseFilter       : '');
        link += (statusFilter   ? '&status='        + statusFilter      : '');
        link += '&per_page=' + perPage;

        axios.get(link).then((response) => {
            setIsLoading(false);
            setContentLoading(false);
            if (response.status >= 200 && response.status < 300) {
                setPaginationInfo(response.data.meta);
                setCalendars(_.orderBy(response.data.data, 'display_id'));
            }
        });
    };

    useEffect(() => {
        if (calendars.filter((x) => x.has_differences)?.length > 0) {
            setMessageVisible(true);
        }
    }, [calendars]);

    const remove = (course) => {
        setModalInfo(course);
        setModalOpen(true);
    };

    const handleModalClose = () => setModalOpen(false);

    const handleRemoval = () => {
        setRemovingCalendar((current) => {
            current.push(modalInfo.id);
            return current;
        });
        handleModalClose();
        axios.delete(`/calendar/${modalInfo.id}`).then((res) => {
            setRemovingCalendar((current) => current.filter((x) => x !== modalInfo.id));
            if (res.status === 200) {
                loadCalendars();
                toast('Calendário removido com sucesso!', successConfig);
            } else {
                toast('Ocorreu um problema ao remover um calendário!', errorConfig);
            }
        });
    };
    // this will load the calendar list after any filter is changed, and if its changed,
    // it will reset the pagination. This way, if a page is not the initial, it will show the results
    useEffect(() => {
        if(currentPage === 1){
            loadCalendars();
        } else {
            setCurrentPage(1);
        }
    }, [semesterFilter, courseFilter, phaseFilter, myCourseOnly, statusFilter]);
    // loads the calendar list after the page is changed.
    useEffect(() => {
        loadCalendars();
    }, [currentPage]);

    const filterByCourse = (course) => {
        setCurrentPage(1);
        setCourseFilter(course);
    };

    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    const handleSearchCourseUnits = (evt, {value}) => {
        setPhaseFilter(value);
    };

    const filterBySemester = (value) => {
        setCurrentPage(1);
        setSemesterFilter(value);
    };

    const searchByStatus = (value) => {
        setCurrentPage(1);
        setStatusFilter(value);
    };


    const columns = [
        {name: t('Versão'),        align: 'center', style: {width: '5%' } },
        {name: t('Curso'),         align: 'center', style: {width: '33%' } },
        {name: t('Semestre'),      align: 'center', style: {width: '7%' } },
        {
            name: t('Fase'),
            align: 'center',
            restrictedToCreators: true,
            permission: SCOPES.VIEW_ACTUAL_PHASE,
            style: {width: '10%' }
        },
        {
            name: t('Estado'),
            align: 'center',
            restrictedToCreators: true,
            permission: SCOPES.VIEW_CALENDAR_INFO,
            style: {width: '10%' }
        },
        {name: t('Ações'),      align: 'center', style: {width: '10%'} },
    ];

    return (
        <Container>
            {messageVisible && (
                <MessageFading
                    onDismiss={() => setMessageVisible(false)}
                    success
                    header={ t("Alterações ao calendário!") }
                    content={ t("Deverá verificar com atenção todas as alterações.") }
                />
            )}
            <Card fluid>
                <Card.Content>
                    <div>
                        <Header as="span">{ t("Calendários") }</Header>
                        <ShowComponentIfAuthorized permission={[SCOPES.CREATE_CALENDAR]} renderIfNotAllowed={() => (
                            <Button.Group floated={"right"}>
                                <Button floated="right" toggle active={myCourseOnly} onClick={() => setMyCourseOnly(true)}>
                                    { t('Meus calendários') }
                                </Button>
                                <Button floated="right" toggle active={!myCourseOnly} onClick={() => setMyCourseOnly(false)}>
                                    { t('Todos') }
                                </Button>
                            </Button.Group>
                            )}>
                            <Link to="/calendario/novo">
                                <Button floated="right" color="green" disabled={!calendarInfo?.has_academic_year}>{ t("Novo") }</Button>
                            </Link>
                        </ShowComponentIfAuthorized>
                    </div>
                </Card.Content>
                { calendarInfo?.filters && calendarInfo?.filters.semesters.length > 0 && (
                    <Card.Content>
                        <Form>
                            <Form.Group>
                                { calendarInfo.filters.semesters.length > 0 && (
                                    <SemestersLocal semestersList={calendarInfo.filters.semesters} widthSize={4} eventHandler={filterBySemester} withSpecial={true} isSearch={true} />
                                )}
                                { (calendarInfo.filters.semesters.length > 0  && calendarInfo.filters.has_courses) && (
                                    <ShowComponentIfAuthorized permission={[SCOPES.CREATE_CALENDAR]}>
                                        <Courses widthSize={5} eventHandler={filterByCourse} />
                                    </ShowComponentIfAuthorized>
                                )}
                                <CalendarStatus eventHandler={searchByStatus} widthSize={4} />
                                { (paginationInfo.last_page > 1 || paginationInfo.total > 10) && (
                                    <FilterOptionPerPage widthSize={2} eventHandler={(value) => setPerPage(value)} />
                                )}
                            </Form.Group>
                        </Form>
                    </Card.Content>
                )}
                <Card.Content>
                    { calendars.length < 1 || isLoading ? (
                        <EmptyTable isLoading={isLoading} label={t("Ohh! Não foi possível encontrar Calendarios!")}/>
                    ) : (
                        <>
                            <Table celled fixed striped selectable>
                                <Table.Header>
                                    <Table.Row key={'table_header'}>
                                        {columns.map(({name, align, restrictedToCreators, permission, style}, index) => (
                                            restrictedToCreators ?
                                                (
                                                    <ShowComponentIfAuthorized permission={[permission]} key={'auth_table_header_cell_' + index}>
                                                        <Table.HeaderCell textAlign={align} key={'table_header_cell_' + index} style={style}>
                                                            {name}
                                                        </Table.HeaderCell>
                                                    </ShowComponentIfAuthorized>
                                                ) :
                                                (
                                                    <Table.HeaderCell textAlign={align} key={'table_header_cell_' + index} style={style}>
                                                        {name}
                                                    </Table.HeaderCell>
                                                )
                                            ),
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {calendars.map(({id, version, course, semester, temporary, phase, published}) => (
                                            <Table.Row key={id}>
                                                <Table.Cell textAlign="center">{version}</Table.Cell>
                                                <Table.Cell>{course}</Table.Cell>
                                                <Table.Cell textAlign="center">{semester}</Table.Cell>
                                                <ShowComponentIfAuthorized permission={[SCOPES.VIEW_ACTUAL_PHASE]}>
                                                    <Table.Cell>
                                                        {phase.description}
                                                    </Table.Cell>
                                                </ShowComponentIfAuthorized>
                                                <ShowComponentIfAuthorized permission={[SCOPES.VIEW_CALENDAR_INFO]}>
                                                    <Table.Cell textAlign="center">
                                                        { !published && !temporary ? (
                                                            <Label color={"blue"}>{ t("Nao Publicado") }</Label>
                                                        ) : (
                                                            <Label color={temporary ? 'grey' : 'green' }>{temporary ? t('Provisório') : t('Definitivo')}</Label>
                                                        )}
                                                    </Table.Cell>
                                                </ShowComponentIfAuthorized>
                                                <Table.Cell textAlign="center">
                                                    <Link to={`/calendario/${id}`}>
                                                        <Button color="green" icon>
                                                            <Icon name="eye"/>
                                                        </Button>
                                                    </Link>
                                                    <ShowComponentIfAuthorized permission={[SCOPES.DELETE_CALENDAR]}>
                                                        <Button onClick={() => remove({id, course: course})} color="red" icon disabled={!!published} loading={!!removingCalendar?.find((x) => x === id)}>
                                                            <Icon name="trash"/>
                                                        </Button>
                                                    </ShowComponentIfAuthorized>
                                                </Table.Cell>
                                            </Table.Row>
                                        ),
                                    )}
                                </Table.Body>
                            </Table>

                            <PaginationDetail currentPage={currentPage} info={paginationInfo} eventHandler={changedPage} />
                            {contentLoading && (
                                <Dimmer active inverted>
                                    <Loader indeterminate>
                                        { t("A carregar os calendarios") }
                                    </Loader>
                                </Dimmer>
                            )}
                        </>
                    )}
                </Card.Content>
            </Card>
            <Modal dimmer="blurring" open={modalOpen} onClose={handleModalClose}>
                <Modal.Header>{ t("Remover Calendário") }</Modal.Header>
                <Modal.Content>
                    { t("Tem a certeza que deseja remover o calendário do curso") }{' '}<strong>{modalInfo?.course}</strong>?
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleModalClose}>{ t("Cancelar") }</Button>
                    <Button positive onClick={handleRemoval}>{ t(" Sim") }</Button>
                </Modal.Actions>
            </Modal>
        </Container>
    );
};

export default CalendarList;
