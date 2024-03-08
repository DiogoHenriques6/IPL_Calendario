import React, { useEffect, useMemo, useState } from 'react';
import {Button, Card, Checkbox, Container, Dimmer, Form, Icon, Loader, Message} from 'semantic-ui-react';
import { Field, Form as FinalForm } from 'react-final-form';
import { useParams, useNavigate} from "react-router-dom";
import _ from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import { errorConfig, successConfig } from '../../utils/toastConfig';

const New = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [loading, setLoading] = useState(!!paramsId);
    const [isSaving, setIsSaving] = useState(false);
    const [interruptionDetail, setInterruptionDetail] = useState({});
    const isEditMode = !_.isEmpty(interruptionDetail);

    const [formErrors, setFormErrors] = useState([]);
    const required = value => (value ? undefined : 'Required');

    useEffect(() => {
        if (paramsId) {
            axios.get(`/interruption-types/${paramsId}`).then((response) => {
                setInterruptionDetail(response?.data?.data);
                setLoading(false);
            });
        }
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !interruptionDetail) {
            navigate('/tipo-interrupcao');
        }
    }, [paramsId, loading, interruptionDetail, navigate]);

    const initialValues = useMemo(() => {
        const { id, name_pt, name_en, enabled = true, mandatory } = interruptionDetail;
        return { id, name_pt, name_en, enabled, mandatory };
    }, [interruptionDetail]);

    const onSubmit = ({ id, name_pt, name_en, enabled, mandatory }) => {
        setIsSaving(true);
        const isNew = !id;
        const axiosFn = isNew ? axios.post : axios.patch;

        axiosFn(`/interruption-types/${!isNew ? id : ''}`, { name_pt, name_en, enabled, mandatory }).then((res) => {
            setIsSaving(false);
            setFormErrors([]);
            if (res.status === 200) {
                toast(t('Tipo de Interrupção atualizado com sucesso'), successConfig);
            } else if (res.status === 201) {
                toast(t('Tipo de Interrupção criado com sucesso'), successConfig);
            } else {
                let errorsArray = [];
                if(typeof res.response.data.errors === 'object' && res.response.data.errors !== null){
                    errorsArray = Object.values(res.response.data.errors);
                } else {
                    if(Array.isArray(res.response.data.errors)){
                        errorsArray = res.response.data.errors;
                    }
                }
                setFormErrors(errorsArray);
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
        });
    };

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/tipo-interrupcao"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({ handleSubmit }) => (
                <Form>
                    <Card fluid>
                        { loading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{t('A carregar dados')}</Loader>
                            </Dimmer>
                        )}
                        <Card.Content header={`${ isEditMode ? t('Editar Tipo de Interrupção') : t('Novo Tipo de Interrupção') }`} />
                        <Card.Content>
                            <Form.Group widths="equal">
                                <Field name="name_pt" validate={required}>
                                    {( { input: namePtInput, meta}) => (
                                        <Form.Input label={t('Nome PT')} {...namePtInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                                <Field name="name_en" validate={required}>
                                    {( { input: nameEnInput, meta}) => (
                                        <Form.Input label={t('Nome EN')} {...nameEnInput} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="4">
                                <Form.Field>
                                    <Field name="enabled" type="checkbox">
                                        {({ input: isEnabled }) => (
                                            <Checkbox label={t('Ativo?')} toggle checked={isEnabled.checked} onClick={() => isEnabled.onChange( !isEnabled.checked) } />
                                        )}
                                    </Field>
                                </Form.Field>
                                <Form.Field>
                                    <Field name="mandatory" type="checkbox">
                                        {({ input: isMandatory }) => (
                                            <Checkbox label={t('Obrigatório')} toggle checked={isMandatory.checked} onClick={() => isMandatory.onChange( !isMandatory.checked) } />
                                        )}
                                    </Field>
                                </Form.Field>
                            </Form.Group>
                        </Card.Content>
                        { formErrors.length > 0 &&
                            <Card.Content>
                                <Message negative>
                                    <Message.Header>Errors</Message.Header>
                                    <Message.List>
                                        {formErrors?.map((item, index) =>
                                            <Message.Item key={index}>{item}</Message.Item>
                                        )}
                                    </Message.List>
                                </Message>
                            </Card.Content>
                        }
                        <Card.Content>
                            <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right" loading={isSaving} >
                                <Icon name={isEditMode ? 'save' : 'plus'} /> {isEditMode ? t('Guardar') : t('Criar')}
                            </Button>
                        </Card.Content>
                    </Card>
                </Form>
            )} />
        </Container>
    );
};

export default New;
