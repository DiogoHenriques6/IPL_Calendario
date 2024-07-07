import {
    Button,
    Card,
    CardContent, CardGroup, Container,
    Form,
    Header,
    Icon, List,
    Modal, Table
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CourseUnits from "../Filters/CourseUnits";
import axios from "axios";
import {toast} from "react-toastify";
import {errorConfig, successConfig} from "../../utils/toastConfig";
import EmptyTable from "../EmptyTable";
import ShowComponentIfAuthorized from "../ShowComponentIfAuthorized";
import SCOPES from "../../utils/scopesConstants";
import {Link} from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const SweetAlertComponent = withReactContent(Swal);

const GroupedMethods = ({isOpen, onClose, epochs, epochTypeId, unitId}) => {
    const { t, i18n } = useTranslation();
    const [courseUnits, setCourseUnits] = useState([]);
    const [columns, setColumns] = useState(2);
    const tableColumns = [
        {name: t('Métodos')},
        {name: t('Unidades Curriculares'),  style: {width: '60%'} },
        {name: t("Número de Métodos"),      style: {width: '10%'},  align: 'center' },
        {name: t('Ações'),                  style: {width: '10%'},  align: 'center' },
    ];
    const [selectedEpochs, setSelectedEpochs] = useState([]);
    const [courseUnit, setCourseUnit] = useState();
    const [school, setSchool] = useState();
    const [semester, setSemester] = useState();
    const [selectedEvaluations, setSelectedEvaluations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [groupedMethodsList, setGroupedMethodsList] = useState([]);
    const [removingMethodGroup, setRemovingMethodGroup] = useState(null);
    //TODO EDIT METHOD GROUPS
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        console.log(epochs)
        setSelectedEpochs([epochs]);

    }, [epochs, epochTypeId]);

    const addColumn = () => {
        setColumns(columns + 1); // Increment the number of columns
    };

    const closeModal = () =>{
        setColumns(2);
        setSelectedEvaluations([]);
        setCourseUnits([parseInt(unitId)])
        onClose();
    }

    const defineCourseUnit =()=>{
        setCourseUnits([parseInt(unitId)]);
        if(unitId){
            axios.get(`/course-units/${unitId}`).then((res) => {
                if (res.status === 200) {
                    setCourseUnit(res.data.data);

                    setSemester(res.data.data.semester)
                    setSchool(res.data.data.school)
                }
            });
        }
    }

    useEffect(() => {
        loadGroupedMethods();
        defineCourseUnit();
    }, [unitId, epochTypeId]);

    const handleSubmit = () => {

    }

    const handleCourseUnitChange = (index, courseUnit) => {
        let newSelectedCourseUnits = [...courseUnits];
        if (newSelectedCourseUnits[index] !== courseUnit) {
            newSelectedCourseUnits[index] = courseUnit ? courseUnit : null;
        }
        setCourseUnits(newSelectedCourseUnits);

        setSelectedEvaluations((prevSelectedEvaluations) => {
            return prevSelectedEvaluations.map((item) => {
                return item && newSelectedCourseUnits.includes(item.courseUnits) ? item : null;
            })
        });

        if (courseUnit) {
            axios.get(`/course-units/${courseUnit}/epoch-types/${epochTypeId}`).then((res) => {
                if (res.status === 200) {
                    setSelectedEpochs((prevSelectedEpochs) => {
                        let newSelectedEpochs = [...prevSelectedEpochs];
                        newSelectedEpochs[index] = res.data;
                        return newSelectedEpochs;
                    });
                }
            });
        }
    };

    const evaluationSelectionHandler = (courseIndex, value) => {
        setSelectedEvaluations((prevSelectedEvaluations) => {
            let newSelectedEvaluations = [...prevSelectedEvaluations];
            if (!newSelectedEvaluations[courseIndex]) {
                newSelectedEvaluations[courseIndex] = {};
            }
            // newSelectedEvaluations[epochIndex][courseUnits[courseIndex]] = ;
            if(value != ''){
                newSelectedEvaluations[courseIndex].courseUnits = courseUnits[courseIndex];
                newSelectedEvaluations[courseIndex].value  = value;
            }
            else
                delete newSelectedEvaluations[courseIndex];
            return newSelectedEvaluations;
        })
    };


    const setColumnCount = (courseUnitsCount) =>{
        setColumns(columns > courseUnitsCount ? columns : courseUnitsCount);
    }

    const remakeEpochs = () => {
        const selectedEvaluationIds = new Set(
            selectedEvaluations.flatMap(evaluation => evaluation.value)
        );
        console.log("SElected IDs ",selectedEvaluationIds)

        setSelectedEpochs(selectedEpochs.map((epoch) => ({
            ...epoch,
            methods: epoch.methods.map(method => ({
                ...method,
                has_group: selectedEvaluationIds.has(method.id) ? true : method.has_group
            }))
        })))
        setSelectedEvaluations([]);
    }

    const groupEvaluations = () => {
        if(selectedEvaluations.length >=2){
            axios.post(`/method-groups`,{ methods: selectedEvaluations, epoch_type_id: epochTypeId }).then((res) => {
                if (res.status === 201) {
                    toast(t('Métodos de avaliação agrupados com sucesso!'), successConfig);
                    //TODO register the group in the modal
                    remakeEpochs()

                }
                else if(res.status === 204  ){
                    toast(t('Método já está associado a um grupo!'), errorConfig);
                }
                else{
                    toast(t('Erro ao agrupar métodos!'), errorConfig);
                }
            });
        }
        else{
            toast(t('Necessário selecionar mais do que um método!'), errorConfig);
        }
        loadGroupedMethods();
    }


    const editMethodGroup= (methods, course_units) => {
        console.log("Methods", methods)
        console.log("CourseUnits", course_units)
    }

     useEffect(() => {
         console.log(selectedEpochs)
     },[selectedEpochs])

    const loadGroupedMethods= () => {
        if (epochTypeId && unitId ){
            axios.get(`/method-groups`, {
                    params: {
                        epochTypeId: epochTypeId,
                        courseUnitId: unitId
                    }
                }
            ).then((res) => {
                if (res.status === 200) {
                    setGroupedMethodsList(res.data.data);
                    setIsLoading(false);
                }
            });
        }
    }

    // TODO every method that no longer has_groups should be changed in the list itself for dropdown options
    const remove = (methodGroupId) => {
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
                setRemovingMethodGroup(methodGroupId);

                axios.delete(`/method-groups/${methodGroupId}`).then((res) => {
                    setRemovingMethodGroup(null);
                    loadGroupedMethods();

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

    return (
        <Modal size={'fullscreen'} closeOnEscape closeOnDimmerClick open={isOpen} onClose={closeModal}>
            <Modal.Header>{t("Agrupar Métodos")}</Modal.Header>
            <Modal.Content>
                { (!groupedMethodsList || groupedMethodsList?.length < 1) || isLoading ? (
                        <EmptyTable isLoading={isLoading} label={t("Ohh! Não foi possível encontrar Métodos Agrupados!")} />
                    ) : (
                        <Table celled fixed striped selectable>
                            <Table.Header>
                                <Table.Row>
                                    {tableColumns.map((col, index) => (
                                        <Table.HeaderCell key={index} textAlign={col.align} style={ col.style } >{col.name}</Table.HeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { groupedMethodsList?.map(({ id, methods, course_units, courses, num_methods }, index ) => (
                                    <Table.Row key={index}>
                                        {/*<Table.Cell>{description}</Table.Cell>*/}
                                        <Table.Cell>
                                            <List bulleted>
                                                {methods?.map((method, methodIndex) => (
                                                    <List.Item key={"method_" + methodIndex}>
                                                        <List.Content>
                                                            <List.Header>{ method.description }</List.Header>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>{ t('Nota mínima') + ': ' }</div>
                                                                <div><b>{ method.minimum }</b></div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>{ t('Peso') + ': ' }</div>
                                                                <div><b>{ method.weight + '%' }</b></div>
                                                            </div>
                                                        </List.Content>
                                                    </List.Item>
                                                ))}
                                            </List>
                                        </Table.Cell>
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
                                        <Table.Cell textAlign="center">{num_methods}</Table.Cell>
                                        <Table.Cell textAlign="center">
                                            {/*<ShowComponentIfAuthorized permission={[SCOPES.EDIT_UC_GROUPS]}>*/}
                                            {/*    <Link to={`/agrupamento-unidade-curricular/edit/${id}`}>*/}
                                                    <Button color="yellow" icon onClick={()=>editMethodGroup(methods,course_units)}>
                                                        <Icon name="edit"/>
                                                    </Button>
                                                {/*</Link>*/}
                                            {/*</ShowComponentIfAuthorized>*/}
                                            {/*<ShowComponentIfAuthorized permission={[SCOPES.DELETE_UC_GROUPS]}>*/}
                                                <Button onClick={() => remove(id) } color="red" icon loading={removingMethodGroup === id}>
                                                    <Icon name="trash"/>
                                                </Button>
                                            {/*</ShowComponentIfAuthorized>*/}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    )
                }

                <br/>

                <Form>
                    <CardGroup>
                        {Array.from({ length: columns }, (_, index) => (
                            <Card key={index}>
                                <CardContent style={{height: '95px'}} >
                                    {index === 0 ? (
                                            <Form.Input
                                                fluid
                                                label={t("Unidade Curricular")}
                                                readOnly
                                                value={i18n.language === "en" ? courseUnit?.name_en : courseUnit?.name_pt}
                                            />
                                        ) : (
                                            <CourseUnits school={school} semester={semester} hasMethods currentCourseUnits={courseUnits ? courseUnits : []}
                                                         setColumn={setColumns} column={columns}
                                                eventHandler={(selectedUnit) =>
                                                    handleCourseUnitChange(index, selectedUnit)
                                                }
                                                isSearch={false}
                                            />
                                    )}
                                </CardContent>
                                <CardContent style={{minHeight:"112.33px"}}>
                                    { courseUnits[index] && selectedEpochs[index] && (
                                        <div
                                            key={selectedEpochs[index]?.id}
                                        >
                                            <Header as="span">
                                                {i18n.language === "en" ? selectedEpochs[index]?.name_en : selectedEpochs[index]?.name_pt}
                                            </Header>
                                            <Form.Dropdown
                                                disabled={selectedEpochs[index]?.methods?.length === 0}
                                                fluid
                                                clearable
                                                selection
                                                options={selectedEpochs[index]?.methods?.filter(method => !method.has_group)
                                                    .map(method => ({
                                                        key: method.id,
                                                        value: method.id,
                                                        text: method.description,
                                                    }))}
                                                label={t("Métodos")}
                                                placeholder={t("Método de avaliação")}
                                                onChange={
                                                    (e, {value}) => evaluationSelectionHandler(index, value)
                                                }
                                            />
                                        </div>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        ))}
                        {columns < 4 && (
                                <Button className={'add-column-btn'}
                                    style={{ marginTop : '1rem',height:"30px"}}  color={"blue"} floated={"left"} onClick={addColumn} >
                                    <Icon name="add" />
                                </Button>
                                )}

                        <div className={"group-container-evaluation"}>
                            <div className={"add-group-evaluations"}>
                                <div
                                    className={ "btn-group-evaluations" }
                                >
                                    <Button color={"green"} floated={"right"}
                                            onClick={() =>groupEvaluations()} width={2}>
                                        Agrupar Avaliações
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardGroup>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={closeModal}>
                    {t("Sair")}
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default GroupedMethods;

