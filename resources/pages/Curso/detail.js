import axios from 'axios';
import _ from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Container, Card, Icon, Form, Button, Dimmer, Loader, Header, Message } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import {Field, Form as FinalForm} from 'react-final-form';

import ShowComponentIfAuthorized, {useComponentIfAuthorized} from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import {successConfig, errorConfig} from '../../utils/toastConfig';
import CourseTabs from "./Tabs";
import Degree from "../../components/Filters/Degree";
import {useTranslation} from "react-i18next";

const Detail = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [courseDetail, setCourseDetail] = useState({});
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [coordinatorUser, setCoordinatorUser] = useState(undefined);
    const [searchCoordinator, setSearchCoordinator] = useState(false);
    const [hasCoordinator, setHasCoordinator] = useState(false);


    const hasPermissionToEdit = useComponentIfAuthorized([SCOPES.EDIT_COURSES]);
    const hasPermissionToDefineCoordinator = useComponentIfAuthorized(
        [SCOPES.DEFINE_COURSE_COORDINATOR],
    );

    const loadCourseDetail = () => {
        setLoading(true);
        axios.get(`/courses/${paramsId}`).then((res) => {
            setLoading(false);
            const {coordinator} = res.data.data;
            if(coordinator) {
                setHasCoordinator(true);
                setTeachers((current) => {
                    current.push({key: coordinator?.id, value: coordinator?.id, text: coordinator?.name});
                    return current;
                });
            }
            setCourseDetail(res.data.data);
            document.title = "Detalhe de Curso - " + "Calendários de Avaliação - IPLeiria";
        });
    };

    const handleSearchCoordinator = (e, {searchQuery}) => {
        setSearchCoordinator(true);
        axios.get(`/search/users?q=${searchQuery}`).then((res) => {
            setSearchCoordinator(false);
            if (res.status === 200) {
                setTeachers(res.data);
            }
        });
    };

    const setCoordinator = () => {
        axios.patch(`/courses/${paramsId}/coordinator`, {
            coordinator_user_name: coordinatorUser.name,
            coordinator_user_email: coordinatorUser.email,
        }).then((res) => {
            if (res.status === 200) {
                setCoordinatorUser(undefined);
                setHasCoordinator(true);
                toast(t('Guardou o coordenador de curso com sucesso!'), successConfig);
            } else {
                toast(t('Ocorreu um erro ao guardar o coordenador de curso!'), errorConfig);
            }
        });
    };

    useEffect(() => {
        if(/\d+/.test(paramsId)){
            loadCourseDetail();
        } else {
            navigate('/curso');
            toast(t('Ocorreu um erro ao carregar a informacao pretendida'), errorConfig);
        }
    }, [paramsId]);

    const onSaveCourse = ({code, name, initials, level, duration}) => {
        axios.patch(`/courses/${paramsId}`, {
            code,
            name,
            initials,
            degree: level,
            num_years: duration
        }).then((res) => {
            if (res.status === 200) {
                loadCourseDetail();
                toast(t('Curso atualizado com sucesso!'), successConfig);
            } else {
                toast(t('Ocorreu um erro ao gravar o curso!'), errorConfig);
            }
        });
    };

    const initialValues = useMemo(() => {
        const {code, name_pt, name_en, initials, degree_id, duration, coordinator} = courseDetail || {};
        return {code, name_pt, name_en, initials, degree_id, duration, coordinator: coordinator?.id};
    }, [courseDetail]);

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/curso"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            { !loading && initialValues && ((!initialValues?.coordinator && !hasCoordinator) || !initialValues?.initials || !initialValues?.degree_id ) && (
                <Message warning>
                    <Message.Header>{ t('Os seguintes detalhes do Curso precisam da sua atenção:') }</Message.Header>
                    <Message.List>
                        { (!initialValues?.coordinator || !hasCoordinator) && (
                            <Message.Item>{ t('É necessário configurar o docente Coordenador de Curso') }</Message.Item>
                        )}
                       {/* { !initialValues.initials && (
                            <Message.Item>{ t('É necessário configurar a Sigla do Curso') }</Message.Item>
                        )}
                        { !initialValues.degree_id && (
                            <Message.Item>{ t('É necessário configurar o Tipo de Curso') }</Message.Item>
                        )}*/}
                    </Message.List>
                </Message>
            )}
            <FinalForm initialValues={initialValues} onSubmit={onSaveCourse} render={({handleSubmit}) => (
                <Card fluid>
                    { loading && (
                        <Dimmer active inverted>
                            <Loader indeterminate>{t('A carregar o grupo')}</Loader>
                        </Dimmer>
                    )}
                    <Card.Content>
                        <div className='card-header-alignment'>
                            <Header as="span">{ t('Curso') + ": " + ( courseDetail?.display_name || "") }</Header>
                            <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right">
                                    <Icon name={'save'}/>
                                    { t('Guardar') }
                                </Button>
                            </ShowComponentIfAuthorized>
                        </div>
                    </Card.Content>
                    <Card.Content>
                        <Form>
                            <Form.Group widths="4">
                                <Field name="code">
                                    {({input: codeInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || loading || !hasPermissionToEdit} label={ t("Código") } {...codeInput}/>
                                    )}
                                </Field>
                                <Field name="initials">
                                    {({input: initialsInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || loading || !hasPermissionToEdit} label={ t("Sigla") } {...initialsInput}/>
                                    )}
                                </Field>
                                <Field name="degree_id">
                                    {({input: degreeIdInput}) => (
                                        <Degree className='input-readonly' disabled={true || loading || !hasPermissionToEdit} widthSize={6} eventHandler={(value) => degreeIdInput.onChange(value)} value={degreeIdInput.value} isSearch={false}/>
                                    )}
                                </Field>
                                <Field name="duration">
                                    {({input: durationInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || loading || !hasPermissionToEdit} label={ t("Número de anos") } {...durationInput}/>
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="3">
                                <Field name="name_pt">
                                    {({input: namePtInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || loading || !hasPermissionToEdit} label={ t("Nome PT") } {...namePtInput}/>
                                    )}
                                </Field>
                                <Field name="name_en">
                                    {({input: nameEnInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || loading || !hasPermissionToEdit} label={ t("Nome EN") } {...nameEnInput}/>
                                    )}
                                </Field>
                            </Form.Group>
                            <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]} renderIfNotAllowed={(
                                <Form.Group widths="2">
                                    <Form.Input className='input-readonly' disabled={true} label={ t("Coordenador do Curso") } value={courseDetail?.coordinator?.name} />
                                </Form.Group>
                            )}>
                                <Form.Group widths="2">
                                    <Field name="coordinator">
                                        {({input: coordinatorInput}) => (
                                            <Form.Dropdown error={ !hasCoordinator } disabled={loading || !hasPermissionToDefineCoordinator} className={( loading || !hasPermissionToDefineCoordinator ? 'input-readonly' : '')}
                                                           label={ t("Coordenador do Curso") } selectOnBlur={false} options={teachers} selection search loading={searchCoordinator} placeholder={ t("Pesquise o coordenador de curso...") }
                                                           {...coordinatorInput} onSearchChange={_.debounce(handleSearchCoordinator, 400)}
                                                           onChange={(e, {value, options}) => {
                                                               setCoordinatorUser(
                                                                   {
                                                                       email: value,
                                                                       name: options.find((x) => x.value === value).name
                                                                   },
                                                               );
                                                               coordinatorInput.onChange(value);
                                                           }}
                                            />
                                        )}
                                    </Field>
                                    <Form.Button disabled={loading || !hasPermissionToDefineCoordinator} label={ t("Guardar") } onClick={setCoordinator} color="green" icon labelPosition="left">
                                        <Icon name="save"/> { t("Guardar coordenador") }
                                    </Form.Button>
                                </Form.Group>
                        </ShowComponentIfAuthorized>
                        </Form>
                    </Card.Content>
                </Card>
            )} />
            { paramsId && <CourseTabs courseId={paramsId} /> }
        </Container>
    );
};

export default Detail;
