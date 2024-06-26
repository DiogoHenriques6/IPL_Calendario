import _ from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {Field, Form as FinalForm} from 'react-final-form';
import {useNavigate} from 'react-router';
import {Link, useParams} from 'react-router-dom';
import {
    Button,
    Card,
    Container, Dimmer,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    Label, Loader,
    Message, Modal, ModalContent,
    ModalActions, Popup,
    Segment,
    Table
} from 'semantic-ui-react';
import axios from 'axios';
import {toast} from 'react-toastify';
import {successConfig, errorConfig} from '../../utils/toastConfig';
import {useTranslation} from "react-i18next";
import UnitTabsGroup from "./Tabs";
import FilterOptionDegree from "../../components/Filters/Degree";
import FilterOptionPerPage from "../../components/Filters/PerPage";
import FilterOptionPerCourse from "../../components/Filters/Courses";
import PaginationDetail from "../../components/Pagination";
import FilterOptionBySemester from "../../components/Filters/Semesters";
import FilterOptionPerSchool from "../../components/Filters/Schools";
import ShowComponentIfAuthorized from "../../components/ShowComponentIfAuthorized";
import SCOPES from "../../utils/scopesConstants";

const New = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [courseUnitGroupDetail, setCourseUnitGroupDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [courseUnits, setCourseUnitsList] = useState([]);
    const [selectedCourseUnits, setSelectedCourseUnits] = useState([]);
    const [currentCourseUnit, setCurrentCourseUnit] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const isEditMode = !_.isEmpty(paramsId);
    const [coursesCount, setCoursesCount] = useState(0);
    const [course, setCourse] = useState();
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [allResults, setAllResults] = useState(false);
    const [courseUnitSearch, setCourseUnitSearch] = useState();
    const [semester, setSemester] = useState();
    const [school, setSchool] = useState();

    const [paginationInfo, setPaginationInfo] = useState({});
    const [allCourseUnits, setAllCourseUnits] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isDisable, setIsDisable] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const searchCourseUnit = (evt, {value}) => {
        setCourseUnitSearch(value);
    };

    useEffect(() => {
        fetchCourseUnits();
    }, [currentPage]);

    useEffect(() => {
        const selectedGroup = localStorage.getItem("selectedGroup");
        if(selectedGroup.includes("admin") || selectedGroup.includes("super_admin")){
            setIsManager(true);
        }
        else{
            setIsManager(false);
        }
    }, []);

    useEffect(() => {
        console.log(semester);
        if(currentPage === 1){
            fetchCourseUnits();
        } else {
            setCurrentPage(1);
        }
    }, [courseUnitSearch, course, semester, perPage,school]);

    const clearAllCourseUnits = () => {
        setSelectedCourseUnits([]);
        setSchool(null);
        setIsDisable(false);
    }

    const removeCourseUnit = (id) => {
        setSelectedCourseUnits([...selectedCourseUnits.filter((courseUnit) => courseUnit.id !== id)]);
        if(selectedCourseUnits.length === 1){
            setSchool(null);
            setSemester(null);
            setIsDisable(false);
        }
    };

    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    useEffect(() => {
        fetchCourseUnits();

    }, [currentPage]);

    useEffect(() => {
        if(allResults) {
            fetchCourseUnits();
        }
    }, [allResults]);

    const addMultiCourseUnits = (courseUnitsList) => {
        const uniqueIds = [];
        const fullCoursesUnits = [ ...courseUnits, ...courseUnitsList];

        const uniqueCoursesUnits = fullCoursesUnits.filter(element => {
            const isDuplicate = uniqueIds.includes(element.id);
            if (!isDuplicate) {
                uniqueIds.push(element.id);
                return true;
            }
            return false;
        });

        setSelectedCourseUnits(uniqueCoursesUnits);
    };

    const fetchCourseUnits = () => {
        if(!allResults) {
            setLoading(true);
        }

        let searchLink = `/course-units/search?page=${currentPage}`;
        searchLink += `${courseUnitSearch ? `&search=${courseUnitSearch}` : ''}`;
        searchLink += `${course ? `&course=${course}` : ''}`;
        searchLink += `${semester ? `&semester=${semester}` : ''}`;
        searchLink += `${school ? `&school=${school}` : ''}`;
        searchLink += '&per_page=' + ( allResults ? "all" : perPage );

        axios.get(searchLink).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(!allResults) {
                    setCourseUnitsList(response.data.data);
                    setPaginationInfo(response.data.meta);
                    setLoading(false);
                } else {
                    addMultiCourseUnits(response.data.data);
                    setAllResults(false);
                }
            }
        });
    };

    const addCourseUnit = (courseUnit) => {
        //TODO acabar modal para confimação de adição de UC
        //  PREPARAR BACKEND
        if(courseUnit.has_methods){
            setShowModal(true);
            setCurrentCourseUnit(courseUnit);
        }
        else {
            if(selectedCourseUnits.length === 0){
                setSchool(courseUnit.school_id);
                setSemester(courseUnit.semester);
                setIsDisable(true);
            }
            setSelectedCourseUnits([...selectedCourseUnits, {...courseUnit}]);
        }
    };

    // Get grouped UCs
    useEffect(() => {
        if (paramsId) {
            axios.get(`/course-unit-groups/${paramsId}`).then((res) => {
                // loadCourseUnits(res?.data?.data?.course_units?.map((x) => x.id).join(','));
                setLoading(false);
                setCourseUnitGroupDetail(res?.data?.data);
                setCoursesCount(res?.data?.data?.course_units?.length);
                document.title = t("Detalhe de Agrupamento de Unidades Curriculares - ") + t("Calendários de Avaliação - IPLeiria");
            });
        }
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !courseUnitGroupDetail) {
            navigate('/agrupamento-unidade-curricular');
        }
    }, [paramsId, loading, courseUnitGroupDetail, navigate]);

    const initialValues = useMemo(() => {
        const {id, description_pt, description_en, course_units} = courseUnitGroupDetail;
        return {id, description_pt, description_en, courseUnits: (course_units ? course_units.map((x) => x.id) : [])};
    }, [courseUnitGroupDetail]);


    const onSubmit = ({id, description_pt, description_en}) => {
        setIsSaving(true);
        const isNew = !id;
        const axiosFn = isNew ? axios.post : axios.patch;

        axiosFn(`/course-unit-groups/${!isNew ? id : ''}`, {
            description_pt,
            description_en,
            course_units: selectedCourseUnits.map((x) => x.id),
        }).then((res) => {
            setIsSaving(false);
            if (res.status >= 200 && res.status < 300) {
                toast(t(`O agrupamento de unidade curricular foi ${isEditMode ? 'editado' : 'criado'} com sucesso!`), successConfig);
                if(!isEditMode){
                    navigate("/agrupamento-unidade-curricular/edit/" + res.data);
                } else {
                    setCourseUnitsCount(selectedCourseUnits.length);
                }
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
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
        });
    };

    function handleAddCourseUnit() {
        setShowModal(false);
        setSelectedCourseUnits([...selectedCourseUnits, {...currentCourseUnit}]);
        if(selectedCourseUnits.length === 0){
            setSchool(currentCourseUnit.school_id);
            setSemester(currentCourseUnit.semester);
            setIsDisable(true);
        }
    }


    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/agrupamento-unidade-curricular"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({handleSubmit}) => (
                <Form warning={ errorMessages.length > 0 }>
                    <Card fluid>
                        <Card.Content
                            header={t(`${isEditMode ? 'Editar' : 'Novo'} Agrupamento de Unidades Curriculares`)}/>
                        {errorMessages.length > 0 && (
                            <Card.Content>
                                <Message warning>
                                    <Message.Header>{t('Os seguintes detalhes do Curso precisam da sua atenção:')}</Message.Header>
                                    <Message.List>
                                        {errorMessages.map((message, index) => (
                                            <Message.Item key={index}>
                                                {message}
                                            </Message.Item>
                                        ))}
                                    </Message.List>
                                </Message>
                            </Card.Content>
                        )}
                        <Card.Content>
                            <Form.Group widths="equal">
                                <Field name="description_pt">
                                    {({input: descriptionPtInput}) => (
                                        <Form.Input label={t("Descrição") + " - PT"} {...descriptionPtInput} />
                                    )}
                                </Field>
                                <Field name="description_en">
                                    {({input: descriptionEnInput}) => (
                                        <Form.Input label={t("Descrição") + " - EN"} {...descriptionEnInput} />
                                    )}
                                </Field>
                            </Form.Group>
                            <Card.Content>
                                <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right"
                                        loading={isSaving}>
                                    <Icon name={isEditMode ? 'save' : 'plus'}/>
                                    {isEditMode ? t('Guardar') : t('Criar')}
                                </Button>
                            </Card.Content>
                            {selectedCourseUnits.length  > 0 &&  !isEditMode ? (
                                <div>
                                    <Header as="h5">
                                        {t("Unidades Curriculares selecionadas")}
                                    </Header>

                                    <Grid.Row>
                                        {selectedCourseUnits.map((courseUnit, index) => (
                                            <Label key={index} size={"large"} className={"margin-bottom-s"}>
                                                {courseUnit.code + ' - ' + courseUnit.name}
                                                <Icon name='delete' color={"red"}
                                                      onClick={() => removeCourseUnit(courseUnit.id)}/>
                                            </Label>
                                        ))}
                                    </Grid.Row>
                                    <Card.Content>
                                        {selectedCourseUnits.length > 0 && (
                                            <Button floated='right' onClick={() => clearAllCourseUnits()}
                                                    color="red">{t("Remover unidades curriculares selecionadas") + " (" + selectedCourseUnits.length + ")"}</Button>
                                        )}
                                    </Card.Content>
                                </div>
                            ) : null}
                            {coursesCount > 0 ? (
                                <div>
                                    <Header as="h5">
                                        {t("Unidades Curriculares")}
                                    </Header>

                                    <Grid.Row>
                                        {courseUnitGroupDetail?.course_units.map((courseUnit, index) => (
                                            <Label key={index} size={"large"} className={"margin-bottom-s"}>
                                                {courseUnit.code + ' - ' + courseUnit.name}
                                            </Label>
                                        ))}
                                    </Grid.Row>
                                </div>
                            ) : null}
                            {isEditMode && (
                                <div className={"margin-top-base"}>
                                    {paramsId && <UnitTabsGroup groupId={paramsId} coursesCount={coursesCount}/>}
                                </div>
                            )}
                        </Card.Content>

                        { !isEditMode && (
                            <Card.Content>
                                <Form.Group>
                                    <Form.Input width={6}
                                                label={t("Pesquisar unidade curricular (Código, Abreviatura ou Nome)")}
                                                placeholder={t("Pesquisar...")} fluid
                                                onChange={_.debounce(searchCourseUnit, 900)}/>
                                    <FilterOptionPerCourse heightSize={10} widthSize={5} showAllDegrees={true} school={school}
                                                           eventHandler={(value) => setCourse(value)}/>
                                    <FilterOptionBySemester disabled={isDisable} widthSize={5} value={semester} eventHandler={(value) => setSemester(value)}/>

                                        {isManager && (
                                            <FilterOptionPerSchool disabled={isDisable} widthSize={3} selectedSchool={school} eventHandler={(value) => setSchool(value)}/>)
                                        }
                                    <FilterOptionPerPage  widthSize={2} eventHandler={(value) => setPerPage(value)}/>
                                </Form.Group>

                                {!allCourseUnits && (
                                    <>
                                        {paginationInfo.total > 0 && (
                                            <Segment clearing basic>
                                                {school && semester && (
                                                <Button floated='right' onClick={() => setAllResults(true)}
                                                        color="blue">{t("Adicionar todas as unidades curriculares") + " (" + paginationInfo.total + ")"}</Button>
                                                    )}
                                            </Segment>
                                        )}
                                        <Grid.Row>
                                            <Table color="green">
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>{t("Código")}</Table.HeaderCell>
                                                        <Table.HeaderCell>{t("Abreviatura")}</Table.HeaderCell>
                                                        <Table.HeaderCell>{t("Nome")}</Table.HeaderCell>
                                                        <Table.HeaderCell>{t("Curso")}</Table.HeaderCell>
                                                        <Table.HeaderCell>{t("Semestre")}</Table.HeaderCell>
                                                        <Table.HeaderCell>{t("Adicionar")}</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {courseUnits.map((courseUnit, index) => (
                                                        <Table.Row key={index} warning={courseUnit?.has_group == 1} >
                                                            <Table.Cell>{courseUnit.code}</Table.Cell>
                                                            <Table.Cell>{courseUnit.initials}</Table.Cell>
                                                            <Table.Cell>{courseUnit.name}</Table.Cell>
                                                            <Table.Cell>{courseUnit.course_description}</Table.Cell>
                                                            <Table.Cell>{courseUnit.semester}</Table.Cell>
                                                            <Table.Cell >
                                                                {courseUnit.has_group == 1 ? (
                                                                    <div className={"padding-left-xl" }>
                                                                        <Popup  trigger={
                                                                            <Icon name="warning sign" />
                                                                        }
                                                                               content={<div>{t("Já pertence a uma UC agrupada") }</div>}
                                                                               position='top center'/>
                                                                    </div>
                                                                ) : (
                                                                    selectedCourseUnits.find(({id: courseUnitId}) => courseUnitId === courseUnit.id) ? (
                                                                        <Button onClick={() => removeCourseUnit(courseUnit.id)} color="red">{t("Remover")}</Button>
                                                                    ) : (
                                                                        <Button onClick={() => addCourseUnit(courseUnit)} color="teal">{t("Adicionar")}</Button>
                                                                    )
                                                                )}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <PaginationDetail currentPage={currentPage} info={paginationInfo}
                                                              eventHandler={changedPage}/>
                                        </Grid.Row>
                                        {loading && (
                                            <Dimmer active inverted>
                                                <Loader
                                                    indeterminate>{t("A carregar os unidades curriculares")}</Loader>
                                            </Dimmer>
                                        )}
                                    </>
                                )}
                            </Card.Content>
                        )}


                    </Card>
                </Form>
            )}/>
            <Modal
                open={showModal}
                onClose={handleCloseModal}
                size='small'
            >
                <Header icon>
                    {t("Agrupar Unidade Curricular")}
                </Header>
                <ModalContent >
                    <p className={"padding-left-l"}>
                        <strong>{currentCourseUnit?.code} - {currentCourseUnit?.name}</strong>
                    </p>
                    <p style={{textAlign: "center"}}>
                        {t("A unidade curricular possui métodos já estabelecidos. Confirma que deseja agrupar esta unidade curricular mesmo assim?")}
                    </p>
                </ModalContent >
                <ModalActions>
                    <Button color='red' inverted onClick={handleCloseModal}>
                        <Icon name='remove' /> {t("Cancelar")}
                    </Button>
                    <Button color='green' inverted onClick={handleAddCourseUnit}>
                        <Icon name='checkmark' /> {t("Confirmar")}
                    </Button>
                </ModalActions>
            </Modal>
        </Container>
    );
};

export default New;
