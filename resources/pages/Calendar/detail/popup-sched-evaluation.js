import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Field, Form as FinalForm} from 'react-final-form';
import {DateInput, TimeInput} from 'semantic-ui-calendar-react-yz';
import {Button, Divider, Form, Grid, GridColumn, Header, Icon, Modal, Checkbox, TextArea, Message} from 'semantic-ui-react';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {errorConfig, successConfig} from '../../../utils/toastConfig';

const SweetAlertComponent = withReactContent(Swal);

const PopupScheduleEvaluation = ( {scheduleInformation, interruptions, isOpen, onClose, addedExam, updatedExam, deletedExam, calendarDates} ) => {
    const { t } = useTranslation();
    // get URL params
    let { id } = useParams();
    const calendarId = id;

    const [epochsList, setEpochsList] = useState([]);
    const [loadRemainingCourseUnits, setLoadRemainingCourseUnits] = useState(false);
    const [selectedEpoch, setSelectedEpoch] = useState();
    const [selectedCourseUnitId, setSelectedCourseUnitId] = useState(-1);
    const [courseUnits, setCourseUnits] = useState([]);
    const [methodList, setMethodList] = useState([]);

    const [changeData, setChangeData] = useState(false);
    const [savingExam, setSavingExam] = useState(false);
    const [showEmptyUcs, setShowEmptyUcs] = useState(false);
    const [showMissingMethodsLink, setShowMissingMethodsLink] = useState(false);
    const [showRepeatedMethodsWarning, setShowRepeatedMethodsWarning] = useState(false);

    const [epochStartDate, setEpochStartDate] = useState();
    const [epochEndDate, setEpochEndDate] = useState();

    const [showOtherUnits, setShowOtherUnits] = useState(false);
    const [otherCourseUnits, setOtherCourseUnits] = useState([]);

    useEffect( () => {
        if(!!scheduleInformation.epochs) {
            let availableEpochs = scheduleInformation.epochs.filter((epoch) => {
                return moment(scheduleInformation.date_start, 'YYYY-MM-DD').isBetween(moment(epoch.start_date), moment(epoch.end_date), 'day', '[]' );
            });
            setEpochsList(availableEpochs);

            if(scheduleInformation.epoch_id > 0 ) {
                setSelectedEpoch(scheduleInformation.epoch_id);
                setLoadRemainingCourseUnits(true);
            }
            else {
                let chosenEpoch = availableEpochs.filter((epoch) => epoch.code === scheduleInformation.selected_epoch?.code );
                setSelectedEpoch(chosenEpoch[0].id);
                setEpochStartDate(moment(chosenEpoch[0].start_date).format("DD-MM-YYYY"));
                setEpochEndDate(moment(chosenEpoch[0].end_date).format("DD-MM-YYYY"));
                setLoadRemainingCourseUnits(true);
            }
        }
    }, [scheduleInformation])

    useEffect(() => {
        console.log(scheduleInformation);
        if (loadRemainingCourseUnits) {
            axios.get(`/available-methods/${calendarId}/?epoch_id=${selectedEpoch}&year=${scheduleInformation.scholarYear}`)
                .then((response) => {
                    if (response.status === 200) {
                        let beforeSetCourseUnits = response.data.data;

                        const mapped = beforeSetCourseUnits?.map(({id, name, methods, is_complete, has_methods}) => ({
                                key: id,
                                value: id,
                                text: name,
                                methods,
                                icon: ((!has_methods ? {color: 'yellow', name:'warning circle'} : is_complete ? {color: 'green', name:'check circle'} : undefined)),
                                description: (!has_methods ? t("Métodos em falta") : undefined),
                                disabled: !has_methods,
                            }),
                        );
                        mapped.push({key: 'other', value: 'other', text: t("Outra Unidade Curricular"), description: t("Matemáticas, Inglês, etc...")});

                        setCourseUnits(mapped);
                        // has curricular unit with missing methods?
                        //setShowMissingMethodsLink(response.data.data?.length === 0 || beforeSetCourseUnits?.length === 0);
                        setShowMissingMethodsLink(beforeSetCourseUnits.filter((item) => !item.has_methods).length > 0);
                        setShowEmptyUcs(response.data.data.length === 0);
                    }
                });
            setLoadRemainingCourseUnits(false);
        }
    }, [loadRemainingCourseUnits, scheduleInformation]);


    useEffect(() => {
        setShowMissingMethodsLink(courseUnits.filter((item) => !item?.methods?.length > 0 && item.key !== 'other' ).length > 0);
        if(showOtherUnits){
            axios.get(`/available-methods/${calendarId}/others?epoch_id=${selectedEpoch}&year=${scheduleInformation.scholarYear}`)
                .then((response) => {
                    if (response.status === 200) {
                        let beforeSetCourseUnits = response.data.data;
                        const mapped = beforeSetCourseUnits?.map(({id, name, methods, is_complete, has_methods}) => ({
                                key: id,
                                value: id,
                                text: name,
                                methods,
                                icon: ((!has_methods ? {color: 'yellow', name:'warning circle'} : is_complete ? {color: 'green', name:'check circle'} : undefined)),
                                description: (!has_methods ? t("Métodos em falta") : undefined),
                                disabled: !has_methods,
                            }),
                        );

                        setShowMissingMethodsLink(beforeSetCourseUnits.filter((item) => !item.has_methods).length > 0);
                        setOtherCourseUnits(mapped);
                    }
                });
        }
    }, [showOtherUnits]);


    const epochDropdownOnChange = (event, value) => {
        setCourseUnits([]);
        setSelectedEpoch(value);
        setLoadRemainingCourseUnits(true);

        let selectedEpoch = epochsList.filter((epoch) => epoch.id === value);
        setEpochStartDate(moment(selectedEpoch[0].start_date).format("DD-MM-YYYY"));
        setEpochEndDate(moment(selectedEpoch[0].end_date).format("DD-MM-YYYY"));
    };

    const methodListFilterHandler = (course_unit_id) => {
        setSelectedCourseUnitId(course_unit_id);
        if(course_unit_id !== "other"){
            let allUnits = courseUnits.concat(otherCourseUnits);

            if(allUnits?.length > 0 ) {
                setMethodList(
                    allUnits.find((courseUnit) => courseUnit.value === course_unit_id)?.methods
                        .map(({id, description, name, minimum, weight, is_done}) => ({
                            key: id,
                            value: id,
                            text: (description || name),
                            description: `Min. ${minimum} / ${t('Peso')}: ${parseInt(weight, 10)}%`,
                            icon: (is_done ? {color: 'green', name:'check circle'} : undefined),
                        })
                    )
                );
            }
        }
    };

    const checkMethodAlreadyScheduled = (methodId) => {
        const allUnits = courseUnits.concat(otherCourseUnits);
        let courseUnitMethods = allUnits.find((courseUnit) => courseUnit.value === selectedCourseUnitId)?.methods;
        if(courseUnitMethods.length > 0) {
            let foundMethod = courseUnitMethods.find((method) => method.id === methodId);
            if(foundMethod?.is_done) {
                setShowRepeatedMethodsWarning(true);
                return false;
            }
        }
        setShowRepeatedMethodsWarning(false);
        return false;
    };

    useEffect(() => {
        if(courseUnits?.length > 0 ) {
            if( !!scheduleInformation?.exam_id ) {
                methodListFilterHandler(scheduleInformation.course_unit_id);
            }
        }
    }, [courseUnits]);

    const onSubmitExam = (values) => {
        setSavingExam(true);
        const dateStart = moment(values.date_start, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const dateEnd = values.date_end ? moment(values.date_end, 'DD-MM-YYYY').format('YYYY-MM-DD') : dateStart;

        const examScheduleObj = {
            calendar_id: parseInt(calendarId, 10),
            course_id: parseInt(scheduleInformation?.courseId),
            course_unit_id: values.courseUnit == 'other' ? values.otherCourseUnit :  values.courseUnit,
            group_id: values.group_id,
            date_start: dateStart,
            date_end: dateEnd,
            duration_minutes: values.durationMinutes || undefined,
            epoch_id: selectedEpoch,
            in_class: values.inClass || false,
            hour: values.hour || undefined,
            method_id: values.method,
            observations_pt: values.observationsPT || undefined,
            observations_en: values.observationsEN || undefined,
            room: values.room || undefined,
        };

        const axiosFn = values?.exam_id ? axios.patch : axios.post;
        axiosFn(`/exams/${values?.exam_id ? values?.exam_id : ''}`, examScheduleObj)
            .then((res) => {
                setSavingExam(false);
                if (res.status === 200) {
                    toast(t('Avaliação atualizado com sucesso'), successConfig);
                    updatedExam(res.data);
                } else if (res.status === 201) {
                    toast(t('Avaliação marcada com sucesso'), successConfig);
                    addedExam(res.data);
                } else {
                    toast(`Ocorreu um erro ao gravar a avaliação!`, errorConfig);
                    toast(res.response.data, errorConfig);
                }
                onClose();  // close modal
            });
    };

    useEffect(() => {
        if (!isOpen) {
            setShowMissingMethodsLink(false);
            setShowOtherUnits(false);
            setSelectedEpoch(undefined);
            setCourseUnits([]);
            setMethodList([]);
            setChangeData(false);
        }
    }, [isOpen]);

    const removeExam = (examId) => {
        const sweetAlertConfigs = {
            title: t('Atenção!'),
            html: t('Ao eliminar esta avaliação, terá de adicioná-la novamente em outra data a escolher!<br/><br/><strong>Tem a certeza que deseja eliminar esta avaliação?</strong>'),
            denyButtonText: t('Não'),
            confirmButtonText: t('Sim'),
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: '#21ba45',
            denyButtonColor: '#db2828',
        };

        SweetAlertComponent.fire(sweetAlertConfigs).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/exams/${examId}`).then((res) => {
                    if (res.status === 200) {
                        toast(t('Avaliação eliminada com sucesso deste calendário!'), successConfig);
                        deletedExam(examId);
                    } else {
                        toast(t('Ocorreu um problema ao eliminar a avaliação deste calendário!') + " " +  res.response.data, errorConfig);
                    }
                    onClose();
                });
            }
        });
    };
    const onCloseHandler = () => {
        setShowRepeatedMethodsWarning(false);
        onClose();
    };

    return (
        <FinalForm onSubmit={onSubmitExam}
            initialValues={{
                exam_id:         scheduleInformation?.exam_id ? scheduleInformation?.exam_id           : null,
                date_start:      moment(scheduleInformation?.date_start, "YYYY-MM-DD").format('DD-MM-YYYY'),
                date_end:        moment(scheduleInformation?.date_end, "YYYY-MM-DD").format('DD-MM-YYYY'),
                durationMinutes: scheduleInformation?.exam_id ? scheduleInformation?.duration_minutes  : null,
                observationsPT:  scheduleInformation?.exam_id ? scheduleInformation?.observations_pt   : null,
                observationsEN:  scheduleInformation?.exam_id ? scheduleInformation?.observations_en   : null,
                inClass:         scheduleInformation?.exam_id ? scheduleInformation?.in_class          : null,
                hour:            scheduleInformation?.exam_id ? scheduleInformation?.hour              : null,
                room:            scheduleInformation?.exam_id ? scheduleInformation?.room              : null,
                courseUnit:      scheduleInformation?.exam_id ? scheduleInformation?.course_unit_id    : -1,
                otherCourseUnit: scheduleInformation?.exam_id ? scheduleInformation?.course_unit_id    : -1,
                method:          scheduleInformation?.exam_id ? scheduleInformation?.method_id         : -1,
                group_id:        scheduleInformation?.exam_id ? scheduleInformation?.group_id          : null
            }}
            render={({handleSubmit}) => (
                <Modal closeOnEscape closeOnDimmerClick open={isOpen} onClose={onClose}>
                    <Modal.Header>
                        { scheduleInformation?.exam_id ? t("Editar Avaliação")  :  t("Marcar Avaliação") }
                    </Modal.Header>
                    <Modal.Content scrolling>
                        <Form warning>
                            <Header as="h4">{ t("Detalhes da avaliação") } </Header>
                            <Grid columns={2}>
                                <GridColumn>
                                    <p>
                                        <b>{ t("Curso") }: </b>
                                        {scheduleInformation?.courseName}
                                    </p>
                                    <p>
                                        <b>{ t("Ano Curricular") }: </b>
                                        { t("Ano") + " " + scheduleInformation?.scholarYear}
                                    </p>
                                </GridColumn>
                                <GridColumn>
                                    <div>
                                        <Field name="date_start">
                                            {({input: dateStartInput}) => (
                                                <Field name="date_end">
                                                    {({input: dateEndInput}) => {
                                                        if(changeData){
                                                            return (
                                                                <Form.Group widths='equal'>
                                                                    <DateInput placeholder={ t("Inserir data inicial") } label={ t("Data inicial") }
                                                                               iconPosition="left" dateFormat={"DD-MM-YYYY"}
                                                                               initialDate={ moment(scheduleInformation?.date_start, 'DD-MM-YYYY').format('DD-MM-YYYY') }
                                                                               minDate={ moment(epochStartDate || calendarDates.minDate, 'DD-MM-YYYY') }
                                                                               maxDate={ moment(epochEndDate || calendarDates.maxDate, 'DD-MM-YYYY') }
                                                                               {...dateStartInput}
                                                                               onChange={(evt, {value}) => {
                                                                                   let hasInterruptions = interruptions.filter((interruption) => {
                                                                                       return moment(interruption.start_date).isSameOrBefore(moment(value, 'DD-MM-YYYY')) &&
                                                                                           moment(interruption.start_date).isSameOrAfter(moment(value, 'DD-MM-YYYY')) &&
                                                                                           moment(interruption.end_date).isSameOrBefore(moment(value, 'DD-MM-YYYY')) &&
                                                                                           moment(interruption.end_date).isSameOrAfter(moment(value, 'DD-MM-YYYY'))
                                                                                   });
                                                                                   if(hasInterruptions.length === 0) {
                                                                                       dateStartInput.onChange(value);
                                                                                       dateEndInput.onChange(value);
                                                                                       // save this dates to validate number of days for message
                                                                                       scheduleInformation.date_start = moment(value, 'DD-MM-YYYY').format("YYYY-MM-DD");
                                                                                       scheduleInformation.date_end = moment(value, 'DD-MM-YYYY').format("YYYY-MM-DD");
                                                                                   } else {
                                                                                       toast(t('Data em conflito com interrupção existente!'), errorConfig);
                                                                                   }
                                                                               }}
                                                                    />
                                                                    <DateInput placeholder={ t("Inserir data final") } label={ t("Data final") }
                                                                               iconPosition="left" dateFormat={"DD-MM-YYYY"}
                                                                               initialDate={ moment(scheduleInformation?.date_end, 'DD-MM-YYYY').format('DD-MM-YYYY') }
                                                                               minDate={ moment(epochStartDate || calendarDates.minDate, 'DD-MM-YYYY') }
                                                                               maxDate={ moment(epochEndDate || calendarDates.maxDate, 'DD-MM-YYYY') }
                                                                               value={ moment(scheduleInformation?.date_end).format('DD-MM-YYYY') }
                                                                               {...dateEndInput}
                                                                               onChange={(evt, {value}) => {
                                                                                   let hasInterruptions = interruptions.filter((interruption) => {
                                                                                       return moment(interruption.start_date).isSameOrBefore(moment(value, 'DD-MM-YYYY')) &&
                                                                                           moment(interruption.start_date).isSameOrAfter(moment(value, 'DD-MM-YYYY')) &&
                                                                                           moment(interruption.end_date).isSameOrBefore(moment(value, 'DD-MM-YYYY')) &&
                                                                                           moment(interruption.end_date).isSameOrAfter(moment(value, 'DD-MM-YYYY'))
                                                                                   });
                                                                                   if(hasInterruptions.length === 0) {
                                                                                       dateEndInput.onChange(value);
                                                                                       // save this dates to validate number of days for message
                                                                                       scheduleInformation.date_end = moment(value, 'DD-MM-YYYY').format("YYYY-MM-DD");
                                                                                   } else {
                                                                                       toast(t('Data em conflito com interrupção existente!'), errorConfig);
                                                                                   }
                                                                               }}
                                                                    />
                                                                </Form.Group>
                                                            )
                                                        } else {
                                                            return (
                                                                <div>
                                                                    { dateStartInput.value === dateEndInput.value ? dateStartInput.value : dateStartInput.value + ` ${t("até")} ` + dateEndInput.value }
                                                                </div>
                                                            )
                                                        }
                                                    }}
                                                </Field>
                                            )}
                                        </Field>
                                    </div>
                                    { !showEmptyUcs && (
                                        <p className="margin-top-s">
                                            <Button color={ !changeData ? 'yellow' : undefined } icon labelPosition="left" onClick={() => setChangeData((old) => !old)}>
                                                <Icon name="calendar alternate"/>
                                                { !changeData ? t("Alterar data") : t("Cancelar edição") }
                                            </Button>
                                        </p>
                                    )}
                                    { moment(scheduleInformation?.date_end, "YYYY-MM-DD").diff(moment(scheduleInformation?.date_start, "YYYY-MM-DD"), "d") > 5  && (
                                        <Message size='tiny' warning={true}>
                                            <div>{ t("Esta avaliação dura mais do que 5 dias")}.</div>
                                        </Message>
                                    )}
                                </GridColumn>
                            </Grid>
                            <Divider/>
                            { showEmptyUcs ? (
                                <Message size='tiny' info={true}>
                                    <div>{ t("Não tem Unidades Curriculares associadas para os dados selecionados ou não tem permissões.")}</div>
                                </Message>
                            ) : (
                                <Grid columns={2}>
                                    <GridColumn>
                                        {!scheduleInformation?.id && (
                                            <>
                                                <Field name="epoch">
                                                    {({input: epochInput}) => (
                                                        <Form.Dropdown
                                                            options={epochsList.map((epoch) => ({ key: epoch.id, value: epoch.id, text: epoch.name }))}
                                                            value={selectedEpoch || -1}
                                                            selection search
                                                            label={ t("Época") }
                                                            onChange={(e, {value}) => epochDropdownOnChange(e, value)}
                                                        />
                                                    )}
                                                </Field>
                                                <Field name="courseUnit">
                                                    {({input: courseUnitInput}) => (
                                                        <Field name="otherCourseUnit">
                                                            {({input: otherCourseUnitInput}) => (
                                                                <div className={"field"}>
                                                                    <Form.Dropdown
                                                                        options={courseUnits}
                                                                        label={ t("Unidade Curricular") }
                                                                        {...courseUnitInput}
                                                                        selection search
                                                                        selectOnBlur={false}
                                                                        placeholder={t("Selecione a Unidade Curricular")}
                                                                        disabled={!courseUnits?.length}
                                                                        loading={courseUnits !== undefined ? !courseUnits.length : false}
                                                                        onChange={(e, {value, options}) => {
                                                                            if(value === "other") {
                                                                                setShowOtherUnits(true);
                                                                            } else {
                                                                                setShowOtherUnits(false);
                                                                                methodListFilterHandler(value);
                                                                            }
                                                                            courseUnitInput.onChange(value);
                                                                        }}
                                                                    />
                                                                    {showOtherUnits && (
                                                                        <div>
                                                                            { otherCourseUnits?.length === 0 ? (
                                                                                <Message size='tiny' info={true}>
                                                                                    <div>{ t('Sem outras Unidades curriculares para mostrar') }</div>
                                                                                </Message>
                                                                            ) : (
                                                                                <Form.Dropdown
                                                                                    options={otherCourseUnits}
                                                                                    label={ t("Unidade Curricular - Outras") }
                                                                                    {...otherCourseUnitInput}
                                                                                    selection search
                                                                                    selectOnBlur={false}
                                                                                    placeholder={t("Selecione a Unidade Curricular - Outras")}
                                                                                    disabled={!otherCourseUnits?.length}
                                                                                    loading={otherCourseUnits !== undefined ? !otherCourseUnits.length : false}
                                                                                    onChange={(e, {value, options}) => {
                                                                                        methodListFilterHandler(value);
                                                                                        otherCourseUnitInput.onChange(value);
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Field>
                                                    )}
                                                </Field>

                                                { showMissingMethodsLink && (
                                                        <Message size='tiny' warning={true}>
                                                            <div>{ t("Existem Unidades Curriculares sem métodos definidos.")}</div>
                                                            <div className='margin-top-xs'>
                                                                <a href={ "/unidade-curricular?curso="+scheduleInformation?.courseId} target="_blank">{ t("Preencha aqui")} <Icon name="external alternate" /></a>
                                                            </div>
                                                        </Message>
                                                    )}
                                                <Field name="method">
                                                    {({input: methodInput}) => (
                                                        <Form.Dropdown
                                                            label={ t("Elemento de Avaliação")}
                                                            options={ methodList }
                                                            {...methodInput}
                                                            selection search
                                                            selectOnBlur={false}
                                                            placeholder={t("Selecione o elemento de Avaliação")}
                                                            disabled={ !methodList?.length}
                                                            loading={ methodList !== undefined ? !methodList.length : false }
                                                            onChange={(e, {value}) => {
                                                                methodInput.onChange(value);
                                                                checkMethodAlreadyScheduled(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                { showRepeatedMethodsWarning && (
                                                        <Message size='tiny' warning={true}>
                                                            <div><b>{ t("O elemento de avaliação selecionado já se encontra calendarizado.")}</b></div>
                                                            <div className='margin-top-xs'>{ t("Verifique se quer mesmo marcar este elemento novamente.")}</div>
                                                        </Message>
                                                    )}
                                            </>
                                        )}
                                    </GridColumn>
                                    <GridColumn>
                                        <>
                                            <Field name="inClass" type="checkbox">
                                                {({input: inClassInput}) => (
                                                    <>
                                                        {/* <Grid columns={2} verticalAlign="middle">
                                                            <GridColumn className='margin-bottom-s'> */}
                                                                <Form.Field>
                                                                    <Checkbox toggle label={ t("Na aula")} name="inClass" checked={inClassInput.checked}
                                                                        onChange={(evt, {checked}) => { inClassInput.onChange(checked) }}/>
                                                                </Form.Field>
                                                            {/* </GridColumn> */}

                                                            { ! inClassInput.checked && (
                                                                // <GridColumn>
                                                                    <Field name="hour">
                                                                        {({input: hourInput}) => (
                                                                            <Form.Field>
                                                                                <TimeInput label={ t("Hora de ínicio")} name="hour" iconPosition="left" placeholder={ t("Hora de ínicio (opcional)")} timeFormat="24" value={hourInput.value}
                                                                                            onChange={(evt, {value}) => { hourInput.onChange(value); }}/>
                                                                            </Form.Field>
                                                                        )}
                                                                    </Field>
                                                                // </GridColumn>
                                                            )}
                                                        {/* </Grid> */}
                                                        { ! inClassInput.checked && (
                                                            <Field name="room" defaultValue={scheduleInformation?.id ? scheduleInformation?.room : null}>
                                                                {({input: roomInput}) => (
                                                                    <Form.Input label={ t("Sala")} placeholder={ t("Sala da avaliação (opcional)")} {...roomInput} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    </>
                                                )}
                                            </Field>
                                            <Field name="durationMinutes">
                                                {({input: durationMinutesInput}) => (
                                                    <Form.Input label={ t("Duração")} placeholder={ t("Duração em minutos (opcional)")}  type="number" step="1"{...durationMinutesInput}/>
                                                )}
                                            </Field>
                                            <Field name="observationsPT">
                                                {({input: observationsPTInput}) => (
                                                    <Form.Input label={ t("Observações PT")} control={TextArea} rows={2} {...observationsPTInput}/>
                                                )}
                                            </Field>
                                            <Field name="observationsEN">
                                                {({input: observationsENInput}) => (
                                                    <Form.Input label={ t("Observações EN")} control={TextArea} rows={2} {...observationsENInput}/>
                                                )}
                                            </Field>
                                        </>
                                    </GridColumn>
                                </Grid>
                            )}
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        { scheduleInformation.exam_id && (
                            <Button floated='left' negative icon labelPosition='left' onClick={() => removeExam(scheduleInformation?.exam_id)}>
                                <Icon name="trash alternate outline" />
                                { t("Remover avaliação") }
                            </Button>
                        )}
                        <Button onClick={onCloseHandler} >{ t("Cancelar") }</Button>
                        { !showEmptyUcs && (
                            <Button onClick={handleSubmit} positive loading={savingExam}>
                                { scheduleInformation?.exam_id ? t("Gravar alterações") : t("Marcar Avaliação") }
                            </Button>
                        )}
                    </Modal.Actions>
                </Modal>
            )}
        />
    );
};
export default PopupScheduleEvaluation;
