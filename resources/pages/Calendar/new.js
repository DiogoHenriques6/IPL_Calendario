import React, {useState} from 'react';
import {Link, useNavigate,} from 'react-router-dom';
import {Button, Card, Checkbox, Container, Form, Header, Icon, Message, Popup, Step} from 'semantic-ui-react';
import {Field, Form as FinalForm} from 'react-final-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';
import Step1 from './new/Step1';
import Step2 from './new/Step2';
import Step3 from './new/Step3';
import {useTranslation} from "react-i18next";

const SweetAlertComponent = withReactContent(Swal);

const formInitialValues = {
    step1: {
        semester: "first_semester",
    },
    step2: {
        interruptions: {},
        noInterruptions: false,
        week_ten: null,
    },
    step3: {
        allCourses: false,
        paginationInfo: {
            current_page: 1,
            last_page: 1,
        }
    },
};

const NewCalendar = () => {
    const history = useNavigate();
    const { t } = useTranslation();

    const stepsData = [
        {
            number: 1,
            icon: 'calendar alternate outline',
            title: t('Épocas'),
            description: t('Selecione o semestre do calendário a criar, assim como as datas das épocas.')
        },
        {
            number: 2,
            icon: 'pause',
            title: t('Interrupções Letivas'),
            description: t('Insira todas as informações das Interrupções letivas.')
        },
        {
            number: 3,
            icon: 'book',
            title: t('Cursos'),
            description: t('Insira os cursos para os quais deseja criar o calendário.')
        }
    ];


    const [activeSemester, setActiveSemester] = useState(0);
    const [loading, setLoading] = useState(true);

    const [allCourses, setAllCourses] = useState(false);
    const [courses, setCourses] = useState([]);

    const [isSaving, setIsSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [maxStep, setMaxStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    // step 2
    const [initialDate, setInitialDate] = useState(0);
    const [finalDate, setFinalDate] = useState(0);
    const [holidaysList, setHolidaysList] = useState([]);
    const [additionalInterruptions, setAdditionalInterruptions] = useState([]);
    const [tenWeekDate, setTenWeekDate] = useState();

    const [selectedEpoch, SetSelectedEpoch] = useState();

    const addCourse = (course) => {
        setCourses([...courses, {...course}]);
    };

    const addCoursesList = (coursesList) => {
        const uniqueIds = [];
        const fullCourses = [ ...courses, ...coursesList];

        const uniqueCourses = fullCourses.filter(element => {
            const isDuplicate = uniqueIds.includes(element.id);
            if (!isDuplicate) {
                uniqueIds.push(element.id);
                return true;
            }
            return false;
        });

        setCourses(uniqueCourses);
        //setCourses([...courses, ...coursesList]);
    };

    const removeCourse = (id) => {
        setCourses([...courses.filter((course) => course.id !== id)]);
    };
    const clearAllCourses = () => {
        setCourses([]);
    }

    const setTenWeek = (date) => {
        setTenWeekDate(date);
    }

    const validateStep1 = (values) => {
        let isValid = false;
        // Check for the semester
        const hasSemester = values.semester !== "";
        // Check for every type of dates and if has start and end
        const hasEpochs = values.hasOwnProperty("seasons") && values.seasons && values.seasons[values.semester] && Object.keys(values.seasons).length > 0;
        let hasAllDates = true;
        let hasInvalidDates = false;
        let errorTexts = [];
        if(hasEpochs) {
            const keys = Object.keys(values.seasons[values.semester]);
            let initialDate = 0;
            let finalDate = 0;
            // get lower and higher dates
            keys.forEach((key, index) => {
                if(!values.seasons[values.semester][key].hasOwnProperty("start_date") || !values.seasons[values.semester][key].hasOwnProperty("end_date")){
                    hasAllDates = false;
                } else {
                    // create date from  different format
                    let startDate = (values.seasons[values.semester][key].start_date).split("-");
                    let compStartDate = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
                    // check if year is lower than the current one
                    if(initialDate > compStartDate || initialDate === 0) {
                        initialDate = compStartDate;
                    }
                    let endDate = (values.seasons[values.semester][key].end_date).split("-");
                    let compEndDate = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);
                    if(finalDate < compEndDate || finalDate === 0) {
                        finalDate = compEndDate;
                    }
                    if(key === "normal_season" || key === "resource_season"){
                        let endDate_Previous = (values.seasons[values.semester][(key === "normal_season" ? "periodic_season" : "resource_season")].end_date).split("-");
                        let compEndDate_Previous = new Date(endDate_Previous[2] + "-" + endDate_Previous[1] + "-" + endDate_Previous[0]);
                        if(compEndDate_Previous > compEndDate){
                            hasInvalidDates = true;
                            errorTexts.push("A data de fim da avaliação da época " + (key === "normal_season" ? "normal" : " de recurso") + " não pode ser inferior á época anterior.");
                        }
                    }
                }
            });
            setInitialDate(initialDate);
            setFinalDate(finalDate);
        }
        if(!hasSemester){
            errorTexts.push("Tem de selecionar pelo menos um semestre!");
        }
        if(!hasEpochs){
            errorTexts.push("Tem de adicionar as datas para o calendário");
        }
        if(!hasAllDates){
            errorTexts.push("Tem de preencher todas as datas de início e fim dos períodos");
        }
        isValid = hasSemester && hasEpochs && hasAllDates && !hasInvalidDates && errorTexts.length === 0;
        setErrorMessages(errorTexts);
        if(!isValid){
            // clear next steps because of changes
            setCompletedSteps([...completedSteps.filter((step) => step < 1)]);
            setMaxStep(1);
        } else {
            SetSelectedEpoch(values.semester);
        }

        return isValid;
    }

    const validateStep2 = (values) => {
        let isValid = false;
        // validate if the no interruptions was clicked, and go to next phase
        if(values.hasOwnProperty("noInterruptions") && values.noInterruptions){
            setErrorMessages([]);
            return true;
        }
        const hasInterruptions = additionalInterruptions.length > 0 && values.hasOwnProperty("additional_interruptions") && values.additional_interruptions && values.additional_interruptions.length > 0;
        let hasAllDates = true;
        let hasAllInterruptionsTypes = true;
        let hasAllMandatoryInterruptions = true;
        if(hasInterruptions) {
            const keys = Object.keys(values.additional_interruptions);
            keys.forEach((key, index) => {
                if(!additionalInterruptions.includes(parseInt(key))){
                    delete values.additional_interruptions[key];
                } else {
                    if (!values.additional_interruptions[key].hasOwnProperty("start_date") || !values.additional_interruptions[key].hasOwnProperty("end_date")) {
                        hasAllDates = false;
                    }
                    if (!values.additional_interruptions[key].hasOwnProperty("interruption_type_id")) {
                        hasAllInterruptionsTypes = false;
                    }
                    // TODO finalize all mandatory interruptions
                    //if(values.additional_interruptions[key].hasOwnProperty("interruption_type_id") || values.additional_interruptions[key].interruption_type_id.includes(mandatoryInterruptions)){
                    //    hasAllMandatoryInterruptions = false;
                    //}
                }
            });
        }
        if(values.hasOwnProperty("additional_interruptions")) {
            if (values.additional_interruptions.length !== additionalInterruptions.length) {
                if (additionalInterruptions.length === 0) {
                    values.additional_interruptions = {};
                    delete values.additional_interruptions;
                    hasAllMandatoryInterruptions = false;
                } else {
                    hasAllDates = false;
                }
            }
        }

        let errorTexts = [];
        if(!hasInterruptions || !hasAllMandatoryInterruptions){
            errorTexts.push("Tem de adicionar e selecionar pelo menos uma das interrupções obrigatórias, assinaladas com o icon a vermelho");
        }
        if(!hasAllDates){
            errorTexts.push("Tem de preencher todas as datas de início e fim das interrupções");
        }
        if(!hasAllInterruptionsTypes){
            errorTexts.push("Tem de selecionar os tipos das interrupções!");
        }
        isValid = hasInterruptions && hasAllDates && hasAllInterruptionsTypes && hasAllMandatoryInterruptions;
        setErrorMessages(errorTexts);
        if(!isValid){
            // clear next steps because of changes
            setCompletedSteps([...completedSteps.filter((step) => step < 2)]);
            setMaxStep(2);
        }

        return isValid;
    }

    const validateStep3 = (values) => {
        let isValid = false;
        // Check for the semester
        const hasAllCourses = false;//values.allCourses;
        // Check if there is any course
        const hasAnyCourse = values.courses && values.courses.length > 0;

        let errorTexts = [];
        if(!hasAllCourses && !hasAnyCourse){
            errorTexts.push("Tem de adicionar pelo menos 1 curso");
        }
        isValid = hasAllCourses || hasAnyCourse;
        setErrorMessages(errorTexts);
        return isValid;
    }

    const nextStep = (stepNumber, values) => {
        let stepValid = false;

        if(stepNumber - 1 === 1){
            stepValid = validateStep1(values.step1);
        } else if(stepNumber - 1 === 2){
            stepValid = validateStep2(values.step2);
        } else if(stepNumber - 1 === 3){
            stepValid = validateStep3(values.step3);
        }
        if(stepValid){
            setCurrentStep(stepNumber);
            if(stepNumber > maxStep) {
                setMaxStep(stepNumber);
                setCompletedSteps([...completedSteps, stepNumber - 1]);
            }
        }
    };

    const stepHeader = (step) => {
        if(step <= maxStep){
            setCurrentStep(step);
        }
    }

    const onSubmit = (values) => {
        if(validateStep3(values.step3)) {
            setIsSaving(true);
            const body = {
                semester: values.step1.semester,
                is_all_courses: false, //values.step3.allCourses,
                //...(values.step3.allCourses ? null : {courses: [...values.step3.courses.map((x) => x.id)]}),
                courses: [...values.step3.courses.map((x) => x.id)],
                epochs: [
                    ...Object.keys(values.step1.seasons[values.step1.semester]).map((key) => ({
                        code: key.split('__')[0],
                        start_date: moment(values.step1.seasons[values.step1.semester][key].start_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                        end_date: moment(values.step1.seasons[values.step1.semester][key].end_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
                    })),
                ],
                week_ten:  tenWeekDate ? moment(tenWeekDate, "DD-MM-YYYY").format('YYYY-MM-DD') : null,
                holidays: holidaysList,
                interruptions: [
                    ...(values.step2?.additional_interruptions?.map(({interruption_type_id, start_date, end_date}) => ({
                            interruption_type_id,
                            start_date: moment(start_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                            end_date: moment(end_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                        }),
                    ) || []),
                ],
            };

            axios.post('/calendar', body).then((response) => {
                setIsSaving(false);
                const pluralOrSingularForm = values.step3.allCourses || values.step3.courses?.length > 1 ? 's' : '';
                if (response.status === 201) {
                    SweetAlertComponent.fire({
                        title: t('Sucesso!'),
                        text: t(`Calendário${pluralOrSingularForm} criado${pluralOrSingularForm} com sucesso!`),
                        icon: 'success',
                        confirmButtonColor: '#21ba45',
                    });
                    history('/calendario');
                } else {
                    let errors = [];
                    Object.keys(response.response.data.errors).map((key) => errors.push(...response.response.data.errors[key]));
                    setErrorMessages(errors);
                    SweetAlertComponent.fire({
                        title: t('Erro!'),
                        text: t(`Ocorreu um erro ao tentar criar o${pluralOrSingularForm} calendário${pluralOrSingularForm} de avaliação`),
                        icon: 'error',
                        confirmButtonColor: 'red',
                    });
                }
            });
        }
    };

    const addNewInterruption = () => {
        setAdditionalInterruptions((current) => [...current, current.length]);
    }
    const removeInterruption = (index) => {
        setAdditionalInterruptions((current) => {
            const copy = [...current];
            copy.splice(index, 1);
            return copy;
        });
    }
    const getHolidays = (holidays) => {
        setHolidaysList(holidays);
    }

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={formInitialValues} key={'form_new_calendar'} render={({handleSubmit, values}) => (
                <div>

                    <div className='main-content-title'>
                        <Header as="h2">{ t("Novo Calendário") }</Header>
                    </div>
                    <Step.Group widths={stepsData.length}>
                        {stepsData.map((step) => (
                            <Step link active={currentStep === step.number} disabled={maxStep < step.number} key={'step_' + step.number} completed={completedSteps.includes(step.number)} onClick={() => stepHeader(step.number)}>
                                <Icon name={step.icon}/>
                                <Step.Content>
                                    <Step.Title>{step.title}</Step.Title>
                                    <Step.Description>{step.description}</Step.Description>
                                </Step.Content>
                            </Step>
                        ))}
                    </Step.Group>
                    <Card fluid>
                        { errorMessages.length > 0 && (
                            <Card.Content>
                                <Message warning>
                                    <Message.Header>{ t('Os seguintes detalhes do Curso precisam da sua atenção:') }</Message.Header>
                                    <Message.List>
                                        { errorMessages.map((message, index) => (
                                            <Message.Item key={index}>
                                                { t(message) }
                                            </Message.Item>
                                        ))}
                                    </Message.List>
                                </Message>
                            </Card.Content>
                        )}
                        <Card.Content>
                            <Form autoComplete="off">
                                <div className={currentStep === 1 ? "display-block" : "display-none"}>
                                    <Step1 activeSemester={activeSemester} setActiveSemester={setActiveSemester} />
                                </div>
                                <div className={currentStep === 2 ? "display-block" : "display-none"}>
                                    <Step2 holidays={getHolidays} finalDate={finalDate} initialDate={initialDate} tenWeek={setTenWeek} isActive={currentStep === 2}
                                           additionalInterruptions={additionalInterruptions} setAdditionalInterruptions={setAdditionalInterruptions} removeAdditionalInterruptions={removeInterruption} />
                                </div>
                                <div className={currentStep === 3 ? "display-block" : "display-none"}>
                                    <Step3 allCourses={allCourses} epoch={selectedEpoch} setAllCourses={setAllCourses} courses={courses}
                                           removeCourse={removeCourse} addCourse={addCourse} addMultiCourses={addCoursesList} clearCourses={clearAllCourses}
                                           loading={loading} setLoading={setLoading}/>
                                </div>
                            </Form>
                        </Card.Content>
                        <Card.Meta className={"calendar-footer"}>
                            <div>
                                {currentStep === 2 && (
                                    <>
                                        <Button icon labelPosition="left" color="teal" disabled={values.step2.noInterruptions} onClick={addNewInterruption}>
                                            { t("Adicionar interrupção") }
                                            <Icon name="plus"/>
                                        </Button>
                                        <Field name="step2.noInterruptions" type="checkbox">
                                            {({ input: noInterruptions }) => (
                                                <Checkbox label={t('Sem Interrupções')} toggle checked={noInterruptions.checked} onClick={() => noInterruptions.onChange( !noInterruptions.checked) } />
                                            )}
                                        </Field>
                                        <Popup content={<>{ t("Este calendário não terá interrupções, por isso não precisam de ser adicionadas.") }<br/><br/>{ t("As interrupções já adicionadas irão ser criadas na mesma. Caso não pretenda criar, apague-as.") }</>} header={ t("Sem Interrupções") } trigger={<Icon name={"info circle"} />}/>
                                    </>
                                )}
                            </div>
                            <div>
                                {currentStep > 1 && (
                                    <Button icon labelPosition="left" color="green" onClick={() => setCurrentStep(currentStep - 1)}>
                                        { t("Anterior") }
                                        <Icon name="left arrow"/>
                                    </Button>
                                )}
                                {currentStep < 3 && (
                                    <Button icon labelPosition="right" color="green" onClick={() => nextStep(currentStep + 1, values)}>
                                        { t("Seguinte") } <Icon name="right arrow"/>
                                    </Button>
                                )}
                                {currentStep === 3 && (
                                    <Button icon labelPosition="left" color="blue" loading={isSaving} onClick={handleSubmit}>
                                        { t("Criar Calendário") }
                                        <Icon name="send"/>
                                    </Button>
                                )}
                            </div>
                        </Card.Meta>
                    </Card>
                </div>
            )} />
        </Container>
    );
};

export default NewCalendar;
