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


const GroupedMethods = ({isOpen, onClose, epochs, unitId}) => {
    const { t, i18n } = useTranslation();
    const [courseUnits, setCourseUnits] = useState([]);
    const [columns, setColumns] = useState(2);
    const [selectedCourseUnits, setSelectedCourseUnits] = useState([]);
    const [selectedEpochs, setSelectedEpochs] = useState([]);
    const [courseUnit, setCourseUnit] = useState();
    const [school, setSchool] = useState();
    const [semester, setSemester] = useState();

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
        setCourseUnits((prevSelectedCourseUnits) => {
            const newSelectedCourseUnits = [...prevSelectedCourseUnits];
            if (newSelectedCourseUnits[index] !== courseUnit) {
                newSelectedCourseUnits[index] = courseUnit ? courseUnit : null;
                console.log("Course Units", newSelectedCourseUnits);
            }
            return newSelectedCourseUnits;
        });
        console.log(courseUnit)
        if (courseUnit) {
            console.log("here")
            axios.get(`/course-units/${courseUnit}/methods`).then((res) => {
                if (res.status === 200) {
                    console.log(res?.data);
                    // setEpochs(res.data);
                    setSelectedEpochs((prevSelectedEpochs) => {
                        const newSelectedEpochs = [...prevSelectedEpochs];
                        newSelectedEpochs[index] = res.data;
                        console.log("SelectedEpochs" ,newSelectedEpochs);
                        return newSelectedEpochs;
                    });
                }
            });
        }
    };

    const evaluationSelectionHandler = (index, epochIndex, value) => {
        // Assuming you have a state to hold the evaluations
        /*setEvaluations(prevEvaluations => {
            const newEvaluations = [...prevEvaluations];
            if (!newEvaluations[index]) {
                newEvaluations[index] = {};
            }
            if (!newEvaluations[index][epochIndex]) {
                newEvaluations[index][epochIndex] = {};
            }
            newEvaluations[index][epochIndex].selectedMethodId = value;
            return newEvaluations;
        });*/
    };
    const groupEvaluations = (index) => {

    }

    return (
        <Modal size={'fullscreen'} closeOnEscape closeOnDimmerClick open={isOpen} onClose={closeModal}>
            <Modal.Header>{t("Agrupar Métodos")}</Modal.Header>
            <Modal.Content>
                <Form>
                    {/*<Header as="h4">{t("Selecione Unidades Curriculares")}</Header>*/}
                    {/*<Container>*/}
                    <CardGroup >
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
                                    // )
                                    }
                                </CardContent>
                            </Card>
                        ))}
                        {columns < 4 && (
                                <Button style={{ marginTop : '1rem', width: "30px",height:"30px"}}  color={"blue"} floated={"left"} onClick={addColumn} >
                                    <Icon name="add"/>
                                </Button>
                                )}
                            {/*{  epochs && epochs?.map((item, index) => (*/}

                            {/*            <Button className={'btn-add-interruption'} color={"green"} floated={"right"} onClick={groupEvaluations(index)} width={2}>*/}
                            {/*                Agrupar Avaliações*/}
                            {/*            </Button>*/}
                            {/*        ))*/}
                            {/*    }*/}

                    </CardGroup>
                    {/*</Container>*/}
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

