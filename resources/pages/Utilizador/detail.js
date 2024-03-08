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

    const [userDetail, setUserDetail] = useState({});
    const [loading, setLoading] = useState(!!paramsId);
    const [isSaving, setIsSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        axios.get(`/users/${paramsId}`).then((res) => {
            if (res.status === 200) {
                setLoading(false);
                setUserDetail(res?.data?.data);
            }
        });
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !userDetail) {
            navigate('/utilizador');
        }
    }, [paramsId, loading, userDetail]);

    const initialValues = useMemo(() => {
        const {id, email, name, groups, enabled = true} = userDetail;
        return {id, email, name, enabled, groups: groups?.map(({id}) => id)};//(groups ? Object.values(groups.id) : [])};
    }, [userDetail]);

    const onSubmit = ({id, groups, enabled,}) => {
        setIsSaving(true);
        axios.patch(`/user/${id}`, {groups, enabled}).then((res) => {
            if (res.status === 200) {
                setIsSaving(false);
                toast(t('Utilizador atualizado com sucesso'), successConfig);
            }
        });
    };

    const onChangePassword = () => {
        console.log("pass");
        axios.post(`/user/${id}/password`, {
            old: oldPassword,
            new: newPassword,
            confirm: confirmPassword
        }).then((res) => {
            if (res.status === 200) {
                setErrorMessages([]);
                toast(t('Utilizador atualizado com sucesso'), successConfig);
                setModalOpen(false);
                setShowPass(false);
            } else {
                let errorsArray = [];
                if(typeof res.response.data.errors === 'object' && res.response.data.errors !== null){
                    let isArrayInside = false;
                    Object.values(res.response.data.errors).forEach((item) => {
                        if(item.length > 1 ){
                            isArrayInside = true;
                            errorsArray = item;
                        }
                    });
                    if(!isArrayInside) {
                        errorsArray = Object.values(res.response.data.errors);
                    }
                } else {
                    if(Array.isArray(res.response.data.errors)){
                        errorsArray = res.response.data.errors;
                    }
                }
                setErrorMessages(errorsArray);
                toast('Existiu um problema ao gravar as alterações!', errorConfig);
            }
        });
    };

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/utilizador"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({handleSubmit}) => (
                    <Form>
                        <Card fluid>
                            { loading && (
                                <Dimmer active inverted>
                                    <Loader indeterminate>{t('A carregar dados')}</Loader>
                                </Dimmer>
                            )}
                            <Card.Content header={t("Editar Utilizador")} />
                            <Card.Content>
                                <Form.Group widths="equal">
                                    <Form.Input label={t("Nome")} value={initialValues.name} disabled/>
                                    <Form.Input label={t("Email")} value={initialValues.email} disabled/>
                                </Form.Group>
                                <Field name="groups">
                                    {({input: groupsInput}) => (
                                        <FilterOptionUserGroups widthSize={8} values={groupsInput.value} eventHandler={(value) => groupsInput.onChange(value)} />
                                    )}
                                </Field>
                                <Field name="enabled" type="checkbox">
                                    {({input: enabledUserInput}) => (
                                        <Checkbox label={t("Utilizador ativo?")} toggle
                                            checked={enabledUserInput.checked}
                                            onClick={() => enabledUserInput.onChange(!enabledUserInput.checked,)}
                                        />
                                    )}
                                </Field>
                            </Card.Content>
                            <Card.Content>
                                { userDetail.is_protected && (
                                    <Button floated={"left"} onClick={() => setModalOpen(true)} color={"blue"} icon labelPosition="left" ><Icon name={"lock"}/> { t('Mudar Password')}</Button>
                                )}
                                <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right" loading={isSaving}>
                                    <Icon name="save"/>
                                    { t('Guardar') }
                                </Button>
                            </Card.Content>
                        </Card>
                    </Form>
                )}
            />
            <Modal onClose={() => setModalOpen(false)} open={modalOpen}>
                <Modal.Header>{ t('Mudar Password')}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input label={ t('Confirme a Password antiga')}
                                    placeholder='First name'
                                    type={showPass ? 'text' : 'password'}
                                    onChange={(e, {value}) => setOldPassword(value) } />
                        <Form.Input label={ t('Definir nova password')}
                                    placeholder='First name'
                                    type={showPass ? 'text' : 'password'}
                                    onChange={(e, {value}) => setNewPassword(value) } />
                        <Form.Input label={ t('Confirmar nova password')}
                                    placeholder='First name'
                                    type={showPass ? 'text' : 'password'}
                                    onChange={(e, {value}) => setConfirmPassword(value) } />
                        <Form.Checkbox checked={showPass} label='Mostar passwords' onChange={(e, {checked}) => setShowPass(checked) } />
                    </Form>
                    { errorMessages.length > 0 && (
                        <Message warning className={"margin-top-base"}>
                            <Message.Header>{ t('Os seguintes detalhes da Unidade curricular precisam da sua atenção') }:</Message.Header>
                            <Message.List>
                                { errorMessages.map((message, index) => (
                                    <Message.Item key={index}>
                                        { t(message) }
                                    </Message.Item>
                                ))}
                            </Message.List>
                        </Message>
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={() => setModalOpen(false)}>
                        <Icon name='remove' /> { t('Cancelar')}
                    </Button>
                    <Button color='green' onClick={onChangePassword}>
                        <Icon name='checkmark' /> { t('Guardar nova password') }
                    </Button>
                </Modal.Actions>
            </Modal>
        </Container>
    );
};

export default UserDetail;
