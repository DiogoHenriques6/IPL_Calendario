import _ from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {Field, Form as FinalForm} from 'react-final-form';
import {useNavigate} from 'react-router';
import {Link, useParams} from 'react-router-dom';
import {Button, Card, Container, Dimmer, Form, Header, Icon, Loader, Message} from 'semantic-ui-react';
import axios from 'axios';
import {toast} from 'react-toastify';
import {successConfig, errorConfig} from '../../utils/toastConfig';
import {useTranslation} from "react-i18next";
import Semesters from "../../components/Filters/Semesters";
import UnitTabs from "./Tabs";
import Schools from "../../components/Filters/Schools";
import SCOPES from "../../utils/scopesConstants";
import ShowComponentIfAuthorized, {useComponentIfAuthorized} from "../../components/ShowComponentIfAuthorized";

const New = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [courseUnitDetail, setCourseUnitDetail] = useState({});
    const [loading, setLoading] = useState(!!paramsId);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const isEditMode = !_.isEmpty(courseUnitDetail);
    const [branchesList, setBranchesList] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);

    const [searchUc, setSearchUc] = useState("");
    const [school, setSchool] = useState("");


    const fetchDetail = () => {
        setLoading(true);
        axios.get(`/course-units/${paramsId}/branches`).then((res) => {
            if (res.status === 200) {
                setBranchesList(res?.data?.data);
                axios.get(`/course-units/${paramsId}`).then((resTeachers) => {
                    setLoading(false);
                    setCourseUnitDetail(resTeachers?.data?.data);
                });
            }
        });
    };

    const refreshUc = () => {
        setLoading(true);
        setIsSearchLoading(true);
        axios.get(`/course-units/${paramsId}/refresh`).then((res) => {
            setIsSearchLoading(false);
            if (res.status === 200) {
                fetchDetail();
                toast('UC atualizada!', successConfig);
            } else {
                toast('Existiu um problema ao gravar as alterações! Contacte um administrador!', errorConfig);
            }
        });
    };

    const getNewUc = () => {
        setLoading(true);
        setIsSearchLoading(true);
        axios.post(`/course-units/`, {
            school: school,
            uc: searchUc
        }).then((res) => {
            setIsSearchLoading(false);
            if (res.status === 201) {
                navigate('/unidade-curricular/edit/' + res.data);
                toast('Nova UC criada/atualizada', successConfig);
            } else {
                toast('Existiu um problema ao gravar as alterações! Contacte um administrador!', errorConfig);
            }
        });
    };

    useEffect(() => {
        if (paramsId) {
            fetchDetail();
        }
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !courseUnitDetail) {
            navigate('/unidade-curricular');
        }
    }, [paramsId, loading, courseUnitDetail]);

    const initialValues = useMemo(() => {
        const {id, code, description,  name_pt, name_en, initials, curricularYear, semester, branch} = courseUnitDetail;
        return {id, code, description, name_pt, name_en, initials, curricularYear, semester, branch};
    }, [courseUnitDetail]);

    const onSubmit = ({id, name_pt, name_en, code, initials, curricularYear, semester, branch}) => {
        setIsSaving(true);
        const isNew = !id;
        const axiosFn = isNew ? axios.post : axios.patch;
        axiosFn(`/course-units/${!isNew ? id : ''}`, {
            name_pt,
            name_en,
            code,
            initials,
            semester,
            curricular_year: curricularYear,
            branch_id: branch
        }).then((res) => {
            setIsSaving(false);
            if (res.status >= 200 && res.status < 300) {
                setErrorMessages([]);
                toast(`A Unidade curricular foi ${isEditMode ? 'editada' : 'criada'} com sucesso!`, successConfig);
            } else {
                let errorsArray = [];
                if(typeof res.response.data.errors === 'object' && res.response.data.errors !== null){
                    errorsArray = Object.values(res.response.data.errors);
                } else {
                    if(Array.isArray(res.response.data.errors)){
                        errorsArray = res.response.data.errors;
                    }
                }
                setErrorMessages(errorsArray);
                toast('Existiu um problema ao gravar as alterações!', errorConfig);
            }
        });
    };

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/unidade-curricular"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({handleSubmit}) => (
                <Form warning={ errorMessages.length > 0 }>
                    <Card fluid>
                        { loading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{t('A carregar dados')}</Loader>
                            </Dimmer>
                        )}
                        <Card.Content>
                            <div className='card-header-alignment'>

                                <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSE_UNITS]} renderIfNotAllowed={(
                                    <Header as="span">{t("Detalhe da Unidade Curricular")}</Header>
                                )}>
                                    <Header as="span">{(isEditMode ? t('Editar') : t('Nova')) + " " + t("Unidades Curriculares")}</Header>
                                    <div>
                                        { isEditMode && (
                                            <Button onClick={refreshUc} color="blue" icon loading={isSaving} title={"Atualizar dados atraves do WebService"}>
                                                <Icon name={"refresh"} loading={isSearchLoading}/>
                                            </Button>
                                        )}
                                        <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right" loading={isSaving} >
                                            <Icon name={isEditMode ? 'save' : 'plus'}/>
                                            {isEditMode ? t('Guardar') : t('Criar')}
                                        </Button>
                                    </div>
                                </ShowComponentIfAuthorized>
                            </div>
                        </Card.Content>
                        { errorMessages.length > 0 && (
                            <Card.Content>
                                <Message warning>
                                    <Message.Header>{ t('Os seguintes detalhes da Unidade curricular precisam da sua atenção') }:</Message.Header>
                                    <Message.List>
                                        { errorMessages.map((message, index) => (
                                            <Message.Item key={index}>
                                                { message }
                                            </Message.Item>
                                        ))}
                                    </Message.List>
                                </Message>
                            </Card.Content>
                        )}
                        <Card.Content>
                            { !isEditMode ? (
                                <div className={"margin-bottom-base"}>
                                    <Form.Group widths="3" className={"align-items-end"}>
                                        <Schools eventHandler={(value) => setSchool(value)}/>
                                        <Form.Input loading={isSearchLoading} label={t("Código")} placeholder={t("Procurar por dódigo da UC")} onChange={(e, {value}) => setSearchUc(value)}/>
                                        <Form.Field inline>
                                            <Button icon className="margin-right-m margin-top-l" onClick={getNewUc} disabled={!(school && searchUc)} loading={isSearchLoading}>
                                                <Icon name={"search"} /> Pesquisar e adicionar
                                            </Button>
                                        </Form.Field>
                                    </Form.Group>
                                    <Message info>
                                        <Message.Content>{ t("Selecione a escola e o codigo da Uc que esta em falta para adicionar á aplicação.")}</Message.Content>
                                    </Message>
                                </div>
                            ) : (
                                <Form.Group widths="3">
                                    <Field name="code">
                                        {({input: codeInput}) => (
                                            <Form.Input className='input-readonly' disabled={true || isEditMode} label={t("Código")} placeholder={t("Código")} {...codeInput} />
                                        )}
                                    </Field>
                                    <Field name="initials">
                                        {({input: initialsInput}) => (
                                            <Form.Input className='input-readonly' disabled={true || isEditMode} label={t("Iniciais")} placeholder={t("Iniciais")} {...initialsInput} />
                                        )}
                                    </Field>
                                    <ShowComponentIfAuthorized permission={[SCOPES.VIEW_COURSES]}>
                                        <div className={"field align-end-start"}>
                                            <a href={"/curso/" + courseUnitDetail.course} target={"_blank"} className="margin-right-m margin-top-l" title={ t("Ver curso") }>
                                                { t('Ver detalhe do curso') } <Icon name={"external alternate"} />
                                            </a>
                                        </div>
                                    </ShowComponentIfAuthorized>
                                </Form.Group>
                            )}

                            <Form.Group widths="equal">
                                <Field name="name_pt">
                                    {({input: namePtInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || isEditMode} label={t("Nome PT")} placeholder={t("Nome PT")} {...namePtInput} />
                                    )}
                                </Field>
                                <Field name="name_en">
                                    {({input: nameEnInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || isEditMode} label={t("Nome EN")} placeholder={t("Nome EN")} {...nameEnInput} />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="3">
                                <Field name="curricularYear">
                                    {({input: curricularYearInput}) => (
                                        <Form.Input className='input-readonly' disabled={true || isEditMode } label={t("Ano curricular")} placeholder={t("Ano curricular")} {...curricularYearInput} />
                                    )}
                                </Field>
                                <Field name="semester">
                                    {({input: semesterInput}) => (
                                        <Semesters className='input-readonly' disabled={true || isEditMode } eventHandler={(value) => {semesterInput.onChange(value);}} value={semesterInput.value} isSearch={false}/>
                                    )}
                                </Field>
                                <Field name="branch">
                                    {({input: branchInput}) => (
                                        <Form.Dropdown options={branchesList} label={t("Ramo")} placeholder={t("Ramo")} selection search={useComponentIfAuthorized(SCOPES.EDIT_COURSE_UNITS)} {...branchInput}
                                                       disabled={!useComponentIfAuthorized(SCOPES.EDIT_COURSE_UNITS)}  className={ (useComponentIfAuthorized(SCOPES.EDIT_COURSE_UNITS) ? '' : 'input-readonly') }
                                                       onChange={(e, {value}) => branchInput.onChange(value)}/>
                                    )}
                                </Field>
                            </Form.Group>
                        </Card.Content>
                    </Card>
                </Form>
            )} />
            <div className={"margin-top-base"}>
                { paramsId && <UnitTabs unitId={paramsId} hasGroup={ loading || courseUnitDetail?.has_group } /> }
            </div>
        </Container>
    );
};
export default New;
