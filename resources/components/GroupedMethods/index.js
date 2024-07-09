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
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEpochsOptions, setSelectedEpochsOptions] = useState([]);
    const [inEditGroup, setInEditGroup] = useState();
    const [removedFromGroupMethods, setRemovedFromGroupMethods] = useState([]);

    useEffect(() => {
        setSelectedEpochs([epochs]);
    }, [epochs, epochTypeId]);

    const addColumn = () => {
        setColumns(columns + 1); // Increment the number of columns
    };

    const closeModal = () =>{
        remakeEpochs();

        onClose();
    }

    const defineCourseUnit =()=>{
        setCourseUnits([parseInt(unitId)]);
        if(unitId){
            axios.get(`/course-units/${unitId}`).then((res) => {
                if (res.status === 200) {
                    setCourseUnit(res.data.data);
                    setSemester(res.data.data.semester);
                    setSchool(res.data.data.school);
                }
            });
        }
    }

    useEffect(() => {
        loadGroupedMethods();
        defineCourseUnit();
    }, [unitId, epochTypeId]);

    const setOptions =(epochsChosen) =>{
        if(epochsChosen && epochsChosen.length > 0){
            const options = epochsChosen?.map((epoch) => {
                if(isEditMode){
                    return epoch.methods?.filter(method => !method.has_group || method.group_id === inEditGroup)
                        .map(method => {
                            return {
                                key: method.id,
                                value: method.id,
                                text: method.description,
                            };
                        });
                }
                else{
                    return epoch.methods?.filter(method => !method.has_group)
                        .map(method => {
                            return {
                                key: method.id,
                                value: method.id,
                                text: method.description,
                            };
                        });
                }
            });
            setSelectedEpochsOptions(options);
        }
    }

    useEffect(() => {
        setOptions(selectedEpochs);
    }, [selectedEpochs]);

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

    const remakeEpochs = () => {
        const selectedEvaluationIds = new Set(
            selectedEvaluations.flatMap(evaluation => evaluation.value)
        );
        setIsEditMode(false);
        setInEditGroup(null);
        setCourseUnits([unitId]);
        setSelectedEvaluations([]);
    }
    const changeCurrentEpochValue = (newGroup) => {
        const selectedEpochsCopy = selectedEpochs.map(() => ({ ...selectedEpochs[0] }));


        setSelectedEpochs((prevEpoch) => {
            const updatedEpochs = prevEpoch.map((epoch) => {
                return {
                    ...epoch,
                    methods: epoch.methods.map(method => ({
                        ...method,
                        has_group: selectedEvaluations.find(evaluation => evaluation.value === method.id) ? false : method.has_group,
                        group_id: selectedEvaluations.find(evaluation => evaluation.value === method.id) ? null : method.group_id
                    }))
                };
            });
            return updatedEpochs;
        });
        setSelectedEpochs(selectedEpochsCopy);
    }


    const groupEvaluations = () => {
        if(selectedEvaluations.length >=2){
            const axiosFn = isEditMode ? axios.patch : axios.post;
            axiosFn(`/method-groups/${isEditMode ? inEditGroup : ''}`, {methods: selectedEvaluations, epoch_type_id: epochTypeId}).then((res) => {
                if (res.status >= 200 && res.status <204) {
                    toast(t(`O agrupamento de métodos foi ${isEditMode ? 'editado' : 'criado'} com sucesso!`), successConfig);
                    loadGroupedMethods();
                    changeCurrentEpochValue(res.data.id);
                    remakeEpochs();

                }
                else if (res.status === 204) {
                    toast(t('Método já está associado a um grupo!'), errorConfig);
                }
                else {
                    toast(t('Erro ao agrupar métodos!'), errorConfig);
                }
            });
        }
        else{
            toast(t('Necessário selecionar mais do que um método!'), errorConfig);
        }
    }

    const editMethodGroup = (groupId, methods, course_units) => {
        const courseUnitIds = [parseInt(unitId), ...course_units.map(course_unit => course_unit.id).filter(id => id !== parseInt(unitId))];
        setCourseUnits(courseUnitIds);
        setColumns(courseUnitIds.length);
        setIsEditMode(true);
        setInEditGroup(groupId);

        let newSelectedEpochs = [...selectedEpochs];
        courseUnitIds.forEach((courseUnitId, index) => {
            if (courseUnitId !== parseInt(unitId)) {
                axios.get(`/course-units/${courseUnitId}/epoch-types/${epochTypeId}`).then((res) => {
                    setSelectedEpochs(prevSelectedEpochs => {
                        let newSelectedEpochs = [...prevSelectedEpochs];
                        newSelectedEpochs[index] = res.data;
                        return newSelectedEpochs;
                    });
                });
            }
        });
        setSelectedEvaluations((prevSelectedEvaluations) => {
            let newSelectedEvaluations = [...prevSelectedEvaluations];

            courseUnitIds.forEach((courseUnitId, index) => {
                const method = methods.find(method => method.courseUnitId === courseUnitId);

                if (!newSelectedEvaluations[index]) {
                    newSelectedEvaluations[index] = {};
                }

                newSelectedEvaluations[index].courseUnits = course_units[index].id;
                newSelectedEvaluations[index].value = method.id;

            });
            return newSelectedEvaluations;
        })
    }

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

    useEffect(() => {
    }, [selectedEpochsOptions]);

    const remove = (methodGroupId, methods) => {
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
                    if (res.status === 200) {
                        loadGroupedMethods();
                        toast( t('Agrupamento eliminado com sucesso!'), successConfig);
                        let methodsToRemove = [];
                        methods.forEach( (method,index) => {
                                methodsToRemove[index] = method.id
                            }
                        )

                        //Change methods removed to methods.has_group = false
                        setSelectedEpochs((prevEpoch) => {
                            const updatedEpochs = prevEpoch.map((epoch) => {
                                return {
                                    ...epoch,
                                    methods: epoch.methods.map(method => ({
                                        ...method,
                                        has_group: methodsToRemove.includes(method.id) ? false : method.has_group,
                                        group_id: methodsToRemove.includes(method.id) ? null : method.group_id
                                    }))
                                };
                            });
                            return updatedEpochs;
                        });


                        remakeEpochs();
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
                <Header>
                    {(i18n.language === "en" ? epochs?.name_en : epochs?.name_pt)}
                </Header>
                { (!groupedMethodsList || groupedMethodsList?.length < 1) || isLoading ? (
                    <EmptyTable isLoading={isLoading} label={t("Não existem métodos Agrupados!")} />
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
                                        <Button color="yellow" icon onClick={()=>editMethodGroup(id ,methods, course_units)}>
                                            <Icon name="edit"/>
                                        </Button>
                                        <Button onClick={() => remove(id, methods) } color="red" icon loading={removingMethodGroup === id}>
                                            <Icon name="trash"/>
                                        </Button>
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
                                                     setColumn={setColumns} column={columns} unitId={courseUnits[index]}
                                                     eventHandler={(selectedUnit) =>
                                                         handleCourseUnitChange(index, selectedUnit)
                                                     }
                                                     isSearch={false}
                                        />
                                    )}
                                </CardContent>
                                <CardContent style={{minHeight:"112.33px"}}>
                                    { courseUnits[index] && selectedEpochsOptions[index] && (
                                        <div
                                            key={selectedEpochsOptions[index]?.id}
                                        >
                                            <Header as="span">
                                                {i18n.language === "en" ? selectedEpochsOptions[index]?.name_en : selectedEpochsOptions[index]?.name_pt}
                                            </Header>
                                            <Form.Dropdown
                                                disabled={selectedEpochsOptions[index]?.methods?.length === 0}
                                                fluid
                                                clearable
                                                selection
                                                value = {selectedEvaluations[index]?.value || null}
                                                options= {selectedEpochsOptions[index]}
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
                                        {isEditMode ? t("Confirmar Alterações") : t("Agrupar Métodos")}
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

