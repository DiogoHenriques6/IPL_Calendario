import axios from 'axios';
import React, {useEffect, useMemo, useState} from 'react';
import {Field, Form as FinalForm} from 'react-final-form';
import {useNavigate} from 'react-router';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Button, Card, Checkbox, Container, Dimmer, Form, Icon, Loader, Message, Modal} from 'semantic-ui-react';
import {errorConfig, successConfig} from '../../utils/toastConfig';
import {useTranslation} from "react-i18next";
import FilterOptionUserGroups from "../../components/Filters/UserGroups";

const UserDetail = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [loading, setLoading] = useState(!!paramsId);
    const [isSaving, setIsSaving] = useState(false);


    const [errorMessages, setErrorMessages] = useState([]);
    const [email, setEmail] = useState('');

    const required = value => (value ? undefined : 'Required');
    const onSubmit = ({name, groups}) => {
        setIsSaving(true);
        axios.post(`/users`, {name, groups}).then((res) => {
            if (res.status === 200) {
                setIsSaving(false);
                toast(t('Utilizador criado com sucesso'), successConfig);
                navigate('/utilizador');
            }
            else{
                setIsSaving(false);
                setErrorMessages(res.response.data.errors)
                console.log(res.response.data.errors)
                toast(t('Ocorreu um erro ao adicionar o utilizador!'), errorConfig);
            }
        });
    };

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/utilizador"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit}  render={({handleSubmit}) => (
                    <Form>
                        <Card fluid>
                            { loading && (
                                <Dimmer active inverted>
                                    <Loader indeterminate>{t('A carregar dados')}</Loader>
                                </Dimmer>
                            )}
                            <Card.Content header={t("Adicionar Estudante")} />
                            <Card.Content>
                                <Form.Group widths="equal">
                                    <Field name="name" validate={required}>
                                        {({input: nameInput, meta}) => (
                                            <Form.Input label={t("Número de estudante")}
                                                        value={nameInput.value}
                                                        onChange={ (e,{value})=>{
                                                            (nameInput.onChange(value));
                                                            setEmail(value? value + "@my.ipleiria.pt": "");
                                                        }}
                                                        error={meta.touched && meta.error}
                                            />
                                            )}
                                    </Field>
                                    <Form.Input label={t("Email")} value={email} readOnly/>
                                </Form.Group>
                                <Field name="groups" >
                                    {({input: groupsInput, meta}) => (
                                        <FilterOptionUserGroups widthSize={8} values={groupsInput.value} forStudent error={meta.touched && meta.error}
                                                    eventHandler={(value) => {groupsInput.onFocus(value);groupsInput.onChange(value)}} />
                                    )}
                                </Field>
                            </Card.Content>
                            <Card.Content>
                                <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right" loading={isSaving}>
                                    <Icon name="save"/>
                                    { t('Guardar') }
                                </Button>
                                {errorMessages.length > 0 && (
                                    <Message error>
                                        <Message.Header>{t('Erros')}</Message.Header>
                                        <Message.List>
                                            {errorMessages.map((error, index) => (
                                                <Message.Item key={index}>{error}</Message.Item>
                                            ))}
                                        </Message.List>
                                    </Message>
                                )}
                            </Card.Content>
                        </Card>
                    </Form>
                )}
            />

        </Container>
    );
};

export default UserDetail;
