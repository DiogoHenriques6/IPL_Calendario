import React, {useEffect, useState} from 'react';
import {DateInput} from 'semantic-ui-calendar-react-yz';
import {Container, Card, Form, Button, Icon, Table, Header} from 'semantic-ui-react';
import {Field, useField} from 'react-final-form';
import axios from "axios";
import {useTranslation} from "react-i18next";
import EmptyTable from "../../../components/EmptyTable";
import moment from "moment";
import {toast} from "react-toastify";
import {successConfig} from "../../../utils/toastConfig";

const Step2 = ({isActive, initialDate, finalDate, additionalInterruptions, setAdditionalInterruptions, removeAdditionalInterruptions, holidays, tenWeek}) => {
    const { t } = useTranslation();

    const [interruptionTypes, setInterruptionTypes] = useState([]);
    const [holidaysList, setHolidaysList] = useState([]);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
    const [firstYear, setFirstYear] = useState(0);
    const [lastYear, setLastYear] = useState(0);
    const [interruptionsList, setInterruptionsList] = useState([]);


    const { input: weekTen } = useField('step2.week_ten');


    const importHolidays = () => {
        setIsLoadingHolidays(true);
        axios.get('/new-calendar/interruptions?first_year=' + firstYear + "&last_year=" + lastYear).then((response) => {
            if (response.status === 200) {
                let holidays = [];
                response.data.forEach(item => {
                    let holidayDate = new Date(item.date);
                    if(holidayDate >= initialDate  && holidayDate <= finalDate) {
                        holidays.push(item);
                    }
                });
                setHolidaysList(holidays);
            }
            setIsLoadingHolidays(false);
        });
    }

    const removeInterruption = (index) => {
        setInterruptionsList((current) => {
            const copy = [...current];
            copy.splice(index, 1);
            return copy;
        });
        setAdditionalInterruptions((current) => {
            const copy = [...current];
            copy.splice(index, 1);
            return copy;
        });
        removeAdditionalInterruptions(index);
    }

    // First it will get the years -> 1
    useEffect(() => {
        if(initialDate !== 0 && initialDate !== undefined && finalDate !== 0 && finalDate !== undefined) {
            setFirstYear(initialDate.getFullYear());
            setLastYear(finalDate.getFullYear());
        }
    }, [initialDate, finalDate]);

    // Secondly will get the holidays -> 2
    useEffect(() => {
        if(isActive && additionalInterruptions.length === 0) {
            // making sure the values are not empty to then call the action with the dates
            if(firstYear !== 0 && lastYear !== 0) {
                importHolidays();
                get10Week();
            }
        }
    }, [firstYear, lastYear, isActive]);

    // This will update the PARENT component that
    // the holidays where updated
    useEffect(() => {
        holidays(holidaysList);
    }, [holidaysList]);

    // This will get the type of interruptions
    useEffect(() => {
        axios.get('/interruption-types').then((response) => {
            if (response.status === 200) {
                response.data.data.unshift({id: '', label: t("Tipo de interrupção")});
                setInterruptionTypes(response.data.data?.map(({id, label, mandatory}) => ({
                    key: id,
                    value: id,
                    text: label,
                    icon: (mandatory ? {color: 'red', name: 'attention'} : undefined),
                    //description: '1st semester'
                    //label: (mandatory ? { color: 'red', empty: true, circular: true } : { empty: true, circular: true }),
                })));
            }
        });
    }, []);

    // Options to create the date on the list
    // -> new Date(item.date).toLocaleDateString(lang, options) <-
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const lang = (localStorage.getItem('language') === "en" ? "en-US" : "pt-PT");


    useEffect(() => {
        if(initialDate !== undefined && finalDate !== undefined) {
            get10Week();
        }
    }, [initialDate, finalDate, additionalInterruptions, interruptionsList]);

    const addLocalInterruptions = (startDate = undefined, endDate = undefined, oldStartDate = undefined, oldEndDate = undefined) => {
        if(startDate && endDate) {
            let oldIndex = -1;
            if(oldStartDate && oldEndDate){
                oldIndex = interruptionsList.findIndex((item) => item.start_date == oldStartDate && item.end_date == oldEndDate);
            }
            setInterruptionsList((current) => {
                const copy = [...current];
                const newData = {start_date: startDate, end_date: endDate};
                if(oldIndex > -1 ){
                    copy[oldIndex] = newData;
                } else {
                    copy.push(newData);
                }
                return copy;
            });
        }
    }

    const get10Week = () => {
        const firstDate = moment(initialDate);
        const lastDate = moment(finalDate);
        const numberOfWeeks = lastDate.diff(firstDate, 'weeks');
        let weeksToAdd = 0;
        if(numberOfWeeks >= 10){
            interruptionsList.forEach((item) => {
                if(item.start_date && item.end_date) {
                    let start_date = moment(item.start_date, "DD-MM-YYYY");
                    let end_date = moment(item.end_date, "DD-MM-YYYY");
                    if( moment(weekTen.value, 'DD-MM-YYYY').isAfter(start_date, 'DD-MM-YYYY') ) {
                        const diffDays = end_date.diff(start_date, 'days');
                        let diffWeeks = end_date.diff(start_date, 'weeks');
                        if (diffDays >= 5) {
                            if (diffWeeks >= 2 || diffDays > 11) {
                                diffWeeks = Math.round(diffDays / 6);
                                weeksToAdd = weeksToAdd + diffWeeks;
                            } else {
                                weeksToAdd++;
                            }
                        }
                    }
                }
            });
            // first week does not count, so, it will be:
            // first week + 10 weeks + number of full weeks without school
            const tenthWeek = moment(initialDate).add(11 + weeksToAdd, 'weeks');
            tenWeek(tenthWeek.format('DD-MM-YYYY'));
            if(weeksToAdd >  0 || moment(tenthWeek).isAfter(weekTen.value)){
                toast(t('10 semana atualizada!'), successConfig);
            }
            weekTen.onChange(tenthWeek.format('DD-MM-YYYY'));
        }
    }

    return (
        <Container>
            <Card.Content className={"margin-bottom-l"}>
                <Header as={"h3"}>{ t("Data 10 semana") }</Header>
                <Field name={`step2.week_ten`}>
                    {({input: weekTenInput}) => (
                        <Form.Field width={5}>
                            <DateInput name="date" iconPosition="left" placeholder="Data 10 semana" minDate={initialDate} maxDate={finalDate} initialDate={weekTenInput.value || new Date()} markColor={"blue"}
                                       value={weekTenInput.value} {...weekTenInput} closable onChange={(evt, {value}) => {weekTenInput.onChange(value);}}/>
                        </Form.Field>
                    )}
                </Field>
            </Card.Content>
            <Card.Content>
                { isLoadingHolidays ?
                    (
                        <EmptyTable isLoading={isLoadingHolidays} label={t("Não existem feriados neste intervalo de datas")}/>
                    ) : (
                        <div>
                            <Header as={"h3"}>{ t("Lista de Feriados") }</Header>
                            <Table compact celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={6}>{t("Feriado")}</Table.HeaderCell>
                                        <Table.HeaderCell width={9} textAlign={"center"} >{t("Data do Feriado")}</Table.HeaderCell>
                                        <Table.HeaderCell width={1} />
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    { holidaysList.map((item, index) => (
                                        <Table.Row key={index} active>
                                            <Table.Cell>{ item.name }</Table.Cell>
                                            <Table.Cell textAlign={"center"}>{ new Date(item.date).toLocaleDateString(lang, options) }</Table.Cell>
                                            <Table.Cell textAlign={"center"}>
                                                <Button onClick={() => setHolidaysList((current) => {
                                                    const copy = [...current];
                                                    copy.splice(index, 1);
                                                    return copy;
                                                })} icon color="red">
                                                    <Icon name="trash"/>
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>

                                <Table.Footer fullWidth>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='4'>
                                            <Button icon labelPosition='right' color={"green"} size='small' onClick={importHolidays}>
                                                <Icon name='calendar' /> {t("Importar Feriados")}
                                            </Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                        </div>
                    )
                }
            </Card.Content>
            <Card.Content className={"margin-top-l"}>
                <Header as={"h3"}>{ t("Lista de Interrupções") }</Header>
                <Table compact celled className={"definition-last"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>{t("Tipo de Interrupção")}</Table.HeaderCell>
                            <Table.HeaderCell width={5}>{t("Data de Início")}</Table.HeaderCell>
                            <Table.HeaderCell width={5}>{t("Data de Fim")}</Table.HeaderCell>
                            <Table.HeaderCell width={1} />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {additionalInterruptions.map((_, index) => (
                            <Field name={`step2.additional_interruptions.${index}.start_date`} key={'step2_field_' + index} >
                                {({input: startDateInput}) => (
                                    <Field name={`step2.additional_interruptions.${index}.end_date`}>
                                        {({input: endDateInput}) => (
                                            <Field name={`step2.additional_interruptions.${index}.interruption_type_id`}>
                                                {({input: interruptionTypeInput}) => (
                                                    <Table.Row key={index}>
                                                        <Table.Cell width={5}>
                                                            {_.name}
                                                            <Form.Dropdown value={_.interruption_type_id} selectOnBlur={false} clearable={true} placeholder={t("Tipo de Interrupção")} selection search
                                                                           options={interruptionTypes}
                                                                           onChange={(e, {value}) => interruptionTypeInput.onChange(value)}/>
                                                        </Table.Cell>
                                                        <Table.Cell width={5}>
                                                            <Form.Field>
                                                                <DateInput name="date" markColor={"blue"} iconPosition="left" closable placeholder={t("Data de Início")}
                                                                           minDate={initialDate} maxDate={finalDate} value={startDateInput.value}
                                                                           initialDate={finalDate}
                                                                           onChange={(evt, {value}) => {
                                                                               addLocalInterruptions(value, endDateInput.value, startDateInput.value, endDateInput.value);
                                                                               startDateInput.onChange(value);
                                                                           }}/>
                                                            </Form.Field>
                                                        </Table.Cell>
                                                        <Table.Cell width={5}>
                                                            <Form.Field>
                                                                <DateInput name="date" iconPosition="left" closable placeholder={t("Data de Fim")} markColor={"blue"}
                                                                           maxDate={finalDate} minDate={startDateInput.value} value={endDateInput.value} {...endDateInput}
                                                                           initialDate={startDateInput.value}
                                                                           onChange={(evt, {value}) => {
                                                                               addLocalInterruptions(startDateInput.value, value, startDateInput.value, endDateInput.value);
                                                                               endDateInput.onChange(value);
                                                                           }}/>
                                                            </Form.Field>
                                                        </Table.Cell>
                                                        <Table.Cell width={5}>
                                                            <Button onClick={() => removeInterruption(index)} icon color="red">
                                                                <Icon name="trash"/>
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )}
                                            </Field>
                                        )}
                                    </Field>
                                )}
                            </Field>
                        ))}
                    </Table.Body>
                </Table>
            </Card.Content>
        </Container>
    );
}
export default Step2;
