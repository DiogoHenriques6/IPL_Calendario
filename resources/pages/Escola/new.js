import React, { useEffect, useMemo, useState } from 'react';
import {Button, Card, Container, Dimmer, Form, Icon, Loader, Tab, Message, Header, List} from 'semantic-ui-react';
import { Field, Form as FinalForm } from 'react-final-form';
import { useParams, useNavigate} from "react-router-dom";
import _ from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import { errorConfig, successConfig } from '../../utils/toastConfig';

const New = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [loading, setLoading] = useState(!!paramsId);
    const [isSaving, setIsSaving] = useState(false);
    const [school, setSchool] = useState({});
    const isEditMode = !_.isEmpty(school);
    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [formErrors, setFormErrors] = useState([]);
    const [hasCampus, setHasCampus] = useState(false);


    const [gopGroups, setGopGroups] = useState([]);
    const [boardGroups, setBoardGroups] = useState([]);
    const [pedagogicGroups, setPedagogicGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);

    const required = value => (value ? undefined : 'Required');

    const handleTabChange = (e, { activeIndex }) => {
        setTabActiveIndex(activeIndex);
    }
    //TODO GETWEBSERVICES DATA even on new
    const getUserGroups = () => {
        setLoadingGroups(true);
        axios.get('/user-group').then((res) => {
            if (res.status === 200) {
                let gopGroupsMap = res.data.data
                    .filter(group => group.removable !== 0 && group.name.includes("gop"))
                    .map((group) => ({
                        key: group.id,
                        value: group.id,
                        text: group.description,
                    }));
                let boardGroupsMap = res.data.data
                    .filter(group => group.removable !== 0 && group.name.includes("board"))
                    .map((group) => ({
                        key: group.id,
                        value: group.id,
                        text: group.description,
                    }));


                let pedagogicGroupsMap = res.data.data
                    .filter(group => group.removable !== 0 && group.name.includes("pedagogic"))
                    .map((group) => ({
                        key: group.id,
                        value: group.id,
                        text: group.description,
                    }));
                setGopGroups(gopGroupsMap);
                setBoardGroups(boardGroupsMap);
                setPedagogicGroups(pedagogicGroupsMap);
                setLoadingGroups(false);
            }
        });
    }
    const getSchoolDetail = (id) => {
        axios.get(`/schools/${id}`).then((response) => {
            setSchool(response?.data?.data);
            setLoading(false);
        });
    }

    useEffect(() => {
        getUserGroups();
    }, []);

    useEffect(() => {
        if (paramsId) {
            getSchoolDetail(paramsId);
        }
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !school) {
            navigate('/escola');
        }
    }, [paramsId, loading, school, navigate]);

    const initialValues = useMemo(() => {
        const {
            id,
            code,
            name_pt,
            name_en,
            base_link,
            index_course_code,
            index_course_name_pt,
            index_course_name_en,
            index_course_initials,
            index_course_unit_code,
            index_course_unit_name_pt,
            index_course_unit_name_en,
            index_course_unit_initials,
            index_course_unit_curricular_year,
            index_course_unit_teachers,
            index_course_unit_registered,
            index_course_unit_passed,
            index_course_unit_flunk,
            index_course_unit_branch,
            index_docentes_email,
            index_docentes_name,
            query_param_academic_year,
            query_param_semester,
            query_param_campus,
            query_param_course,
            query_param_course_unit,
            gop_group_id,
            board_group_id,
            pedagogic_group_id,
            index_campus
        } = school || {};
        return {
            id,
            code,
            name_pt,
            name_en,
            base_link,
            index_course_code,
            index_course_name_pt,
            index_course_name_en,
            index_course_initials,
            index_course_unit_code,
            index_course_unit_name_pt,
            index_course_unit_name_en,
            index_course_unit_initials,
            index_course_unit_curricular_year,
            index_course_unit_teachers,
            index_course_unit_registered,
            index_course_unit_passed,
            index_course_unit_flunk,
            index_course_unit_branch,
            index_docentes_email,
            index_docentes_name,


            query_param_academic_year,
            query_param_semester,
            query_param_campus,
            query_param_course,
            query_param_course_unit,
            gop_group_id,
            board_group_id,
            pedagogic_group_id,
            index_campus
        };
    }, [school]);

    const onSubmit = ({ id, code, name_pt, name_en, base_link,
            index_course_code,
            index_course_name_pt,
            index_course_name_en,
            index_course_initials,
            index_course_unit_code,
            index_course_unit_name_pt,
            index_course_unit_name_en,
            index_course_unit_initials,
            index_course_unit_curricular_year,
            index_course_unit_teachers,
            index_course_unit_registered,
            index_course_unit_passed,
            index_course_unit_flunk,
            index_course_unit_branch,
            index_docentes_email,
            index_docentes_name,
            query_param_academic_year,
            query_param_semester,
            query_param_campus,
            query_param_course,
            query_param_course_unit,
            gop_group_id,
            board_group_id,
            pedagogic_group_id,
            index_campus
    }) => {
        if(!index_course_code || !index_course_name_pt || !index_course_name_en || !index_course_initials ||
            !index_course_unit_name_pt || !index_course_unit_name_en || !index_course_unit_initials || !index_course_unit_curricular_year ||
            !index_course_unit_registered || !index_course_unit_passed || !index_course_unit_flunk || !index_course_unit_branch ||
            !index_course_unit_code || !index_course_unit_teachers){
            setTabActiveIndex(0);
            return false;
        }
        if(!query_param_academic_year || !query_param_semester ){
            setTabActiveIndex(1);
            return false;
        }
        setIsSaving(true);
        const isNew = !id;
        const axiosFn = isNew ? axios.post : axios.patch;

        axiosFn(`/schools${!isNew ? '/' + id : ''}`, {
            id: (!isNew ? id : null),
            code, name_pt, name_en,
            gop_group_id, board_group_id, pedagogic_group_id,
            base_link,
            index_course_code, index_course_name_pt, index_course_name_en, index_course_initials,
            index_course_unit_code, index_course_unit_name_pt, index_course_unit_name_en, index_course_unit_initials,
            index_course_unit_registered, index_course_unit_passed, index_course_unit_flunk, index_course_unit_branch,
            index_course_unit_curricular_year, index_course_unit_teachers,
            index_docentes_email, index_docentes_name,
            query_param_academic_year, query_param_semester,
            query_param_campus, query_param_course, query_param_course_unit,
            index_campus
        }).then((res) => {
            setIsSaving(false);
            setFormErrors([]);
            if (res.status === 200) {
                toast(t('Escola atualizada com sucesso'), successConfig);
            } else if (res.status === 201) {
                toast(t('Escola criada com sucesso'), successConfig);
            } else {
                let errorsArray = [];
                if(typeof res.response.data.errors === 'object' && res.response.data.errors !== null){
                    errorsArray = Object.values(res.response.data.errors);
                } else {
                    if(Array.isArray(res.response.data.errors)){
                        errorsArray = res.response.data.errors;
                    }
                }
                setFormErrors(errorsArray);
                setHasCampus(index_campus != undefined);
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
        });
    };
    //TODO change names from index to params, or create new TABLE in DB for webservices managing
    const panes = [
        {
            menuItem: t('Configuração das colunas'),
            //TODO change to tab_content to JSON description
            pane: { key: "tab_content", content: (
                <div>
                    <Message>
                        <Message.Header>{ t('Dicas de implementação') }</Message.Header>
                        <Message.Content>
                            { t('Apenas o formato JSON é aceite pelo importador.') }
                        </Message.Content>
                        <br/>
                        <Message.Content>
                            { t("Os índices deverão corresponder ao parâmetro JSON que se deseja guardar.") }
                            <br/>
                            <strong>{ ('Exemplo:') } </strong>
                            { t( 'O nome da unidade curricular é o parâmetro DS_DISCIP, então deveremos utilizar esse parametro para obter os dados relativos aos nomes das unidades curriculares.') }
                        </Message.Content>
                    </Message>

                    <Card fluid color={"green"}>
                        <Card.Content>
                            <Card.Header>{ t('Informação do Curso') }</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Form.Group widths="3">
                                <Field name="index_course_code" validate={required}>
                                    {({input: index_course_codeInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Código") } {...index_course_codeInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_initials" validate={required}>
                                    {({input: index_course_initialsInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Iniciais") } {...index_course_initialsInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="3">
                                <Field name="index_course_name_pt" validate={required}>
                                    {({input: index_course_namePtInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Nome PT") } {...index_course_namePtInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_name_en" validate={required}>
                                    {({input: index_course_nameEnInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Nome EN") } {...index_course_nameEnInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                        </Card.Content>
                    </Card>
                    <Card fluid color={"blue"}>
                        <Card.Content>
                            <Card.Header>{ t('Informação das Unidades Curriculares') }</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Form.Group widths="equal">
                                <Field name="index_course_unit_code" validate={required}>
                                    {({input: index_course_unit_codeInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Código") } {...index_course_unit_codeInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_unit_curricular_year" validate={required}>
                                    {({input: index_course_unit_curricular_yearInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Ano curricular") } {...index_course_unit_curricular_yearInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_unit_branch" validate={required}>
                                    {({input: index_course_unit_branchInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Ramo") } {...index_course_unit_branchInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Field name="index_course_unit_initials" validate={required}>
                                    {({input: index_course_unit_initialsInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Iniciais") } {...index_course_unit_initialsInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_unit_name_pt" validate={required}>
                                    {({input: index_course_unit_namePtInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Nome PT") } {...index_course_unit_namePtInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_unit_name_en" validate={required}>
                                    {({input: index_course_unit_nameEnInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Nome EN") } {...index_course_unit_nameEnInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Field name="index_course_unit_teachers" validate={required}>
                                    {({input: index_course_unit_teachersInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Professores do curso") } {...index_course_unit_teachersInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_docentes_email" validate={required}>
                                    {({input: index_docentes_emailInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Email do docente") } {...index_docentes_emailInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_docentes_name" validate={required}>
                                    {({input: index_docentes_nameInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Nome do docente") } {...index_docentes_nameInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Field name="index_course_unit_registered" validate={required}>
                                    {({input: index_course_unit_registeredInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Alunos Registados") } {...index_course_unit_registeredInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_unit_passed" validate={required}>
                                    {({input: index_course_unit_passedInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Alunos Aprovados") } {...index_course_unit_passedInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_course_unit_flunk" validate={required}>
                                    {({input: index_course_unit_flunkInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Alunos Reprovados") } {...index_course_unit_flunkInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                        </Card.Content>
                    </Card>
                </div>
            )},
        },
        {
            menuItem: t('Configuração da queryString'),
            pane: { key: "tab_link", content: (
                <div>
                    <Message>
                        <Message.Header>{ t('Dicas de implementação') }</Message.Header>
                        <Message.Content>
                            { t('Sugere-se que as variáveis que recebem os dados relativos ao ano letivo e ao semestre, sejam de acordo com a lista seguinte:')}
                        </Message.Content>
                        <Message.List
                            items={[
                                t('anoletivo -> Pronto a receber no formato: 2021/22'),
                                t('periodo -> Pronto a receber no formato (S1/S2)'),
                            ]}
                        />
                        <Message.Content>
                            { t('Ainda assim, poderá querer escolher outros nomes para estes campos, no formulário abaixo.') }
                        </Message.Content>
                        <Message.Content>
                            <strong>
                                { t('No final, o URL deverá ser semelhante ao seguinte:') }
                                <i>https://www.dei.estg.ipleiria.pt/servicos/projetos/get_aulas_curso_tipo.php?anoletivo=2021/22&periodo=S1&format0=json</i>
                            </strong>
                        </Message.Content>
                    </Message>
                    <Card fluid>
                        <Card.Content>
                            <Form.Group widths="3">
                                <Field name="query_param_academic_year" validate={required}>
                                    {({input: query_param_academic_yearInput, meta}) => (
                                        <Form.Input placeholder={t('anoletivo -> Pronto a receber no formato: 202122')} label={ t("Nome do parâmetro para o ano letivo") } {...query_param_academic_yearInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="query_param_semester" validate={required}>
                                    {({input: query_param_semesterInput, meta}) => (
                                        <Form.Input placeholder={t('periodo -> Pronto a receber no formato (S1/S2)')} label={ t("Nome do parâmetro para o semestre") } {...query_param_semesterInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="query_param_campus" validate={required}>
                                    {({input: query_param_campusInput, meta}) => (
                                        <Form.Input placeholder={t('campus')} label={ t("Nome do parâmetro para o campus") } {...query_param_campusInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Field name="query_param_course" validate={required}>
                                    {({input: query_param_courseInput, meta}) => (
                                        <Form.Input placeholder={t('Curso')} label={ t("Nome do parâmetro para o curso") } {...query_param_courseInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="query_param_course_unit" validate={required}>
                                    {({input: query_param_course_unitsInput, meta}) => (
                                        <Form.Input placeholder={t('Unidade Curricular')} label={ t("Nome do parâmetro para a unidade curricular") } {...query_param_course_unitsInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                        </Card.Content>
                    </Card>
                </div>
            )},
        },
    ];

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/escola"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <div>
                { hasCampus && (
                    <Message warning>
                        <Message.Header>{ t('Os seguintes detalhes da Escola precisam da sua atenção:') }</Message.Header>
                        <Message.List>
                                <Message.Item>{ t('Preencha os dados do Indíce Campus para acessar UCs e cursos via webservices.') }</Message.Item>
                        </Message.List>
                    </Message>
                )}
                <br/>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({ handleSubmit }) => (
                <Form>
                    <Card fluid>
                        { loading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{t('A carregar dados')}</Loader>
                            </Dimmer>
                        )}
                        <Card.Content header={`${ isEditMode ? t('Editar Escola') : t('Nova Escola') }`} />
                        <Card.Content>
                            <Form.Group widths="equal">
                                <Field name="code" validate={required}>
                                    {( { input: codeInput, meta}) => (
                                        <Form.Input label={t('Nome')} {...codeInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="name_pt" validate={required}>
                                    {( { input: namePtInput, meta}) => (
                                        <Form.Input label={t('Descrição PT')} {...namePtInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="name_en" validate={required}>
                                    {( { input: nameEnInput, meta}) => (
                                        <Form.Input label={t('Descrição EN')} {...nameEnInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal" style={{ marginTop: 'var(--space-m)' }}>
                                <Field name="gop_group_id" validate={required}>
                                    {({input: gop_group_idInput, meta}) => (
                                        <Form.Dropdown options={gopGroups} selection clearable search
                                        {...gop_group_idInput} selectOnBlur={false} loading={loadingGroups}
                                        onChange={(e, {value}) => gop_group_idInput.onChange(value)}
                                        label={ t("Grupo GOP da escola") } error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="board_group_id" validate={required}>
                                    {({input: board_group_idInput, meta}) => (
                                        <Form.Dropdown options={boardGroups} selection clearable search
                                            {...board_group_idInput} selectOnBlur={false} loading={loadingGroups}
                                            onChange={(e, {value}) => board_group_idInput.onChange(value)}
                                            label={ t("Grupo Direção da escola") } error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="pedagogic_group_id" validate={required}>
                                    {({input: pedagogic_group_idInput, meta}) => (
                                        <Form.Dropdown options={pedagogicGroups} selection clearable search
                                            {...pedagogic_group_idInput} selectOnBlur={false} loading={loadingGroups}
                                            onChange={(e, {value}) => pedagogic_group_idInput.onChange(value)}
                                            label={ t("Grupo Pedagógico da escola") } error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="index_campus" validate={required}>
                                    {({input: index_campusInput, meta}) => (
                                        <Form.Input type='text' label={ t("Index coluna Campus") } {...index_campusInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal" style={{ marginTop: 'var(--space-m)' }}>
                                <Field name="base_link" validate={required}>
                                    {({input: base_linkInput, meta}) => (
                                        <Form.Input placeholder="Exemplo: http://www.dei.estg.ipleiria.pt/intranet/horarios/ws/inscricoes/cursos_ucs.php"
                                            {...base_linkInput}
                                            label={ t("Link do Webservice dos Cursos") } error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                        </Card.Content>
                        { formErrors.length > 0 &&
                            <Card.Content>
                                <Message negative>
                                    <Message.Header>Errors</Message.Header>
                                    <Message.List>
                                        {formErrors?.map((item, index) =>
                                            <Message.Item key={index}>{item}</Message.Item>
                                        )}
                                    </Message.List>
                                </Message>
                            </Card.Content>
                        }
                        <Card.Content>
                            <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right" loading={isSaving} >
                                <Icon name={isEditMode ? 'save' : 'plus'} /> {isEditMode ? t('Guardar') : t('Criar')}
                            </Button>
                        </Card.Content>
                    </Card>
                    { !loading && ( <Tab panes={panes} renderActiveOnly={false} activeIndex={tabActiveIndex} onTabChange={handleTabChange}/> )}
                </Form>
            )} />
        </Container>
    );
};

export default New;
