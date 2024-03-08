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
    const [phaseDetail, setPhaseDetail] = useState({});
    const isEditMode = !_.isEmpty(phaseDetail);
    const [isRemovable, setIsRemovable] = useState(true);
    const [formErrors, setFormErrors] = useState([]);
    const required = value => (value ? undefined : 'Required');

    useEffect(() => {
        if (paramsId) {
            // check if URL params are just numbers or else redirects to previous page
            if(!/\d+/.test(paramsId)){
                navigate(-1);
                toast(t("Ocorreu um erro ao carregar a informacao pretendida"), errorConfig);
            }

            axios.get(`/calendar-phases/${paramsId}`).then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                    setPhaseDetail(res?.data?.data);
                    setIsRemovable(res?.data?.data?.removable);
                }
            });
        }
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !phaseDetail) {
            navigate('/fases');
        }
    }, [paramsId, loading, phaseDetail, navigate]);

    const initialValues = useMemo(() => {
        const { id, code, name_pt, name_en, enabled = true } = phaseDetail;

        return { id, code, name_pt, name_en, enabled };
    }, [phaseDetail]);

    const onSubmit = ({ id, code, name_pt, name_en, enabled }) => {
        setIsSaving(true);
        const isNew = !id;
        const axiosFn = isNew ? axios.post : axios.patch;

        axiosFn(`/calendar-phases/${!isNew ? id : ''}`, {
             code: (isRemovable ? code : null), name_pt, name_en, enabled
        }).then((res) => {
            setIsSaving(false);

            setFormErrors([]);
            if (res.status === 200) {
                toast(t('Fase do calendário atualizado com sucesso'), successConfig);
            } else if (res.status === 201) {
                toast(t('Fase do calendário criado com sucesso'), successConfig);
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
                <Link to="/fases-calendario"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({ handleSubmit }) => (
                <Form>
                    <Card fluid>
                        { loading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{t('A carregar dados')}</Loader>
                            </Dimmer>
                        )}
                        <Card.Content header={`${ isEditMode ? t('Editar fase do calendário') : t('Nova fase do calendário') }`} />

                        <Card.Content>
                            <Form.Group widths="equal">
                                <Field name="code" validate={required}>
                                    {( { input: codeInput, meta}) => (
                                        <Form.Input label={t('Código')} {...codeInput} disabled={!isRemovable} error={ meta.touched && meta.error } />
                                    )}
                                </Field>
                            </Form.Group>
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
                            <Field name="enabled" type="checkbox">
                                {({ input: isEnabled }) => (
                                    <Checkbox label={t('Ativo?')} toggle defaultChecked={isEnabled.checked} onClick={() => isEnabled.onChange( !isEnabled.checked) } />
                                )}
                            </Field>
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
