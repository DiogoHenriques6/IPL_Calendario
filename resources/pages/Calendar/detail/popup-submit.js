import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {useTranslation} from "react-i18next";
import { Button, Modal, Header, Icon, Divider, Checkbox, Form, Label, Loader, Dimmer, Grid, GridColumn } from 'semantic-ui-react';
import {toast} from 'react-toastify';

import {errorConfig, successConfig} from '../../../utils/toastConfig';
import SCOPES from "../../../utils/scopesConstants";
import ShowComponentIfAuthorized from "../../../components/ShowComponentIfAuthorized";

const PopupSubmit = ( {isOpen, onClose, calendarId, currentPhaseId, updatePhase} ) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [calendarPhases, setCalendarPhases] = useState([]);
    const [calendarGroups, setCalendarGroups] = useState([]);
    const [calendarPhase, setCalendarPhase] = useState(currentPhaseId);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(false);
    const [isTemporary, setIsTemporary] = useState(false);
    const [groupViewersLoading, setGroupViewersLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [isEditingPhase, setIsEditingPhase] = useState(1);
    const [isEvaluationPhase, setIsEvaluationPhase] = useState(4);

    useEffect(() => {
        setIsLoading(true);
        setGroupViewersLoading(true);              
    }, []);

    useEffect(() => {
        if( isLoading ){
            if (!currentPhaseId) {
                return false;
            }            
            axios.get('/calendar-phases-full?phase-id=' + currentPhaseId).then((response) => {
                if (response.status === 200) {
                    setCalendarPhases(
                        response.data?.phases.map(({id, description, name}) => ({
                            key: id,
                            value: id,
                            text: description,
                            name,
                        })),
                    );
                    setCalendarGroups(response.data?.groups);
                    setGroupViewersLoading(false);
                    setIsLoading(false);
                }
            });
        }  
        else {
            let currentPhase = calendarPhases.filter((phase) => phase.value === currentPhaseId)[0];

            if( currentPhase.text.indexOf('Em edição') === 0 || currentPhase.text.indexOf('In edit') === 0) {
                setIsEditing(true);
                setIsEditingPhase(currentPhase.value);
            } else {
                setIsEditing(false);
                setIsEvaluationPhase(currentPhase.value);
            }
        }
    }, [currentPhaseId]);


    useEffect(() => {
        if(!isLoading) {
            setGroupViewersLoading(true);
            axios.get('/calendar-phases-full/groups?phase-id=' + calendarPhase).then((response) => {
                if (response.status === 200) {
                    setCalendarGroups(response.data?.data);
                    setGroupViewersLoading(false);
                }
            });
        }
    }, [calendarPhase]);

    const publishCalendar = () => {
        //setIsPublished(true);
        //setIsTemporary(true);
        //onSave();
        axios.post(`/calendar/${calendarId}/publish`).then((res) => {
            if (res.status === 200) {
                toast(t('Calendário publicado com sucesso!'), successConfig);
                onClose();
                if ( localStorage.getItem('groups')?.indexOf('coordinator') >= 0 ) {
                    navigate('/calendario/'+res.data);
                } else {
                    document.location.reload();
                }
            } else {
                toast(t('Ocorreu um erro ao tentar publicar o calendário!'), errorConfig);
            }
        });
    };

    const onSave = () => {
        const viewGroups = calendarGroups.filter((item) => item.selected).map((item) => item.id);
        // setUpdatingCalendarPhase(true);
        axios.patch(`/calendar/${calendarId}`, {
            'calendar_phase_id': calendarPhase,
            'temporary': isTemporary,
            'published': isPublished,
            'groups': viewGroups
        }).then((response) => {
            if (response.status === 200) {
                toast(t('Fase do calendário atualizada!'), successConfig);
            }
        });
        updatePhase(calendarPhase);
        onClose();
    }

    const handleGroupChange = (groupId, checked) => {
        setCalendarGroups((current) => {
            const oldList = [...current];
            oldList.forEach((item) => item.selected = (item.id === groupId ? checked : item.selected));
            return oldList;
        });
    }

    const checkPermissionByPhase = (permissionToCheck) => {
        let phaseFound = JSON.parse(localStorage.getItem('calendarPermissions'))?.filter((x) => x.name === permissionToCheck)[0];
        return phaseFound?.phases.includes(currentPhaseId);
    }

    return (
        <Modal closeOnEscape closeOnDimmerClick open={isOpen} onClose={onClose}>
            <Modal.Header>{ t("Submeter calendário para a próxima fase") }</Modal.Header>
            <Modal.Content>
                <Grid>
                    <GridColumn width={2}>
                        <div>{ t("Fase atual") }:</div>
                    </GridColumn>
                    <GridColumn width={14}>
                        <Label color="blue">{ calendarPhases.filter((phase) => phase.value === currentPhaseId)[0]?.text }</Label>
                    </GridColumn>
                </Grid>
                { checkPermissionByPhase(SCOPES.CHANGE_CALENDAR_PHASE) ? (
                    <>
                        <div className='margin-top-base'>
                            { t("Selecionar próxima fase") }:
                        </div>
                        <div className='margin-top-s'>
                            <Button.Group>
                                <Button positive={isEditing} onClick={(e) => setIsEditing(true)}>
                                    <Icon name="edit" />{ t("Em edição") }
                                </Button>
                                <Button positive={!isEditing} onClick={(e) => setIsEditing(false)}>
                                    <Icon name="eye" />{ t("Em avaliação") }
                                </Button>
                            </Button.Group>
                        </div>

                        { isEditing ? (
                            <>
                                <div className='margin-top-m'>
                                    <Button.Group>
                                        {calendarPhases.filter((x) => x.text.indexOf('Em edição')  === 0 || x.text.indexOf('In edit')  === 0)?.map((phase) => {
                                            return (
                                                <Button positive={isEditingPhase === phase.value} onClick={(e) => {
                                                        setIsEditingPhase(phase.value);
                                                        setCalendarPhase(phase.value);
                                                    }} key={phase.value}>
                                                    { phase.text.substr(phase.text.indexOf('(')+1, phase.text.length).replace(')', '') }
                                                </Button>
                                            );
                                        })}
                                    </Button.Group>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='margin-top-m'>
                                    <Button.Group>
                                        {calendarPhases.filter((x) => x.text.indexOf('Em avaliação')  === 0 || x.text.indexOf('Under evaluation')  === 0)?.map((phase) => {
                                            return (
                                                <Button positive={isEvaluationPhase === phase.value} onClick={(e) => {
                                                        setIsEvaluationPhase(phase.value);
                                                        setCalendarPhase(phase.value);
                                                    }} key={phase.value}>
                                                    { phase.text.substring(phase.text.indexOf('(')+1, phase.text.length).replace(')', '') }
                                                </Button>
                                            );
                                        })}
                                    </Button.Group>
                                </div>
                            </>
                        ) }
                        <Divider />
                        <ShowComponentIfAuthorized permission={SCOPES.CHANGE_CALENDAR_PHASE}>
                            <Form>
                                <Grid columns={2} divided={false}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Header as={"h4"}>
                                                <Icon name={"users"} size={"big"} color={"grey"}/>
                                                { t("Grupos que podem visualizar o calendario") }
                                            </Header>
                                            <Form.Group grouped>
                                                { isPublished ? (
                                                    <div>{ t("Todos os grupos irão ver este calendario") }</div>
                                                ) : (
                                                    <>
                                                        { calendarGroups && calendarGroups.map((item, indexGroup) => (
                                                            <Form.Field key={indexGroup}>
                                                                <Checkbox label={item.name} checked={item.selected}
                                                                        onChange={(e, {checked}) => handleGroupChange(item.id, checked)} />
                                                            </Form.Field>
                                                        ))}
                                                    </>
                                                )}
                                                { groupViewersLoading && (
                                                    <Dimmer active inverted>
                                                        <Loader indeterminate>{t('A carregar grupos')}</Loader>
                                                    </Dimmer>
                                                )}
                                            </Form.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </ShowComponentIfAuthorized>
                    </>
                ) : (
                    <>
                        <div key="empty-table">
                            <div className={"empty-table-row"}>
                                <div className='empty-table-row-content'>
                                    <div className={"margin-bottom-l"}>
                                        <Icon size='huge' color='red' name='dont'/>
                                    </div>
                                    <Header as='h3' className={"margin-y-l"}>{ t("Não tem permissão para mudar de fase do calendário") }</Header>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
            </Modal.Content>
            <Modal.Actions>
                <ShowComponentIfAuthorized permission={[SCOPES.PUBLISH_CALENDAR]} >
                    <Button onClick={publishCalendar} color={"blue"} floated={"left"} icon labelPosition={"right"}>{t('Publicar esta versão do calendário')} <Icon name={"calendar check outline"}/></Button>
                </ShowComponentIfAuthorized>
                <Button onClick={onClose}>{t('Fechar')}</Button>
                { checkPermissionByPhase(SCOPES.CHANGE_CALENDAR_PHASE) && (
                    <Button onClick={onSave} color={"green"}>{t('Guardar')}</Button>
                )}
            </Modal.Actions>
        </Modal>
    );
};
export default PopupSubmit;