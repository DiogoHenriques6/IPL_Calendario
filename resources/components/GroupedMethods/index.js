import {
    Button,
    Card,
    CardContent, CardGroup, Container,
    Form,
    Header,
    Icon,
    Modal
} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import CourseUnits from "../Filters/CourseUnits";
import axios from "axios";
import {toast} from "react-toastify";
import {errorConfig} from "../../utils/toastConfig";


const GroupedMethods = ({isOpen, onClose, epochs, unitId}) => {
    const { t, i18n } = useTranslation();
    const [courseUnits, setCourseUnits] = useState([]);
    const [columns, setColumns] = useState(2);
    const [selectedCourseUnits, setSelectedCourseUnits] = useState([]);
    const [selectedEpochs, setSelectedEpochs] = useState([]);
    const [courseUnit, setCourseUnit] = useState();
    const [school, setSchool] = useState();
    const [semester, setSemester] = useState();
    const [selectedEvaluations, setSelectedEvaluations] = useState([]);

    useEffect(() => {
        setSelectedEpochs([epochs]);
    }, [epochs]);

    const addColumn = () => {
        setColumns(columns + 1); // Increment the number of columns
    };

    const closeModal = () =>{
        setColumns(2);
        onClose();
    }

    useEffect(() => {
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
    }, [unitId]);

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
                return Object.keys(item).reduce((acc, key) => {
                    if (newSelectedCourseUnits.includes(parseInt(key))) {
                        acc[key] = item[key];
                    }
                    return acc;
                }, {});
            })
        });

        if (courseUnit) {
            axios.get(`/course-units/${courseUnit}/methods`).then((res) => {
                if (res.status === 200) {
                    // setEpochs(res.data);
                    setSelectedEpochs((prevSelectedEpochs) => {
                        const newSelectedEpochs = [...prevSelectedEpochs];
                        newSelectedEpochs[index] = res.data;
                        return newSelectedEpochs;
                    });
                }
            });
        }
    };

    const evaluationSelectionHandler = (courseIndex, epochIndex, value) => {
        setSelectedEvaluations((prevSelectedEvaluations) => {
            const newSelectedEvaluations = [...prevSelectedEvaluations];
            if (!newSelectedEvaluations[epochIndex]) {
                newSelectedEvaluations[epochIndex] = {};
            }
            // newSelectedEvaluations[epochIndex][courseUnits[courseIndex]] = ;
            if(value != '')
                newSelectedEvaluations[epochIndex][courseUnits[courseIndex]] = value;
            else
                delete newSelectedEvaluations[epochIndex][courseUnits[courseIndex]];
            return newSelectedEvaluations;
        })
    };

    const groupEvaluations = (index) => {
        if(hasMoreThanOneCourseUnit(index)){
            axios.post(`/method-groups`,{ methods: selectedEvaluations[index], epoch_type_id: index + 1   }).then((res) => {
                if (res.status === 201) {
                    toast(t('Métodos de avaliação agrupados com sucesso!'), successConfig);
                    //TODO register the group in the modal
                }
                if(res.status === 204  ){
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
    }

    const hasMoreThanOneCourseUnit = (index) => {
        if (index >= selectedEvaluations.length) {
            return false;
        }
        // Get the object at the specified index
        const obj = selectedEvaluations[index];
        // Get the keys of the object
        const keys = Object.keys(obj);
        // Check if there is more than 1 key
        return keys.length > 1;
    };

    return (
        <Modal size={'fullscreen'} closeOnEscape closeOnDimmerClick open={isOpen} onClose={closeModal}>
            <Modal.Header>{t("Agrupar Métodos")}</Modal.Header>
            <Modal.Content>
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
                                            <CourseUnits school={school} semester={semester} hasMethods currentCourseUnit={unitId}
                                                eventHandler={(selectedUnit) =>
                                                    handleCourseUnitChange(index, selectedUnit)
                                                }
                                                isSearch={false}
                                            />
                                    )}
                                </CardContent>
                                <CardContent style={{minHeight: '600px'}}>
                                    { courseUnits[index] && selectedEpochs[index]?.map((item, epochIndex) => (
                                        <div
                                            className={epochIndex > 0 ? "margin-top-m" : ""}
                                            key={epochIndex}
                                        >
                                            <Header as="span">
                                                {i18n.language === "en" ? item.name_en : item.name_pt}
                                            </Header>
                                            <Form.Dropdown
                                                disabled={item.methods?.length === 0}
                                                fluid
                                                clearable
                                                selection
                                                options={item.methods.map(method => ({
                                                    key: method.id,
                                                    value: method.id,
                                                    text: method.name,
                                                }))}
                                                label={t("Métodos")}
                                                placeholder={t("Método de avaliação")}
                                                onChange={
                                                    (e, {value}) => evaluationSelectionHandler(index, epochIndex, value)
                                                }
                                            />
                                        </div>
                                        ))
                                    }
                                </CardContent>
                            </Card>
                        ))}
                        {columns < 4 && (
                                <Button style={{ marginTop : '1rem', width: "30px",height:"30px"}}  color={"blue"} floated={"left"} onClick={addColumn} >
                                    <Icon name="add"/>
                                </Button>
                                )}

                        <div className={"group-container-evaluation"}>
                            <div className={"add-group-evaluations"}>
                                {  epochs && epochs?.map((item, index) => (
                                        <div
                                            className={index > 0 ? "btn-group-evaluations margin-top-m" : "btn-group-evaluations" }
                                            key={index}
                                        >
                                            <Header as="span">
                                                {i18n.language === "en" ? item.name_en : item.name_pt}
                                            </Header>
                                            <Button color={"green"} floated={"right"}
                                                    onClick={() =>groupEvaluations(index)} width={2}>
                                                Agrupar Avaliações
                                            </Button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </CardGroup>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={closeModal}>
                    {t("Cancel")}
                </Button>
                <Button positive onClick={handleSubmit}>
                    {t("Confirmar")}
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default GroupedMethods;

