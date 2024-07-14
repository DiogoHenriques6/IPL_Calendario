import {
    Button,
    Card, CardContent,
    Dimmer,
    Form,
    Grid,
    Header,
    Icon, Label,
    Loader, Modal, ModalActions,
    ModalContent,
    Popup,
    Segment, Sticky,
    Table
} from "semantic-ui-react";
import _ from "lodash";
import FilterOptionPerCourse from "../../../components/Filters/Courses";
import FilterOptionBySemester from "../../../components/Filters/Semesters";
import FilterOptionPerSchool from "../../../components/Filters/Schools";
import FilterOptionPerPage from "../../../components/Filters/PerPage";
import PaginationDetail from "../../../components/Pagination";
import React, {createRef, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {toast} from "react-toastify";

const UnitTabCurricularUnits = ({ groupId }) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const contextRef = createRef();

    const [courseUnits, setCourseUnitsList] = useState([]);
    const [allResults, setAllResults] = useState(false);
    const [selectedCourseUnits, setSelectedCourseUnits] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [semester, setSemester] = useState("");
    const [school, setSchool] = useState("");
    const [course, setCourse] = useState("");
    const [courseUnitSearch, setCourseUnitSearch] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [allCourseUnits, setAllCourseUnits] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [currentCourseUnit, setCurrentCourseUnit] = useState();

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
        if (groupId) {
            axios.get(`/course-unit-groups/${groupId}`).then((res) => {
                setLoading(false);
                setSelectedCourseUnits(res?.data?.data?.course_units);
                setSemester(res?.data?.data?.course_units[0]?.semester);
            });
        }
    }, [groupId]);

    useEffect(() => {
        fetchCourseUnits();
    }, [currentPage]);

    useEffect(() => {
        if(currentPage === 1){
            fetchCourseUnits();
        } else {
            setCurrentPage(1);
        }
    }, [courseUnitSearch, course, semester, perPage,school]);

    const searchCourseUnit = (evt, {value}) => {
        setCourseUnitSearch(value);
    };

    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    const fetchCourseUnits = () => {
        if(!allResults) {
            setLoading(true);
        }

        let searchLink = `/course-units/search?page=${currentPage}`;
        searchLink += `${courseUnitSearch ? `&search=${courseUnitSearch}` : ''}`;
        const sessionCourse = course ?  course : parseInt(sessionStorage.getItem('course')) || -1;
        searchLink += `${sessionCourse !== -1 ? `&course=${sessionCourse}` : ''}`;
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

    function handleAddCourseUnit() {
        setShowModal(false);
        setSelectedCourseUnits([...selectedCourseUnits, {...currentCourseUnit}]);
        if(selectedCourseUnits.length === 0){
            setSchool(currentCourseUnit.school_id);
            setSemester(currentCourseUnit.semester);
            setIsDisable(true);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const removeCourseUnit = (id) => {
        setSelectedCourseUnits([...selectedCourseUnits.filter((courseUnit) => courseUnit.id !== id)]);
        if(selectedCourseUnits.length === 1){
            setSchool(null);
            setSemester(null);
            setIsDisable(false);
        }
    };

    const addCourseUnit = (courseUnit) => {
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

    const clearAllCourseUnits = () => {
        setSelectedCourseUnits([]);
        setSchool(null);
        setIsDisable(false);
    }

    const handleSubmit = () => {
        setIsSaving(true);
        const courseUnitIds = selectedCourseUnits.map(({id}) => id);
        axios.patch(`/course-unit-groups/${groupId}/course-units`, {course_units: courseUnitIds}).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                setIsSaving(false);
                toast(t("Unidades Curriculares guardadas com sucesso!"), {type: "success"});
            }
        });
    }

    return (
        <div ref={contextRef}>
            <Card.Content>
                <Sticky offset={50} context={contextRef}>
                    <div className='sticky-methods-header'>
                        <div className={'stikyDiv'}>
                            {selectedCourseUnits.length  > 0 ? (
                                <div className={"selectedCourseUnits"}>
                                    <Header as="h5">
                                        {t("Unidades Curriculares selecionadas")}
                                    </Header>
                                    <Grid.Row>
                                        {selectedCourseUnits.map((courseUnit, index) => (
                                            <Label key={index} size={"large"} className={"margin-bottom-s"}>
                                                {courseUnit.code + ' - ' + courseUnit.name}
                                                { selectedCourseUnits.length >2 &&
                                                <Icon name='delete' color={"red"}
                                                      onClick={() => removeCourseUnit(courseUnit.id)}/>
                                                }
                                            </Label>
                                        ))}
                                    </Grid.Row>
                                </div>
                            ):null}
                            <div className={'btn-group-course-units'}>
                                <Card.Content>
                                    <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated='right' disabled={selectedCourseUnits.length < 2}
                                            loading={isSaving}>
                                        <Icon name="save"/>{t("Guardar Unidades Curriculares")}
                                    </Button>
                                </Card.Content>
                            </div>
                        </div>
                    </div>
                </Sticky>

                <Form.Group>
                    <Form.Input width={6}
                                label={t("Pesquisar unidade curricular (Código, Abreviatura ou Nome)")}
                                placeholder={t("Pesquisar...")} fluid
                                onChange={_.debounce(searchCourseUnit, 900)}/>
                    <FilterOptionPerCourse heightSize={10} widthSize={5} showAllDegrees={true} school={school}
                                           eventHandler={(value) => setCourse(value)}/>
                    <FilterOptionBySemester disabled={isDisable} widthSize={5} value={semester}
                                            eventHandler={(value) => setSemester(value)}/>

                    {isManager && (
                        <FilterOptionPerSchool disabled={isDisable} widthSize={3} selectedSchool={school}
                                               eventHandler={(value) => setSchool(value)}/>)
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
                                        <Table.Row key={index} warning={courseUnit?.has_group === 1} >
                                            <Table.Cell>{courseUnit.code}</Table.Cell>
                                            <Table.Cell>{courseUnit.initials}</Table.Cell>
                                            <Table.Cell>{courseUnit.name}</Table.Cell>
                                            <Table.Cell>{courseUnit.course_description}</Table.Cell>
                                            <Table.Cell>{courseUnit.semester}</Table.Cell>
                                            <Table.Cell >
                                                {courseUnit.has_group === 1 && courseUnit.group_id !== parseInt(groupId) ? (
                                                    <div className={"padding-left-xl" }>
                                                        <Popup  trigger={
                                                            <Icon name="warning sign" />
                                                        }
                                                                content={<div>{t("Já pertence a uma UC agrupada") }</div>}
                                                                position='top center'/>
                                                    </div>
                                                ) : (
                                                    selectedCourseUnits.find(({id: courseUnitId}) => courseUnitId === courseUnit.id) ? (
                                                        selectedCourseUnits.length < 2 ? (
                                                        <Button onClick={() => removeCourseUnit(courseUnit.id)} color="red">{t("Remover")}</Button>
                                                        ): (
                                                            <div className={"padding-left-xl"}>
                                                                <Popup trigger={
                                                                    <Icon name="warning sign"/>
                                                                }
                                                                       content={
                                                                           <div>{t("UC pertence a este agrupamento")}</div>}
                                                                       position='top center'/>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <Button onClick={() => addCourseUnit(courseUnit)} color="teal">{t("Adicionar")}</Button>
                                                    )
                                                ) }
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
            </Card.Content>
        </div>
    );
}

export default UnitTabCurricularUnits;