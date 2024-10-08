import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import { useParams} from "react-router-dom";
import { useTranslation} from "react-i18next";
import {
    Card,
    Button,
    Sticky,
    Grid,
    Header,
    List,
    GridColumn,
    Icon,
    Popup,
    Label,
    Placeholder,
    Table,
    Input,
    Modal,
    Confirm,
    ModalContent, ModalActions, ListContent, ListItem, ButtonGroup, GridRow
} from 'semantic-ui-react';
import { toast} from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import GROUPS from "../../../utils/groupConstants";

import ShowComponentIfAuthorized from '../../../components/ShowComponentIfAuthorized';
import SCOPES from '../../../utils/scopesConstants';
import {errorConfig, successConfig} from '../../../utils/toastConfig';

import PopupSubmitCalendar from './popup-submit';
import PopupRevisionDetail from "./popup-revision";

const SweetAlertComponent = withReactContent(Swal);

const InfosAndActions = ( {isLoading, epochs, calendarInfo, course, phase, updatePhase, warnings, isPublished, isTemporary, epochsViewHandler, hasCurrentWeek = false, myUCsOnly, setMyUCsOnly}) => {
    const { t,i18n } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    const calendarId = id;

    let selectedLanguage = localStorage.getItem('language');
    if(selectedLanguage === null){
        selectedLanguage = "pt";
        localStorage.setItem('language', selectedLanguage);
    }

    const [calendarPermissions, setCalendarPermissions] = useState(JSON.parse(localStorage.getItem('calendarPermissions')) || []);
    const [openSubmitModal, setOpenSubmitModal] = useState(false);
    const [calendarPhases, setCalendarPhases] = useState([]);
    const [differences, setDifferences] = useState();
    // const [isLoading, setIsLoading] = useState(true);
    // const [examList, setExamList] = useState([]);
    // const [publishLoading, setPublishLoading] = useState(false);
    const [openRevisionModal, setOpenRevisionModal] = useState(false);

    const [calendarPhase, setCalendarPhase] = useState(true);
    // const [updatingCalendarPhase, setUpdatingCalendarPhase] = useState(false);
    // const [previousFromDefinitive, setPreviousFromDefinitive] = useState(false);

    const [methodsMissingCount, setMethodsMissingCount] = useState(0);
    const [methodsIncompleteCount, setMethodsIncompleteCount] = useState(0);
    const [methodsLoaded, setMethodsLoaded] = useState(false);
    const [activeEpochs, setActiveEpochs] = useState([]);

    const [creatingCopy, setCreatingCopy] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [ucFilter, setUCFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLegendModal, setShowLegendModal] = useState(false);
    const [evaluationTypes, setEvaluationTypes] = useState([]);


    const handleUCFilterChange = (event) => {
        setUCFilter(event.target.value);
        filterData(event.target.value, methodFilter);
    };

    const handleClearUCFilter = () => {
        setUCFilter('');
        filterData('', methodFilter);
    };

    const handleMethodFilterChange = (event) => {
        setMethodFilter(event.target.value);
        filterData(ucFilter, event.target.value);
    };

    const handleClearMethodFilter = () => {
        setMethodFilter('');
        filterData(ucFilter, '');
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const filterData = (ucFilter, methodFilter) => {
        const filtered = data.filter(item =>
            removeAccents(item.course_unit_name.toLowerCase()).includes(removeAccents(ucFilter.toLowerCase())) &&
            removeAccents(item.method_initials.toLowerCase()).includes(removeAccents(methodFilter.toLowerCase()))
        );
        setFilteredData(filtered);
    };

    const handleShowModalLogs = () => {
        axios.get('/calendar-logs/' + calendarId).then((response) => {
            if (response.status === 200) {
                setData(response.data.data)
                setFilteredData(response.data.data)
                setShowModal(true)
            }else{
                toast(t('Ocorreu um erro ao tentar obter os logs do calendário!'), errorConfig);
            }
        });
    };

    const handleCloseModal = () => setShowModal(false);

    const handleDelete = () => {
        setShowModal(false)
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        axios.delete('/calendar-logs/' + calendarId).then((response) => {
            if (response.status === 200) {
                toast(t('Logs apagados com sucesso!'), successConfig);
            } else {
                toast(t('Ocorreu um erro ao tentar apagar os logs!'), errorConfig);
            }
        });
        setShowConfirmation(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setShowModal(true);
    };
    const createCopy = () => {
        SweetAlertComponent.fire({
            title: t('Atenção!'),
            html: t('Ao criar uma cópia deste calendário, irá eliminar todas as cópias criadas anteriormente deste mesmo calendário!<br/><br/><strong>Tem a certeza que deseja criar uma cópia do calendário?</strong>'),
            denyButtonText: t('Não'),
            confirmButtonText: t('Sim'),
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: '#21ba45',
            denyButtonColor: '#db2828',
        }).then((result) => {
            if (result.isConfirmed) {
                setCreatingCopy(true);
                axios.post(`/calendar/${calendarId}/copy`).then((res) => {
                    setCreatingCopy(false);
                    if (res.status === 200) {
                        toast(t('Cópia do calendário criada com sucesso!'), successConfig);
                        navigate('/calendario/'+res.data);
                    } else {
                        toast(t('Ocorreu um erro ao tentar criar uma cópia do calendário!'), errorConfig);
                    }
                });
            }
        });
    };


    useEffect(() => {
        setMethodsLoaded(false);
        const missing = warnings.filter((item) => !item.has_methods);
        setMethodsMissingCount(missing.length);

        let countIncomplete = 0;
        const incomplete = warnings.filter((item) => item.has_methods && !item.is_complete);
        incomplete.map((item) => {
            countIncomplete = countIncomplete + item.methods.filter((method) => !method.is_done).length;
        });
        setMethodsIncompleteCount(countIncomplete);
        setMethodsLoaded(true);
    }, [warnings]);

    useEffect(() => {
        if (phase?.id > 0) {
            setCalendarPhase(phase?.id);
        }
    }, [phase]);

    useEffect(() => {
        if (typeof calendarPhase === 'number' && calendarPhase <= 0) {
            setCalendarPermissions(JSON.parse(localStorage.getItem('calendarPermissions'))?.filter((perm) => perm.phase_id === calendarPhase) || []);
        }
    }, [calendarPhase]);

    useEffect(() => {
        setMethodsLoaded(false);
        axios.get('/calendar-phases').then((response) => {
            if (response.status === 200) {
                setCalendarPhases(
                    response.data.data?.map(({id, description, name}) => ({
                        key: id,
                        value: id,
                        text: description,
                        name,
                    })),
                );
            }
        });
        fetchEvaluationTypes();
    }, []);

    const openRevisionModalHandler = () => {
        setOpenRevisionModal(true);
    }
    const closeRevisionModalHandler = () => {
        setOpenRevisionModal(false);
    }

    const openSubmitModalHandler = () => {
        setOpenSubmitModal(true);
    }

    const closeSubmitModalHandler = () => {
        setOpenSubmitModal(false);
    }

    const updateToPhase = (isAccepted, message) => {
        axios.post(`/calendar/${calendarId}/approval`, {
                'accepted': isAccepted,
                'message': message
            }).then((response) => {
                if (response.status === 200) {
                    toast(t('Fase do calendário atualizada!'), successConfig);
                    document.location.reload();
                } else {
                    toast(t('Ocorreu um erro ao tentar atualizar o calendário!'), errorConfig);
                }
            });
    }

    const acceptCalendarHandler = () => {
        updateToPhase(true, '');
    }

    const rejectCalendarHandler = () => {
        // TODO: When we have more time, we can add a way for the user to add a message when they reject
        updateToPhase(false, '');
    }

    const updatePhaseHandler = (newPhase) => {
        setCalendarPhase(newPhase);
        phase.id =  newPhase;
        updatePhase(phase.id);
    }

    useEffect(() => {
        let initialEpochs = [];
        epochs.forEach((epoch) => {
            initialEpochs.push(epoch.id);
        });
        //set epochs showing
        setActiveEpochs(initialEpochs);
    }, [epochs]);

    const showingEpochsHandle = (epochId) => {
        if(activeEpochs.includes(epochId)) {
            setActiveEpochs(prev => prev.filter(item => item !== epochId));
        } else {
            setActiveEpochs(prev => [...prev, epochId])
        }
    }

    useEffect(() => {
        epochsViewHandler(activeEpochs);
    }, [activeEpochs]);


    const scrollToTodayHandler = (event) => {
        event.preventDefault();

        var currentWeekEl = document.querySelector('.current-week');
        if( !currentWeekEl ) {
            toast( t('A data de hoje não existe neste calendário.'), errorConfig);
            return false;
        }
        else {
            var offsetTop = currentWeekEl.offsetTop;
            var topSpace = 120;
            window.scroll({
                top: (offsetTop + topSpace),
                behavior: 'smooth'
            });
        }
    }

    const checkPermissionByPhase = (permissionToCheck) => {
        let phaseFound = JSON.parse(localStorage.getItem('calendarPermissions'))?.filter((x) => x.name === permissionToCheck)[0];
        return phaseFound?.phases.includes(calendarPhase);
    }

    const fetchEvaluationTypes = () => {
        axios.get('/evaluation-types').then((res) => {
            if (res.status === 200) {
                setEvaluationTypes(res.data.data);
            }
        });
    }

    return (
        <>
            <div className='main-content-title-section'>
                <div className='main-content-title'>
                    <Header as="h3">
                        {calendarInfo && (<>{ t('Calendário de Avaliação') } - { calendarInfo.semester } <small>({ calendarInfo.academic_year })</small></>)}
                        {course && (<div className='heading-description'>{ course.initials } - { course.display_name }</div>)}
                    </Header>
                </div>
                <div className='main-content-actions'>
                    { !isLoading && (
                        (!isPublished && !isTemporary) ? (
                            <Grid>
                                {checkPermissionByPhase(SCOPES.CHANGE_CALENDAR_PHASE) && (
                                        <GridRow>
                                            <Button color="teal"
                                                    onClick={openSubmitModalHandler}>{t('Submeter')}</Button>
                                        </GridRow>
                                    )}
                                {checkPermissionByPhase(SCOPES.APPROVE_PUBLICATION) &&
                                    (localStorage.getItem('selectedGroup')?.includes(GROUPS.BOARD) || localStorage.getItem('selectedGroup')?.includes(GROUPS.GOP)) && (
                                        <GridRow>
                                            <ButtonGroup>
                                                <Button color="red"
                                                        onClick={rejectCalendarHandler}>{t('Necessário reformulação')}</Button>
                                                <Button color="green"
                                                        onClick={acceptCalendarHandler}>{t('Aprovar')}</Button>
                                            </ButtonGroup>
                                        </GridRow>
                                    )}
                                <GridRow>
                                    <ButtonGroup>
                                        <Button toggle active={myUCsOnly} onClick={() => setMyUCsOnly(true)}>
                                            {t('Minhas Avaliações')}
                                        </Button>
                                        <Button toggle active={!myUCsOnly} onClick={() => setMyUCsOnly(false)}>
                                            {t('Todos')}
                                        </Button>
                                    </ButtonGroup>
                                </GridRow>
                            </Grid>
                        ) : (
                            <Grid >

                                <ShowComponentIfAuthorized permission={[SCOPES.CREATE_COPY]}>
                                    <GridRow>
                                    <Button color="orange" loading={creatingCopy} onClick={createCopy} className={"copy-button"}
                                            labelPosition={"right"} icon>{t('Criar um cópia desta versão')} <Icon
                                        name={"copy outline"}/></Button>
                                    </GridRow>
                                </ShowComponentIfAuthorized>

                                <GridRow>
                                    <ButtonGroup className={"evaluation-buttons"}>
                                        <Button toggle active={myUCsOnly} onClick={() => setMyUCsOnly(true)}>
                                            {t('Minhas Avaliações')}
                                        </Button>
                                        <Button toggle active={!myUCsOnly} onClick={() => setMyUCsOnly(false)}>
                                            {t('Todos')}
                                        </Button>
                                    </ButtonGroup>
                                </GridRow>
                            </Grid>
                        )
                    )}
                </div>
            </div>
            <div className='main-sticky-section'>
                <Sticky offset={24} >
                    <Card fluid >
                        <Card.Content>
                            <Grid columns={'equal'} divided>
                                <GridColumn>
                                    { hasCurrentWeek && (
                                        <div style={{float: 'right'}}>
                                            <a onClick={scrollToTodayHandler} title="click to scroll ">{ t('Esta semana') } <Icon name="paper plane outline" /></a>
                                        </div>
                                    )}
                                    <div>
                                        <Header as="h4">{ t('Legenda') }</Header>
                                    </div>
                                    { isLoading ? (
                                        <Placeholder>
                                            <Placeholder.Paragraph>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Paragraph>
                                        </Placeholder>
                                    ) : (
                                        <List divided relaxed>
                                            {epochs.map((epoch, index) => (
                                                <div className='legend-list-item' key={index}>
                                                    <div
                                                        className={'legend-list-item-square calendar-day-' + epoch.code}></div>
                                                    <Popup trigger={
                                                        <div className='legend-list-item-content'>
                                                            <Icon name="calendar alternate outline"/>
                                                            <span className={"padding-left-xs"}>{epoch.name}</span>
                                                        </div>
                                                    } position='bottom center'>
                                                        <Popup.Content>
                                                            <b>{t("Ínicio")}:</b>{' '}{moment(epoch.start_date).locale(selectedLanguage).format('DD MMMM, YYYY')}
                                                            <br/>
                                                            <b>{t("Fim")}:</b>{' '}{moment(epoch.end_date).locale(selectedLanguage).format('DD MMMM, YYYY')}
                                                        </Popup.Content>
                                                    </Popup>
                                                    <div className="legend-list-item-actions">
                                                        <Button icon size='mini'
                                                                onClick={() => showingEpochsHandle(epoch.id)}
                                                                title={(activeEpochs.includes(epoch.id) ? t("Ocultar época") : t("Mostrar época"))}>
                                                            <Icon
                                                                name={(activeEpochs.includes(epoch.id) ? "eye slash" : "eye")}/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className='legend-list-item'>
                                                <Popup trigger={
                                                    <div className='legend-list-item-content'>
                                                        <span className={"padding-left-xxl"}>{t("Tipos Avaliações")}</span>
                                                    </div>
                                                } position='bottom center'>
                                                </Popup>
                                                <div className="legend-list-item-actions">
                                                    <Button icon size='mini'
                                                            onClick={() => setShowLegendModal(true)}
                                                            title={t("Mostrar Legenda")}>
                                                        <Icon
                                                           name={("eye")}/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </List>
                                        )}
                                </GridColumn>
                                <ShowComponentIfAuthorized permission={[SCOPES.VIEW_CALENDAR_INFO]}>
                                    <GridColumn>
                                        <ShowComponentIfAuthorized permission={[SCOPES.VIEW_ACTUAL_PHASE]}>
                                            { isLoading ? (
                                                <Placeholder>
                                                    <Placeholder.Paragraph>
                                                        <Placeholder.Line />
                                                        <Placeholder.Line />
                                                    </Placeholder.Paragraph>
                                                </Placeholder>
                                            ) : (
                                                <div>
                                                    <span>
                                                        <Header as="h5">{ t('Fase') }:</Header>
                                                    </span>
                                                    <div className='margin-top-xs'>
                                                        {calendarPhases.find((x) => x.key === calendarPhase)?.text || phase?.description}
                                                    </div>
                                                </div>
                                            )}
                                        </ShowComponentIfAuthorized>
                                        <ShowComponentIfAuthorized permission={[SCOPES.VIEW_CALENDAR_INFO]}>
                                            { isLoading ? (
                                                <Placeholder>
                                                    <Placeholder.Paragraph>
                                                        <Placeholder.Line />
                                                        <Placeholder.Line length={"very short"}/>
                                                    </Placeholder.Paragraph>
                                                </Placeholder>
                                            ) : (
                                                <div className='margin-top-base'>
                                                    <span>
                                                        <Header as="h5">{ t('Estado') }:</Header>
                                                    </span>
                                                    <div className='margin-top-xs'>
                                                        { !isPublished && !isTemporary ? (
                                                            <Label color={"blue"}>{ t("Nao Publicado") }</Label>
                                                        ) : (
                                                            <Label color={isTemporary ? 'grey' : 'green' }>{isTemporary ? t('Provisório') : t('Definitivo')}</Label>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </ShowComponentIfAuthorized>
                                    </GridColumn>
                                </ShowComponentIfAuthorized>
                                <GridColumn>
                                    { isLoading ? (
                                        <Placeholder>
                                            <Placeholder.Paragraph>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Paragraph>
                                            <Placeholder.Paragraph>
                                                <Placeholder.Line />
                                                <Placeholder.Line />
                                            </Placeholder.Paragraph>
                                        </Placeholder>
                                    ) : (
                                        <div>
                                            <div>
                                                <div className='display-flex'>
                                                    <span>
                                                        <Header as="h5">{t('Última alteração')}:</Header>
                                                    </span>
                                                    <ShowComponentIfAuthorized permission={SCOPES.SEE_LOGS}>
                                                        <button className="ui circular big icon button"
                                                                style={{padding: 0, marginLeft: 10}}
                                                                data-tooltip="Ver logs" onClick={handleShowModalLogs}>
                                                            <i className="icon info circle"
                                                               style={{cursor: 'pointer'}}></i>
                                                        </button>
                                                    </ShowComponentIfAuthorized>
                                                </div>

                                                <div className='margin-top-xs'>
                                                    {moment(calendarInfo?.calendar_last_update).locale(selectedLanguage).format('DD MMMM, YYYY HH:mm')}
                                                </div>
                                            </div>

                                            <div className='margin-top-base'>
                                                <span>
                                                    <Header as="h5">{ t('Versão') }:</Header>
                                                </span>
                                                <div className='margin-top-xs'>
                                                    { t('Versão') + " " + (calendarInfo?.version ? calendarInfo.version : '') }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </GridColumn>
                                { (!isPublished && !isTemporary) && (
                                    <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSE_UNITS, SCOPES.ADD_EXAMS]}>
                                        <GridColumn width={5} className={ 'revision-column-wrapper' + (methodsLoaded ? ( (methodsIncompleteCount > 0 || methodsMissingCount > 0) ? " revision-warning" : " revision-success") : " revision-loading") }>
                                            { isLoading ? (
                                                <Placeholder>
                                                    <Placeholder.Paragraph>
                                                        <Placeholder.Line />
                                                    </Placeholder.Paragraph>
                                                    <Placeholder.Paragraph>
                                                        <Placeholder.Line />
                                                        <Placeholder.Line />
                                                        <Placeholder.Line length={'very short'}/>
                                                    </Placeholder.Paragraph>
                                                </Placeholder>
                                            ) : (
                                                <div>
                                                    <Header as="h5">
                                                        { t("Revisão") }:
                                                    </Header>
                                                    { methodsLoaded ? ( (methodsIncompleteCount > 0 || methodsMissingCount > 0) ? (
                                                        <>
                                                            <div className="revision-column-icon">
                                                                <Icon name="warning sign" color="yellow"/>
                                                            </div>
                                                            <div className="revision-column-content">
                                                                <ul className="margin-top-base">
                                                                    <li>{ t('Existem') +" "+ methodsIncompleteCount + " " + t('elementos de avaliação por submeter') }.</li>
                                                                    <li>{ t('Existem') +" "+ methodsMissingCount + " " + t('UCs com') + " " }<a href={ "/unidade-curricular?curso=" + course?.id} target="_blank">{ t('métodos')} <Icon name="external alternate" /></a> { t('por preencher') }.</li>
                                                                </ul>
                                                            </div>
                                                            <div className={"text-center"}>
                                                                <a href="#" onClick={openRevisionModalHandler} >{ t('ver detalhe') }</a>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="revision-column-icon">
                                                                <Icon name={"check circle outline"} color={"green"}/>
                                                            </div>
                                                            <div className="revision-column-content">
                                                                <div className="margin-top-l">
                                                                    <div >{ t("Todas as avaliações marcadas!") }</div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) ) : (
                                                        <>
                                                            <div className="revision-column-icon">
                                                                <Icon name={"download"} color={"blue"}/>
                                                            </div>
                                                            <div className="revision-column-content">
                                                                <div className="margin-top-l">
                                                                    <div >{ t("A carregar detalhes!") }</div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </GridColumn>
                                    </ShowComponentIfAuthorized>
                                )}
                            </Grid>
                        </Card.Content>
                    </Card>
                </Sticky>
            </div>
            <Modal
                open={showLegendModal}
                onClose={()=> setShowLegendModal(false)}
                size='small'
            >
                <Header icon>
                    {/*<Icon name='archive' />*/}
                    {t("Tipos Avaliações")}
                </Header>
                <ModalContent className={"center"}>
                    <List divided relaxed>
                        {evaluationTypes.map((evaluationType, index) => (
                            <div key={index}>
                                <ListItem  className={"center"}>
                                    <span
                                        className={"center"}>{i18n.language == 'en' ? evaluationType.initials_en + " - " + evaluationType.name :
                                            evaluationType.initials_pt + " - " + evaluationType.name}
                                    </span>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                </ModalContent>
            </Modal>
            <ShowComponentIfAuthorized permission={[SCOPES.SEE_LOGS]}>
                <Modal open={showModal} onClose={handleCloseModal} size="fullscreen">
                    <Modal.Header>
                        Logs do calendário
                        <ShowComponentIfAuthorized permission={[SCOPES.DELETE_LOGS]}>
                            <Icon name="trash" onClick={handleDelete} style={{ float: 'right', cursor: 'pointer' }} />

                        </ShowComponentIfAuthorized>
                    </Modal.Header>
                    <Modal.Content>
                       <Input
                           placeholder="Filtrar por UC..."
                           value={ucFilter}
                           onChange={handleUCFilterChange}
                           style={{ marginRight: '10px' }}
                           icon={<Icon name="x" link onClick={handleClearUCFilter} />}
                       />
                        <Input
                            placeholder="Filtrar por método..."
                            value={methodFilter}
                            onChange={handleMethodFilterChange}
                            icon={<Icon name="x" link onClick={handleClearMethodFilter} />}
                        />
                        <Table celled >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Ano Curricular</Table.HeaderCell>
                                    <Table.HeaderCell>Época</Table.HeaderCell>
                                    <Table.HeaderCell>UC</Table.HeaderCell>
                                    <Table.HeaderCell>Método</Table.HeaderCell>
                                    <Table.HeaderCell>Ação</Table.HeaderCell>
                                    <Table.HeaderCell>Data do exame</Table.HeaderCell>
                                    <Table.HeaderCell>Data da ação</Table.HeaderCell>
                                    <Table.HeaderCell>User</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {filteredData.map((item) => {
                                    let action, data = '';
                                    if (item.is_create === 1){
                                        action = 'adicionou o exame'
                                        data = item.new_date
                                    }else if(item.is_update === 1){
                                        action = 'alterou a data do exame'
                                        data = 'para ' + item.new_date
                                    }else{
                                        action = 'removeu o exame'
                                        data = item.new_date
                                    }
                                    return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.academic_year}</Table.Cell>
                                        <Table.Cell>{item.epoch_name}</Table.Cell>
                                        <Table.Cell>{item.course_unit_name}</Table.Cell>
                                        <Table.Cell>{item.method_initials}</Table.Cell>
                                        <Table.Cell>{action}</Table.Cell>
                                        <Table.Cell>{data}</Table.Cell>
                                        <Table.Cell>{item.created_at}</Table.Cell>
                                        <Table.Cell>{item.author}</Table.Cell>
                                    </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleCloseModal}>Fechar</Button>
                    </Modal.Actions>
                </Modal>
            </ShowComponentIfAuthorized>
            <ShowComponentIfAuthorized permission={[SCOPES.CHANGE_CALENDAR_PHASE, SCOPES.PUBLISH_CALENDAR]}>
                <PopupSubmitCalendar isOpen={openSubmitModal} onClose={closeSubmitModalHandler} calendarId={calendarId} currentPhaseId={phase?.id} updatePhase={updatePhaseHandler}/>
            </ShowComponentIfAuthorized>
            <ShowComponentIfAuthorized permission={[SCOPES.DELETE_LOGS]}>
                <Modal open={showConfirmation}>
                    <Modal.Header>Confirmação</Modal.Header>
                    <Modal.Content>
                        <p>Deseja apagar todas as logs relacionadas com este calendário? </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={handleConfirmDelete}>Apagar</Button>
                        <Button onClick={handleCancelDelete}>Cancelar</Button>
                    </Modal.Actions>
                </Modal>
            </ShowComponentIfAuthorized>
            <ShowComponentIfAuthorized permission={[SCOPES.ADD_EXAMS, SCOPES.EDIT_EXAMS, SCOPES.REMOVE_EXAMS, SCOPES.EDIT_COURSE_UNITS]}>
                <PopupRevisionDetail isOpen={openRevisionModal} onClose={closeRevisionModalHandler} warnings={warnings}/>
            </ShowComponentIfAuthorized>
        </>
    );
};

export default InfosAndActions;
