import React, {useEffect, useState, createRef} from 'react';
import {Field, Form as FinalForm} from 'react-final-form';
import {
    Button,
    Form,
    Header,
    Icon,
    Label,
    Message,
    Grid,
    GridColumn,
    Modal,
    Sticky,
    Table,
    Input
} from 'semantic-ui-react';
import axios from "axios";
import {toast} from "react-toastify";
import {errorConfig, successConfig} from "../../../utils/toastConfig";
import Slider from "../../../components/Slider";
import EmptyTable from "../../../components/EmptyTable";
import {useTranslation,} from "react-i18next";
import AcademicYears from "../../../components/Filters/AcademicYears";
import GroupedMethods from "../../../components/GroupedMethods";
import ShowComponentIfAuthorized, {useComponentIfAuthorized} from "../../../components/ShowComponentIfAuthorized";
import SCOPES from "../../../utils/scopesConstants";
import {Slider as SemanticSlider} from "react-semantic-ui-range";
import {value} from "lodash/seq";
import _ from "lodash";

const UnitTabMethods = ({ unitId, hasGroup, warningsHandler }) => {
    const { t, i18n } = useTranslation();
    const contextRef = createRef();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formValid, setFormValid] = useState(false);
    // Warnings
    const [hasWarnings, setHasWarnings] = useState(false);
    const [hasNoMethods, setHasNoMethods] = useState(false);
    const [hasOverWeight, setHasOverWeight] = useState(false);
    const [isUncomplete, setIsUncomplete] = useState(false);
    const [missingTypes, setMissingTypes] = useState(false);
    const [emptyWeight, setEmptyWeight] = useState(false);
    const [underWeight, setUnderWeight] = useState(false);

    const [epochs, setEpochs] = useState([]);
    const [evaluationTypes, setEvaluationTypes] = useState([]);
    const [removedMethods, setRemovedMethods] = useState([]);
    const [openClone, setOpenClone] = React.useState(false)
    const [selectedEpochFrom, setSelectedEpochFrom] = useState(-1);
    const [selectedEpochTo, setSelectedEpochTo] = useState([]);

    const [openCopy, setOpenCopy] = useState(false);
    const [openGroupMethods, setOpenGroupMethods] = useState(false);
    const [loadingUCs, setLoadingUCs] = useState(false);
    const [curricularUnitsOptions, setCurricularUnitsOptions] = useState([]);
    const [curricularUnitSelected, setCurricularUnitSelected] = useState(-1);
    const [academicYearSelected, setAcademicYearSelected] = useState(-1);
    const [epochToGroup, setEpochToGroup] = useState(-1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasChanged, setHasChanged] = useState(false);

    const isManagingMethods = useComponentIfAuthorized(SCOPES.MANAGE_EVALUATION_METHODS);

    const isFormValid = (methodList) => {
        let isValid = true;
        let hasOverValue = false;
        let HasUncompleteData = false;
        let noMethods = true;
        let hasMissingTypes = false;
        let hasEmptyWeight = false;
        let hasUnderWeight = false;

        if(methodList?.length > 0 ) {
            methodList.forEach((item) => {
                // check if it has more than 100%
                let methodWeight = item.methods.reduce((acc, curr) => curr.weight + acc, 0);
                if (Math.round(methodWeight) > 100) {
                    hasOverValue = true;
                }
                if (item.methods.length > 0 && Math.round(methodWeight) < 100) {
                    hasUnderWeight = true;
                    isValid = false;
                }
                //check if the existing methods have all fields filled
                item.methods?.filter((item) => !item.is_blocked).forEach((method) => {
                    if (!method.evaluation_type_id) {
                        hasMissingTypes = true;
                    }
                    //if (!method.weight) {
                    //    hasEmptyWeight = true;
                    //}
                    if (!(method.evaluation_type_id && method.minimum >= 0 && method.minimum <= 20)) { //method.weight &&
                        isValid = false;
                    }
                });
                if(item.methods.length > 0){
                    noMethods = false;
                }
            });
        }
        if(noMethods){
            isValid = false;
        }

        setHasWarnings(HasUncompleteData || hasMissingTypes || hasOverValue || hasEmptyWeight || hasUnderWeight || noMethods);
        setEmptyWeight(hasEmptyWeight);
        setIsUncomplete(HasUncompleteData);
        setMissingTypes(hasMissingTypes);
        setHasOverWeight(hasOverValue);
        setUnderWeight(hasUnderWeight);
        setHasNoMethods(noMethods);
        setFormValid(isValid);
    };

    useEffect(() => {
        // setAcademicYearSelected(localStorage.getItem('academicYearSelected') || -1);
        axios.get('/evaluation-types').then((res) => {
            if (res.status === 200) {
                res.data.data.unshift({id: '', name: t("Selecionar Tipo de avaliação"), enabled: true});
                setEvaluationTypes(res.data.data);
            }
        });
    }, []);

    useEffect(() => {
        loadMethods();
    }, [unitId]);

    useEffect(() => {
        warningsHandler(hasWarnings);
    }, [hasWarnings]);

    useEffect(() => {
        isFormValid(epochs);
    }, [epochs]);

    const loadMethods = () => {
        setIsLoading(true);
        setEpochs([]);
        axios.get(`/course-units/${unitId}/methods`).then((res) => {
            if (res.status === 200) {
                setEpochs(res.data);
                setIsLoading(false);
            }
        });
    };

    const onSubmit = () => {
        if (!isSaving) {
            setIsSaving(true);
            let methods = [];
            epochs.map((item) =>{
                item.methods.map((method) => {
                    methods.push({
                        id: method.id || undefined,
                        course_unit_id: unitId,
                        epoch_type_id: item.id,
                        evaluation_type_id: method.evaluation_type_id,
                        minimum: method.minimum,
                        weight: method.weight,
                        description_pt: method.description_pt,
                        description_en: method.description_en,
                        // copy[index].methods[methodIndex].description_pt = value;
                        initials_pt: method.initials_pt,
                        initials_en: method.initials_en
                    })
                });
            });
            setIsLoading(true);
            axios.post('/methods', {methods: [...methods], removed: [...removedMethods]}).then((res) => {
                setIsSaving(false);
                loadMethods();
                if (res.status === 200) {
                    toast(t('Métodos de avaliação criados com sucesso!'), successConfig);
                    setRemovedMethods([]);
                    setHasChanged(false);
                } else {
                    toast(t('Não foi possível criar os métodos de avaliação!'), errorConfig);
                }
            });
        }
    };

    // Get Epoch Type Total Value
    const getEpochValue = (index) => {
        return (epochs[index].methods || [])?.reduce((a, b) => a + (b?.weight || 0), 0);
    }

    //Remove method from epoch type record
    const removeMethod = (epochIndex, methodIndex) => {
        const removedId = epochs[epochIndex].methods[methodIndex]?.id;
        // TODO delete grouped elements based on grouped_id
        if (removedId) {
            setRemovedMethods((current) => [...current, removedId]);
        }
        setEpochs((current) => {
            const copy = [...current];
            copy[epochIndex].methods.splice(methodIndex, 1);
            return copy;
        });
        setHasChanged(true);
    };

    useEffect(() => {
        console.log(hasChanged)

    }, [hasChanged]);

    //Remove method to epoch type record
    const addNewMethod = (index, epoch_id) => {
        setEpochs((prevEpochs) => {
            const copy = [...prevEpochs];
            if (!copy[index].methods?.length) {
                copy[index].methods = [];
            }

            copy[index].methods.forEach((method, index) => {
                method.weight = defaultWeight;
                return method;
            });
            console.log(copy[index].methods)
            //
            // // Calculate the new total weight
            // let newWeight = 100 - copy[index].methods.reduce((a, b) => a + (b?.weight || 0), 0);
            //
            // // Adjust the first method's weight to ensure the total is 100
            // if (methodsLength > 0) {
            //     copy[index].methods[0].weight += newWeight;
            // }

            copy[index].methods.push({
                epoch_type_id: epoch_id,
                weight: defaultWeight,
                minimum: 0,
                evaluation_type_id: undefined,
                description_pt: '',
                description_en: '',
                initials_pt: '',
                initials_en: '',
                is_blocked: false
            });

            // Recalculate weights
            const methodsLength = copy[index].methods.length;
            const defaultWeight = 100 / methodsLength;

            // Distribute default weight
            copy[index].methods.forEach(method => {
                method.weight = defaultWeight;
            });

            setHasChanged(true);
            return copy;
        });
    }

    const updateMethodMinimum = (index, methodIndex, value) => {
        if (value > 20)
            value = 20
        else if (value < 0 || !value)
            value = 0;
        setEpochs((current) => {
            const copy = [...current];
            copy[index].methods[methodIndex].minimum = parseFloat(value);
            return copy;
        })
    }

    const updateMethodWeight = (index, methodIndex, value) => {
        if (value > 100)
            value = 100
        else if (value < 0 || !value)
            value = 0;
        setEpochs((current) => {
            const copy = [...current];
            copy[index].methods[methodIndex].weight = parseFloat(value);
            return copy;
        })
        setHasChanged(true);
    }

    const cloneMethods = () => {
        if( selectedEpochFrom === -1 || selectedEpochTo.length === 0 ) {
            toast(t('Tens de selecionar as duas épocas que pretendes copiar! De onde para onde.'), errorConfig);
            return false;
        }

        if( selectedEpochTo.includes(selectedEpochFrom) ) {
            toast(t('As épocas selecionadas têm de ser diferentes!'), errorConfig);
            return false;
        }

        let methodsToClone = JSON.parse(JSON.stringify(epochs.find((epoch) => epoch.id === selectedEpochFrom).methods));
        let copyEpochs = JSON.parse(JSON.stringify(epochs));
        // remove ids so it creates a new record
        methodsToClone.forEach((item) => delete item.id);

        selectedEpochTo.forEach((item) => {
            let currEpochIndex = copyEpochs.findIndex((epoch) => epoch.id === item);

            if(copyEpochs[currEpochIndex].methods.length > 0){
                copyEpochs[currEpochIndex].methods.forEach((meth) => {
                    setRemovedMethods((current) => [...current, meth.id]);
                })
            }

            copyEpochs[currEpochIndex].methods = JSON.parse(JSON.stringify(methodsToClone));
        });

        setEpochs(copyEpochs);

        // toast(t('Success!'), successConfig);
        setHasChanged(true);
        isFormValid(epochs);
        closeModal();
    }

    const epochFromDropdownOnChange = (event, value) => {
        setSelectedEpochFrom(value);
    };

    const epochToDropdownOnChange = (epochId, isChecked) => {
        setSelectedEpochTo((current) => {
            const copy = [...current];
            if(isChecked){
                copy.push(epochId);
                return copy;
            }
            return copy.filter((item) => item !== epochId);
        });
    };

    const closeModal = () => {
        setSelectedEpochFrom(-1);
        setSelectedEpochTo([]);
        setOpenClone(false);
    }

    const closeGroupMethods = () => {
        setOpenGroupMethods(false);
    };

    const closeModalCopy = () => {
        setOpenCopy(false);
    }

    useEffect(() => {
        if (openCopy) {
            const year =  sessionStorage.getItem('academicYear') || -1 ;
            console.log(year);
            if(year !== -1){
                selectAcademicYear(year);
            }
        }
    }, [openCopy]);

    const selectAcademicYear = (yearId) => {
        setLoadingUCs(true);
        setAcademicYearSelected(yearId);
        axios.get('/method/copy?year=' + yearId).then((res) => {
            if (res.status === 200) {
                // setCurricularUnitsOptions(res?.data?.data?.map(({key, value, text}) => ({key, value, text})));
                setCurricularUnitsOptions(res?.data?.data?.map(({ id, name, course_description }) => ({
                    key: id,
                    value: id,
                    text: name,
                    description: course_description
                })));
                setLoadingUCs(false);
            }
        });
    }
    const handleSubmitCopy = () => {
        axios.post('/method/clone', {
            copy_course_unit_id: curricularUnitSelected,
            new_course_unit_id: unitId,
            removed: [...removedMethods]
        }).then((res) => {
            if (res.status === 200) {
                loadMethods();
                setOpenCopy(false);
                setRemovedMethods([]);
                toast(t('Métodos de avaliação criados com sucesso!'), successConfig);
            }
        });
    }

    const openGroupingMethods = (epochId) => {
        setOpenGroupMethods(true);
        setEpochToGroup(epochs[epochId]);
    }

    useEffect(() => {
        if(curricularUnitSelected){
            setSelectedOption(curricularUnitsOptions.find(option => option.value === curricularUnitSelected));
        }
    }, [curricularUnitSelected]);

    return (
        <div ref={contextRef}>
            { epochs?.length < 1 || isLoading ? (
                <EmptyTable isLoading={isLoading} label={t("Ohh! Não foi possível encontrar métodos para esta Unidade Curricular!")}/>
            ) : (
                <div>
                    <ShowComponentIfAuthorized permission={SCOPES.MANAGE_EVALUATION_METHODS}>
                        {hasWarnings && (
                            <Message warning>
                                <Message.Header>{t('Os seguintes detalhes do Curso precisam da sua atenção:')}</Message.Header>
                                <Message.List>
                                    {hasOverWeight && (
                                        <Message.Item>{t('Existem métodos com mais de 100% na avaliacao')}</Message.Item>
                                    )}
                                    {isUncomplete && (
                                        <Message.Item>{t('É necessário configurar os métodos para todas as épocas')}</Message.Item>
                                    )}
                                    {hasNoMethods && (
                                        <Message.Item>{t('É necessário no minimo configurar algum dos métodos.')}</Message.Item>
                                    )}
                                    {missingTypes && (
                                        <Message.Item>{t('É necessário configurar o todos os tipos de avaliação nos métodos')}</Message.Item>
                                    )}
                                    {emptyWeight && (
                                        <Message.Item>{t('É necessário ter o peso de avaliação em todos os métodos')}</Message.Item>
                                    )}
                                    {underWeight && (
                                        <Message.Item>{t('É necessário ter no minimo 100% nos métodos')}</Message.Item>
                                    )}
                                </Message.List>
                            </Message>
                        )}
                        {!hasGroup && (
                            <Sticky offset={50} context={contextRef}>
                                {hasChanged && (
                                    <Message warning>
                                        <Message.Header>{t('Atenção!')}</Message.Header>
                                        <Message.Content> {t("Existem métodos por guardar!")} </Message.Content>
                                    </Message>
                                )}
                                <div className='sticky-methods-header'>
                                    <Button onClick={() => setOpenCopy(true)} icon labelPosition="left"
                                            color="blue" disabled={!hasNoMethods}>
                                        <Icon name={"clone outline"}/>{t("Copiar métodos")}
                                    </Button>
                                    <Button onClick={() => setOpenClone(true)} icon labelPosition="left"
                                            color="yellow" disabled={hasNoMethods}>
                                        <Icon name={"clone outline"}/>{t("Duplicar métodos")}
                                    </Button>
                                    <Button onClick={onSubmit} color="green" icon labelPosition="left"
                                            loading={isSaving} disabled={!formValid}>
                                        <Icon name="save"/>{t("Guardar")}
                                    </Button>
                                </div>
                            </Sticky>
                        )}
                        {hasGroup && (
                            <div className={"margin-bottom-base"}>
                                <Message info>
                                    <Message.Header>{t('Unidade curricular associada a um grupo')}</Message.Header>
                                    <Message.Content>{t("Os métodos desta unidade curricular são definidos no grupo á qual pertence.")}</Message.Content>
                                </Message>
                            </div>
                        )}
                    </ShowComponentIfAuthorized>
                                {epochs?.map((item, index)  => (
                                    <div className={index > 0 ? "margin-top-m" : ""} key={index}>

                                        <Header as="span">{i18n.language == 'en' ? item.name_en : item.name_pt}</Header>
                                        <Table compact celled className={"definition-last"}>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>{t("Tipo de avaliação")}</Table.HeaderCell>
                                                    <Table.HeaderCell>{t("Descrição")}</Table.HeaderCell>
                                                    <Table.HeaderCell>{t("Nota mínima")}</Table.HeaderCell>
                                                    <Table.HeaderCell>{t("Peso da avaliação")} (%)</Table.HeaderCell>
                                                    <Table.HeaderCell/>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {item.methods?.map((method, methodIndex) => (
                                                    <Table.Row key={methodIndex}
                                                               error={!epochs[index].methods[methodIndex].evaluation_type_id}>
                                                        <Table.Cell width={3}>
                                                            <Form.Dropdown
                                                                placeholder={t("Selecionar Tipo de avaliação")}
                                                                disabled={method.is_blocked || hasGroup || !isManagingMethods} fluid
                                                                value={method.evaluation_type_id} selection search
                                                                options={evaluationTypes.map(({
                                                                                                  id,
                                                                                                  name,
                                                                                                  enabled
                                                                                              }) => (enabled ? ({
                                                                    key: id,
                                                                    value: id,
                                                                    text: name,
                                                                }) : undefined))}
                                                                onChange={
                                                                    (ev, {value}) => setEpochs((current) => {
                                                                        const copy = [...current];
                                                                        // set number for descricion. Needs to be before the next line because its
                                                                        // when we set the current adding of the item
                                                                        const nextExamIndex = copy[index].methods.filter((item) => item.evaluation_type_id === value).length + 1;
                                                                        copy[index].methods[methodIndex].evaluation_type_id = value;
                                                                        if (value == "" || !value) {
                                                                            copy[index].methods[methodIndex].description_pt = "";
                                                                            copy[index].methods[methodIndex].description_en = "";
                                                                            copy[index].methods[methodIndex].name = "";
                                                                            copy[index].methods[methodIndex].code = "";
                                                                            copy[index].methods[methodIndex].grouped_id = Math.floor(Math.random() * 1000);
                                                                        } else {
                                                                            copy[index].methods[methodIndex].description_pt = evaluationTypes.filter((x) => x.id === value)[0].name_pt + " " + nextExamIndex;
                                                                            copy[index].methods[methodIndex].description_en = evaluationTypes.filter((x) => x.id === value)[0].name_en + " " + nextExamIndex;
                                                                            copy[index].methods[methodIndex].initials_pt = evaluationTypes.filter((x) => x.id === value)[0].initials_pt + " " + nextExamIndex;
                                                                            copy[index].methods[methodIndex].initials_en = evaluationTypes.filter((x) => x.id === value)[0].initials_en + " " + nextExamIndex;
                                                                            copy[index].methods[methodIndex].name = evaluationTypes.filter((x) => x.id === value)[0].name_pt;
                                                                            copy[index].methods[methodIndex].code = evaluationTypes.filter((x) => x.id === value)[0].code;
                                                                            copy[index].methods[methodIndex].grouped_id = Math.floor(Math.random() * 1000);
                                                                        }
                                                                        // TODO hardcode: add statement release and oral presentation métodos for projects and reports on profs request
                                                                        if (copy[index].methods[methodIndex].code.toLowerCase() === "project" || copy[index].methods[methodIndex].code.toLowerCase() === "report") {
                                                                            const hasOralPresentation = copy[index].methods.filter((item) => item.evaluation_type_id === 5).length > 0;
                                                                            if (!hasOralPresentation) {
                                                                                copy[index].methods.push({
                                                                                    weight: 0,
                                                                                    minimum: 9.5,
                                                                                    evaluation_type_id: 11,
                                                                                    name: "Lançamento do enunciado",
                                                                                    description: "",
                                                                                    description_en: "Statement release",
                                                                                    description_pt: "Lançamento do enunciado",
                                                                                    initials_pt: "LE",
                                                                                    initials_en: "SR",
                                                                                    is_blocked: true,
                                                                                    grouped_id: copy[index].methods[methodIndex].grouped_id
                                                                                });
                                                                                copy[index].methods.push({
                                                                                    weight: 0,
                                                                                    minimum: 9.5,
                                                                                    evaluation_type_id: 5,
                                                                                    name: "Apresentação oral pública",
                                                                                    description: "",
                                                                                    description_en: "Public oral presentation",
                                                                                    description_pt: "Apresentação oral pública",
                                                                                    initials_pt: "AOP",
                                                                                    initials_en: "POP",
                                                                                    is_blocked: true,
                                                                                    grouped_id: copy[index].methods[methodIndex].grouped_id
                                                                                });
                                                                            }
                                                                        }
                                                                        return copy;
                                                                    })
                                                                }
                                                            />
                                                            {!epochs[index].methods[methodIndex].evaluation_type_id && (
                                                                <div>
                                                                    <Icon color='orange' name="warning sign"/>
                                                                    {t("Falta selecionar o tipo de avaliacao")}
                                                                </div>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell width={3} colSpan={method.is_blocked ? 3 : 0}>
                                                            {isManagingMethods ? (
                                                                <div>
                                                                    <Form.Input placeholder={t("Descrição PT")} fluid
                                                                                value={method.description_pt}
                                                                                onChange={
                                                                                    (ev, {value}) => setEpochs((current) => {
                                                                                        setHasChanged(true);
                                                                                        const copy = [...current];
                                                                                        copy[index].methods[methodIndex].description_pt = value;
                                                                                        return copy;
                                                                                    })
                                                                                }
                                                                                />
                                                                    <Form.Input placeholder={t("Descrição EN")} fluid
                                                                                value={method.description_en} className={"margin-top-base"}
                                                                                onChange={
                                                                                    (ev, {value}) => setEpochs((current) => {
                                                                                        setHasChanged(true);
                                                                                        const copy = [...current];
                                                                                        copy[index].methods[methodIndex].description_en = value;
                                                                                        return copy;
                                                                                    })
                                                                                }
                                                                                />
                                                                </div>
                                                                ):(
                                                                <div>
                                                                    {i18n.language == 'pt' ?
                                                                        (
                                                                    <Form.Input placeholder={t("Descrição PT")} fluid
                                                                                value={method.description_pt} readOnly
                                                                    />
                                                                        ): (
                                                                    <Form.Input placeholder={t("Descrição EN")} fluid
                                                                                value={method.description_en} readOnly
                                                                    />
                                                                        )}
                                                                </div>
                                                            )}
                                                        </Table.Cell>
                                                        {!method.is_blocked && (
                                                            <Table.Cell width={5}>
                                                                {isManagingMethods ? (
                                                                    <div>
                                                                        <Grid >
                                                                            <Grid.Column width={6}>
                                                                                <Input placeholder="Value" fluid type="number" loading={isLoading} value={method.minimum} style={{ minWidth :"40px"}}
                                                                                       onChange={(e) => updateMethodMinimum(index, methodIndex, e.target.value)} />
                                                                            </Grid.Column>
                                                                            <GridColumn width={10}>
                                                                                <SemanticSlider value={method.minimum} color="blue" settings={{
                                                                                    start: 2,
                                                                                    min: 0,
                                                                                    max: 20,
                                                                                    step: 1,
                                                                                    disabled:{hasGroup},
                                                                                    onChange: ((newValue) =>
                                                                                        updateMethodMinimum(index, methodIndex, newValue))
                                                                                }}
                                                                                />
                                                                            </GridColumn>
                                                                        </Grid>
                                                                    </div>
                                                                ) : (
                                                                    <Label color="blue">{method.minimum}</Label>
                                                                )}
                                                            </Table.Cell>
                                                        )}
                                                        {!method.is_blocked && (
                                                            <Table.Cell width={5}>

                                                                {isManagingMethods ? (
                                                                        <Grid >
                                                                            <Grid.Column width={6}>
                                                                                <Input placeholder="Value" fluid type="number" loading={isLoading} value={method.weight} style={{ minWidth :"40px"}}
                                                                                       onChange={(e) => updateMethodWeight(index, methodIndex, e.target.value)} />
                                                                            </Grid.Column>
                                                                            <GridColumn width={10}>
                                                                                <SemanticSlider value={method.weight} color="blue" settings={{
                                                                                    start: 2,
                                                                                    min: 0,
                                                                                    max: 100,
                                                                                    step: 5,
                                                                                    disabled:{hasGroup},
                                                                                    onChange: ((newValue) =>
                                                                                        updateMethodWeight(index, methodIndex, newValue))
                                                                                }}
                                                                                />
                                                                            </GridColumn>
                                                                        </Grid>
                                                                ) : (
                                                                    <Label color="blue">{method.weight}</Label>
                                                                )}
                                                            </Table.Cell>
                                                        )}
                                                        <ShowComponentIfAuthorized permission={SCOPES.MANAGE_EVALUATION_METHODS}>
                                                            <Table.Cell collapsing width={1}>
                                                                {!hasGroup && (<Icon disabled={hasGroup} name={"trash"}
                                                                                     onClick={() => removeMethod(index, methodIndex)}/>)}
                                                            </Table.Cell>
                                                        </ShowComponentIfAuthorized>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                            <ShowComponentIfAuthorized permission={SCOPES.MANAGE_EVALUATION_METHODS}>
                                                <Table.Footer fullWidth>
                                                    <Table.Row>
                                                        <Table.HeaderCell colSpan='8'>
                                                            {t("Total pesos avaliacao:")} <Label
                                                            color={(Math.round(getEpochValue(index) )> 100 ? "red" : (Math.round(getEpochValue(index))=== 100 ? "green" : "yellow"))}>{Math.round((epochs[index].methods || [])?.reduce((a, b) => a + (b?.weight || 0), 0))}%</Label>
                                                            {!hasGroup && (
                                                                <div className={"margin-top-base"}>
                                                                    <Button onClick={() => openGroupingMethods(index)} icon labelPosition="left"
                                                                            color="green" disabled={item.methods.length === 0}>
                                                                        <Icon name={"object group outline"}/>{t("Agrupar Métodos")}
                                                                    </Button>
                                                                    <Button icon labelPosition='left'
                                                                            color={"green"} size='small' onClick={() => {
                                                                        addNewMethod(index, item.id);
                                                                    }}>
                                                                        <Icon name='plus'/> {t("Adicionar novo método")}
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Footer>
                                            </ShowComponentIfAuthorized>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        )}

                        <FinalForm onSubmit={cloneMethods}
                                   render={({handleSubmit}) => (
                                       <Modal onClose={closeModal} onOpen={() => setOpenClone(true)} open={openClone}>
                                           <Modal.Header>{t("Duplicar Métodos")}</Modal.Header>
                                           <Modal.Content>
                                               <Form>
                                                   <Header
                                                       as="h4">{t("Seleciona que épocas pretendes duplicar")}</Header>
                                                   <Grid columns={2}>
                                                       <GridColumn>
                                                           <Field name="epoch">
                                                               {({input: epochFromInput}) => (
                                                                   <Form.Dropdown
                                                                       options={epochs.map((epoch) => ({
                                                                           key: epoch.id,
                                                                           value: epoch.id,
                                                                           text: i18n.language == 'en' ? epoch.name_en : epoch.name_pt,
                                                                           disabled: selectedEpochTo.includes(epoch.id) || epoch.methods.length === 0
                                                                       }))}
                                                                       value={selectedEpochFrom || -1}
                                                                       placeholder={t("Época a copiar")}
                                                                       selectOnBlur={false} selection search
                                                                       label={t("Época de origem")}
                                                                       onChange={(e, {value}) => epochFromDropdownOnChange(e, value)}
                                                                   />
                                                               )}
                                                           </Field>
                                                       </GridColumn>
                                                       <GridColumn>
                                                           <label
                                                               className={"display-block text-bold margin-bottom-s"}>{t("Época de destino")}</label>
                                                           {epochs.filter((epoch) => epoch.id != selectedEpochFrom).map((epoch, index) => (
                                                                   <Field name="epoch" key={index}>
                                                                       {({input: epochToInput}) => (
                                                                           <Form.Checkbox
                                                                               checked={selectedEpochTo.includes(epoch.id)}
                                                                               label={i18n.language == 'en' ? epoch.name_en : epoch.name_pt}
                                                                               disabled={selectedEpochFrom == -1}
                                                                               onChange={(e, {checked}) => epochToDropdownOnChange(epoch.id, checked)}
                                                                           />
                                                                       )}
                                                                   </Field>
                                                               )
                                                           )}
                                                       </GridColumn>
                                                   </Grid>
                                               </Form>
                                           </Modal.Content>
                                           <Modal.Actions>
                                               <Button negative onClick={closeModal}>{t("Cancel")}</Button>
                                               <Button positive onClick={handleSubmit}>{t("Duplicar")}</Button>
                                           </Modal.Actions>
                                       </Modal>
                                   )}
                        />

                        <Modal onClose={closeModalCopy} onOpen={() => setOpenCopy(true)} open={openCopy}>
                            <Modal.Header>{t("Copiar Métodos de outra UC")}</Modal.Header>
                            <Modal.Content>
                                <Form>
                                    <Header as="h4">{t("Selecione o ano curricular")}</Header>
                                    <Grid columns={2}>
                                        <GridColumn width={6}>
                                            <AcademicYears eventHandler={selectAcademicYear} isSearch={false}/>
                                        </GridColumn>
                                        <GridColumn width={10}>
                                            <Form.Dropdown selectOnBlur={false} selection search={true}
                                                           value={curricularUnitSelected}
                                                           disabled={curricularUnitsOptions.length === 0}
                                                           options={curricularUnitsOptions}
                                                           label={t("Unidade Curricular")}
                                                           placeholder={t("Unidade Curricular")}
                                                           loading={loadingUCs}
                                                           trigger={
                                                               selectedOption && (
                                                                   <span>
                                                                    {selectedOption.text} - <i>{selectedOption.description}</i>
                                                                   </span>
                                                               )
                                                           }
                                                           onChange={(e, {value}) => setCurricularUnitSelected(value)}/>
                                            {academicYearSelected !== -1 && curricularUnitsOptions.length === 0 && !loadingUCs && (
                                                <Message warning>
                                                    <p>{t("Não existe nenhuma unidade curricular com métodos definidos para o ano letivo selecionado!")}</p>
                                                </Message>
                                            )}
                                        </GridColumn>
                                    </Grid>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative onClick={closeModalCopy}>{t("Cancel")}</Button>
                                <Button positive onClick={handleSubmitCopy}>{t("Copiar")}</Button>
                            </Modal.Actions>
                        </Modal>
                        <GroupedMethods
                            isOpen={openGroupMethods}
                            onClose={closeGroupMethods}
                            courseUnit={unitId}
                            epochs={epochToGroup}
                            epochTypeId={epochToGroup.id}
                            unitId={unitId}
                        />
                </div>
                )
            };
            //<!-- disabled={!((methods[index] || [])?.reduce((a, b) => a + (b?.weight || 0), 0) < 100)} -->
export default UnitTabMethods;
