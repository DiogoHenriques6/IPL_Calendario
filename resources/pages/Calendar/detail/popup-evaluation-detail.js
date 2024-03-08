import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Button, Form, Header, Icon, List, Modal, Comment, Divider, Segment, Dimmer, Loader, Dropdown} from 'semantic-ui-react';
import {toast} from 'react-toastify';

import ShowComponentIfAuthorized from '../../../components/ShowComponentIfAuthorized';
import SCOPES from '../../../utils/scopesConstants';
import {errorConfig, successConfig} from '../../../utils/toastConfig';

const PopupEvaluationDetail = ( {isPublished, isOpen, currentPhaseId, onClose, examId} ) => {
    // const history = useNavigate();
    const { t } = useTranslation();

    const [examDetailObject, setExamDetailObject] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [showIgnoredComments, setShowIgnoredComments] = useState(false);
    const [commentText, setCommentText] = useState(undefined);
    const [commentsList, setCommentsList] = useState([]);

    useEffect(() => {
        if(examId) {
            loadExamDetails(examId);
        }
    }, [examId]);

    const loadExamDetails = (examId) => {
        setIsLoading(true);
        axios.get(`/exams/${examId}`).then((response) => {
                if (response?.status >= 200) {
                    setExamDetailObject(response.data.data);
                    setCommentsList(response.data.data.comments);
                    setIsLoading(false);
                }
            }).catch((error) => {
                toast(t('Ocorreu um erro no load da avaliação'), errorConfig);
                toast(error, errorConfig);
            });
    };

    const getCalendarEvent = (type) => {
        axios.get(`/exams/${examId}/calendar-event?type=${type}`).then((response) => {
            if (response?.status >= 200) {
                console.log(response.data);
                window.open(response.data);//, '_blank');//.focus();

                var blob = new Blob([icsMSG], { type: 'text/calendar;charset=utf-8' });
                window.navigator.msSaveOrOpenBlob(blob, 'download.ics');
            }
        }).catch((error) => {
            toast(t('Ocorreu um erro no load do evento do calendario'), errorConfig);
            toast(error, errorConfig);
        });
    };

    const closeModalHandler = () => {
        setExamDetailObject({});
        setCommentsList([]);
        onClose();
    };

    const addComment = (examId) => {
        if(!commentText || commentText.trim().length == 0) {
            toast(t('O comentário não pode estar vazio!'), errorConfig);
            return false;
        }

        axios.post('/comment/', {
            exam_id: examId,
            comment: commentText,
        }).then((res) => {
            if (res.status === 201) {
                setCommentText('');
                toast(t('O comentário foi adicionado com sucesso!'), successConfig);
                setCommentsList(res.data);
            } else {
                toast(t('Ocorreu um erro ao adicionar o comentário!'), errorConfig);
            }
        });
    };

    const hideCommentHandler = (commentId) => {
        axios.post(`/comment/${commentId}/hide`).then((res) => {
            if (res.status === 200) {
                toast(t('Comentário escondido com sucesso!'), successConfig);
                setCommentsList(res.data);
            } else {
                toast(t('Ocorreu um erro ao esconder o comentário!'), errorConfig);
            }
        });
    };

    const showCommentHandler = (commentId) => {
        axios.post(`/comment/${commentId}/show`).then((res) => {
            if (res.status === 200) {
                toast(t('Comentário mostrado com sucesso!'), successConfig);
                setCommentsList(res.data);
            } else {
                toast(t('Ocorreu um erro ao mostrar o comentário!'), errorConfig);
            }
        });
    };

    const deleteCommentHandler = (commentId) => {
        axios.delete(`/comment/${commentId}`).then((res) => {
            if (res.status === 200) {
                toast(t('Comentário eliminado com sucesso!'), successConfig);
                setCommentsList(res.data);
            } else {
                toast(t('Ocorreu um erro ao eliminar o comentário!'), errorConfig);
            }
        });
    };

    const checkIfAuthorized = (permission) => {
        const userScopes = JSON.parse(localStorage.getItem('scopes'));
        if(userScopes){
            if (Array.isArray(permission)) {
                if (permission.some((per) => userScopes.includes(per))) {
                    return true;
                }
            } else {
                return userScopes.includes(permission);
            }
        }
        return false;
    };

    const checkPermissionByPhase = (permissionToCheck) => {
        let phaseFound = JSON.parse(localStorage.getItem('calendarPermissions'))?.filter((x) => x.name === permissionToCheck)[0];
        return phaseFound?.phases.includes(currentPhaseId);
    }

    return (
        <Modal closeOnEscape closeOnDimmerClick open={isOpen} onClose={closeModalHandler} size={ !checkIfAuthorized([SCOPES.VIEW_COMMENTS]) ? 'tiny' : 'large'}>
            <Modal.Header>
                { t('Detalhes da avaliação') }
                <span className='heading-description'>{ examDetailObject?.method?.description ? " (" + examDetailObject?.method?.description + ")": '' }</span>
            </Modal.Header>
            <Modal.Content>
                { isLoading && (
                    <Dimmer active inverted>
                        <Loader indeterminate>
                            { t("A carregar informação") }
                        </Loader>
                    </Dimmer>
                )}
                { !isLoading && (
                    <div className='exam-detail-modal'>
                        <div className='exam-detail-info'>
                            <List divided verticalAlign='middle'>
                                <List.Item>
                                    <List.Content><b>{ t('Curso')}: </b></List.Content>
                                    <List.Content floated='right'>
                                        {examDetailObject?.course_unit?.course?.name}
                                        <ShowComponentIfAuthorized permission={[SCOPES.VIEW_COURSES]}>
                                            <a href={"/curso/" + examDetailObject?.course_unit?.course?.id} target={"_blank"} className="margin-left-s" title={ t("Ver Curso") }>
                                                <Icon name={"external alternate"} />
                                            </a>
                                        </ShowComponentIfAuthorized>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>{ t('Ramo')}: </b></List.Content>
                                    <List.Content floated='right'>{examDetailObject?.course_unit?.branch?.name}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>{ t('Ano Curricular')}: </b></List.Content>
                                    <List.Content floated='right'>{ examDetailObject?.course_unit?.curricular_year ? (examDetailObject?.course_unit?.curricular_year + 'º Ano') : '-' }</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>{ t('Unidade Curricular')}: </b></List.Content>
                                    <List.Content floated='right'>
                                        {examDetailObject?.course_unit?.name}
                                        <ShowComponentIfAuthorized permission={[SCOPES.VIEW_COURSE_UNITS]}>
                                            <a href={"/unidade-curricular/detail/" + examDetailObject?.course_unit?.id} target={"_blank"} className="margin-left-s" title={ t("Ver Unidade Curricular") }>
                                                <Icon name={"external alternate"} />
                                            </a>
                                        </ShowComponentIfAuthorized>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>{ t('Responsável da UC')}: </b></List.Content>
                                    <List.Content floated='right'>{examDetailObject?.course_unit?.responsible?.name}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>{ t('Método de avaliação')}: </b></List.Content>
                                    <List.Content floated='right'>{examDetailObject?.method?.name}</List.Content>
                                </List.Item>


                                <List.Item>
                                    <List.Content><b>{ t('Data')}: </b></List.Content>
                                    <List.Content floated='right'>{ examDetailObject?.date_start === examDetailObject?.date_end ?
                                                    moment(examDetailObject?.date_start).format('DD MMMM, YYYY') : (
                                                        <>
                                                            <div>{moment(examDetailObject?.date_start).format('DD MMMM, YYYY')}</div>
                                                            <div>{moment(examDetailObject?.date_end).format('DD MMMM, YYYY')}</div>
                                                        </>
                                                    )}</List.Content>
                                </List.Item>
                                { examDetailObject?.in_class ? (
                                    <List.Item>
                                        <List.Content><b>{ t('Hora e sala')}: </b></List.Content>
                                        <List.Content floated='right'>{ t('Na aula')}</List.Content>
                                    </List.Item>
                                ) : (
                                    <>
                                        {examDetailObject?.hour && (
                                            <List.Item>
                                                <List.Content><b>{ t('Hora de ínicio')}: </b></List.Content>
                                                <List.Content floated='right'>{examDetailObject?.hour || '-'}</List.Content>
                                            </List.Item>
                                        )}
                                        <List.Item>
                                            <List.Content><b>{ t('Salas de avaliação')}: </b></List.Content>
                                            <List.Content floated='right'>{examDetailObject?.room || '-'}</List.Content>
                                        </List.Item>
                                    </>
                                )}
                                {examDetailObject?.duration_minutes && (
                                    <List.Item>
                                        <List.Content><b>{ t('Duração')}: </b></List.Content>
                                        <List.Content floated='right'>{ (examDetailObject?.duration_minutes + ' ' + t('minutos')) }</List.Content>
                                    </List.Item>
                                )}
                                <List.Item>
                                    <List.Content><b>{ t('Observações')}: </b></List.Content>
                                    <List.Content floated='right'>{examDetailObject?.observations || '-'}</List.Content>
                                </List.Item>
                            </List>
                        </div>
                        <div className='exam-detail-content'>
                            <ShowComponentIfAuthorized permission={[SCOPES.VIEW_COMMENTS]}>
                                <Comment.Group>
                                    <div className='exam-detail-content-header'>
                                        <div className='exam-detail-content-header-title'>
                                            <Header as="h3">{ t('Comentários')}</Header>
                                        </div>
                                        <div className='exam-detail-content-header-actions'>
                                            {!isPublished && (
                                                <>
                                                    { checkPermissionByPhase(SCOPES.ADD_COMMENTS) && (
                                                        <Button
                                                            content={ t('Adicionar comentário')}
                                                            labelPosition="right"
                                                            icon="send"
                                                            primary onClick={() => addComment(examDetailObject?.id)}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {!isPublished && (
                                        <>
                                            { checkPermissionByPhase(SCOPES.ADD_COMMENTS) && (
                                                <>
                                                    <Form reply className='focus--expander'>
                                                        <Form.TextArea rows={2} placeholder={ t('Adiciona aqui o teu comentário') } value={commentText} onChange={(ev, {value}) => setCommentText(value)}/>
                                                    </Form>
                                                    <Divider clearing />
                                                </>
                                            )}
                                        </>
                                    )}
                                    {commentsList?.filter((x) => (showIgnoredComments ? true : !x.ignored))?.map((comment, commentIndex) => (
                                        <Comment key={commentIndex} className={comment.ignored ? 'comment--ignored' : ''}>
                                            <Comment.Avatar src={`https://avatars.dicebear.com/api/initials/${comment.user.initials}.svg?w=50&h=50&mood[]=sad&mood[]=happy`}/>
                                            <Comment.Content>
                                                <Comment.Author as="span">{comment.user.name}</Comment.Author>
                                                <Comment.Metadata>
                                                    <div>{comment.date_label}</div>
                                                </Comment.Metadata>
                                                <Comment.Text>
                                                    {comment.comment}
                                                    { !!comment.ignored ? (
                                                        <div className='comment-ignored-icon'>
                                                            <Icon name="eye slash outline" title={t('Comentário escondido')} />
                                                        </div>
                                                    ) : ''}
                                                </Comment.Text>
                                                <Comment.Actions>
                                                    { checkPermissionByPhase(SCOPES.ADD_COMMENTS) && (
                                                        <>
                                                            {!comment.ignored && (
                                                                <Comment.Action onClick={() => hideCommentHandler(comment.id)}>
                                                                    { t('Esconder') }
                                                                </Comment.Action>
                                                            )}
                                                            { !!comment.ignored && (
                                                                <Comment.Action onClick={() => showCommentHandler(comment.id)}>
                                                                    { t('Mostrar') }
                                                                </Comment.Action>
                                                            )}
                                                        </>
                                                    )}
                                                    { moment(new Date()).diff(moment(comment.date), 'minutes') <= 15 && comment.user.id == localStorage.getItem('userId') && (
                                                        <>
                                                            <Comment.Action onClick={() => deleteCommentHandler(comment.id)} style={{color: 'red'}}>
                                                                { t('Remover') }
                                                            </Comment.Action>
                                                        </>
                                                    )}
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                    ))}
                                    { (commentsList?.length == 0 || (!showIgnoredComments && (
                                                (commentsList?.filter((x) => (x.ignored)).length > 0 && commentsList?.filter((x) => (!x.ignored)).length == 0))) ) &&
                                    (
                                        <Segment placeholder textAlign="center">
                                            <Header icon>
                                                <Icon name='comments outline' />
                                                <div>{ t('Não existem comentários para esta avaliação...')}</div>
                                            </Header>
                                            { commentsList?.filter((x) => (x.ignored)).length > 1 && (
                                                <div> { t('Existem') +" " + commentsList?.filter((x) => (x.ignored)).length + " " + t('comentários escondidos') }</div>
                                            ) }
                                            { commentsList?.filter((x) => (x.ignored)).length == 1 && (
                                                <div> { t('Existem') +" " + commentsList?.filter((x) => (x.ignored)).length + " " + t('comentário escondido') }</div>
                                            ) }
                                        </Segment>
                                    )}
                                </Comment.Group>
                            </ShowComponentIfAuthorized>
                        </div>
                    </div>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button.Group color='teal' floated={"left"}>
                    <Button href={"/exams/" + examId + "/calendar-event"} target={"_blank"}><Icon name={"calendar plus outline"} /> { t("Download evento") }</Button>
                    <Dropdown floating  className='button icon' trigger={<></>}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => getCalendarEvent("google") }>     <Icon name={"google"} /> Google</Dropdown.Item>
                            <Dropdown.Item onClick={() => getCalendarEvent("yahoo") }>      <Icon name={"yahoo"} /> Yahoo</Dropdown.Item>
                            <Dropdown.Item onClick={() => getCalendarEvent("webOutlook") }> <Icon name={"microsoft"} /> Evento webOutlook</Dropdown.Item>
                            <Dropdown.Item onClick={() => getCalendarEvent("webOffice") }>  <Icon name={"microsoft"} /> Evento webOffice</Dropdown.Item>
                            <Dropdown.Item  href={"/exams/" + examId + "/calendar-event?type=ics"} target={"_blank"}><Icon name={"file outline"} /> Ficheiro ICS</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Button.Group>

                { commentsList?.filter((x) => (x.ignored)).length > 0 && (
                    <ShowComponentIfAuthorized permission={[SCOPES.VIEW_COMMENTS]}>
                        <Button icon floated='left' color={!showIgnoredComments ? 'green' : 'red'} labelPosition="left" onClick={() => setShowIgnoredComments((cur) => !cur)}>
                            <Icon name={'eye' + (showIgnoredComments ? ' slash' : '') }/>
                            {!showIgnoredComments ? t('Mostrar escondidos') : t('Ocultar escondidos') }
                        </Button>
                    </ShowComponentIfAuthorized>
                )}
                <Button onClick={closeModalHandler}>{ t('Fechar') }</Button>
            </Modal.Actions>
        </Modal>
    );
};
export default PopupEvaluationDetail;
