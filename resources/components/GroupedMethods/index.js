import {
    Button,
    Card,
    CardContent, CardGroup, Dropdown,
    Form,
    Grid,
    GridColumn,
    Header,
    Icon, Input,
    Label,
    Message,
    Modal,
    Table
} from "semantic-ui-react";
import AcademicYears from "../Filters/AcademicYears";
import React, {useEffect, useState} from "react";
import Courses from "../Filters/Courses";
import Slider from "../Slider";
import {useTranslation} from "react-i18next";
import CourseUnits from "../Filters/CourseUnits";
import _ from "lodash";
import axios from "axios";


const GroupedMethods = ({isOpen, onClose, epochs, unitId}) => {
    const { t, i18n } = useTranslation();
    const [courseUnits, setCourseUnits] = useState([]);
    const [columns, setColumns] = useState(2);
    const [selectedCourseUnits, setSelectedCourseUnits] = useState([]);
    const [courseUnit, setCourseUnit] = useState();

    useEffect(() => {
        setSelectedCourseUnits(epochs)
        // console.log(epochs)
    }, [epochs]);

    const addColumn = () => {
        setColumns(columns + 1); // Increment the number of columns
    };

    const closeModal = () =>{
        setColumns(2);
        onClose();
    }

    useEffect(() => {
        console.log("here")
        if(unitId){
            console.log("here")
            axios.get(`/course-units/${unitId}`).then((res) => {
                if (res.status === 200) {
                    console.log(res?.data?.data);
                    setCourseUnits(res.data.data.map(({ id, name }) => ({
                        key: id,
                        value: name,
                        // text: i18n.language === "en" ? name_en : name_pt,
                    })));

                    console.log( i18n.language ="en" ? res.data.data.name_en: res.data.data.name_pt)
                }
            });
        }
    }, [unitId]);

    const handleSubmit = () => {

    }


    return <Modal closeOnEscape closeOnDimmerClick open={isOpen} onClose={closeModal}>
        <Modal.Header>{t("Agrupar Métodos")}</Modal.Header>
        <Modal.Content>
            <Form>
                <Header as="h4">{t("Selecione Unidades Curriculares")}</Header>
                    <CardGroup>
                    {/*TODO have a max of 3/4 selectedCourses?*/}
                        {Array.from({length: columns}, (_, index) => (
                                <Card key={index}>
                                    <CardContent>
                                        {index == 0 ?(
                                                <Form.Input width={6} label={t("Unidade Curricular")}
                                                            readOnly />
                                        ):(
                                            <CourseUnits eventHandler={courseUnits} isSearch={false}/>
                                            )
                                        }
                                    </CardContent>
                                    <CardContent>
                                        {selectedCourseUnits?.map((item, epochIndex) => (
                                            <div className={ epochIndex > 0 ? "margin-top-m" : ""} key={epochIndex}>
                                                <Header as="span">{i18n.language == 'en' ? item.name_en: item.name_pt}</Header>
                                                <Form.Dropdown disabled={item.methods?.length == 0} selectOnBlur={false} width={6}
                                                               search clearable selection
                                                       options={item.methods} label={t("Métodos")} placeholder={ t(("Método de avaliação")) }
                                                        />
                                            </div>
                                        ))}

                                    </CardContent>
                                </Card>
                        ))}
                    </CardGroup>
                {columns < 4 &&(<Button onClick={addColumn} width={2}><Icon name={"add"}></Icon></Button>)}
            </Form>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={closeModal}>{ t("Cancel") }</Button>
            <Button positive onClick={handleSubmit}>{ t("Confirmar") }</Button>
        </Modal.Actions>
    </Modal>
}

export default GroupedMethods;