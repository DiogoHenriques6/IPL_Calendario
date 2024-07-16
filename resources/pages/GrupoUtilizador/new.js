import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Card,
    Checkbox,
    Container,
    Dimmer,
    Form,
    Grid, GridColumn,
    Header,
    Icon,
    Loader,
    Message,
    Modal
} from 'semantic-ui-react';
import { Field, Form as FinalForm } from 'react-final-form';
import {useParams, useNavigate} from "react-router-dom";
import _ from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import { errorConfig, successConfig } from '../../utils/toastConfig';
import GroupPermissions from './groupPermissions';
import SCOPES from '../../utils/scopesConstants';
import ShowComponentIfAuthorized from "../../components/ShowComponentIfAuthorized";
import UserGroups from "../../components/Filters/UserGroups";

const New = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [loading, setLoading] = useState(!!paramsId);
    const [isSaving, setIsSaving] = useState(false);
    const [userGroup, setUserGroup] = useState({});
    const [errorMessages, setErrorMessages] = useState([]);
    const [copyPermissionOpen,setCopyPermissionOpen] = useState(false);
    const [userGroupsOptions, setUserGroupsOptions] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const isEditMode = !_.isEmpty(userGroup);
    const [countCopy, setCountCopy] = useState(0);

    useEffect(() => {
        if (paramsId) {
            axios.get(`/user-group/${paramsId}`)
                .then((response) => {
                    setUserGroup(response?.data?.data);
                    setLoading(false);
                });
        }
    }, [paramsId]);

    useEffect(() => {
        if (!loading && paramsId && !userGroup) {
            navigate('/grupo-utilizador');
        }
    }, [paramsId, loading, userGroup, navigate]);

    const initialValues = useMemo(() => {
        const { id, name, description_pt, description_en, enabled = true } = userGroup;

        return { id, name, description_pt, description_en, enabled };
    }, [userGroup]);

    const onSubmit = ({ id, name, description_pt, description_en, enabled }) => {
        setIsSaving(true);
        const isNew = !id;
        const axiosFn = isNew ? axios.post : axios.patch;

        axiosFn(`/user-group/${!isNew ? id : ''}`, { code: name, name_pt: description_pt, name_en: description_en, enabled }).then( (res) => {
            setIsSaving(false);
            setErrorMessages([]);
            if (res.status === 200) {
                toast(t('Grupo atualizado com sucesso'), successConfig);
            } else if (res.status === 201) {
                toast(t('Grupo criado com sucesso'), successConfig);
            } else {
                let errorsArray = [];
                if(typeof res.response.data.errors === 'object' && res.response.data.errors !== null){
                    errorsArray = Object.values(res.response.data.errors);
                } else {
                    if(Array.isArray(res.response.data.errors)){
                        errorsArray = res.response.data.errors;
                    }
                }
                setErrorMessages(errorsArray);
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
        });
    };

    const handleCloneGroup = () => {
        setIsSaving(true);
        axios.get(`/user-group/${paramsId}/clone`).then( (res) => {
            setIsSaving(false);
            if (res.status === 201) {
                toast(t('Grupo duplicado com sucesso'), successConfig);
                if( res.data.id) {
                    navigate("/grupo-utilizador/edit/" + res.data.id);
                }
            }
            else {
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
        });
    };

    const closeModal = () => {
        setCopyPermissionOpen(false);
        setLoading(false);
    }

    useEffect(() => {
        if(copyPermissionOpen) {
        setLoading(true);
            axios.get('/user-group').then((response) => {
                if (response.status === 200) {
                    setUserGroupsOptions(response?.data?.data?.map(({id, description}) => ({
                        key: id,
                        value: id,
                        text: description
                    })));
                }
                setLoading(false);
            });
        }
    }, [copyPermissionOpen]);

    const handleCopy = () => {
        setIsSaving(true);
        axios.post(`/user-group/${paramsId}/clone-permissions`, {group_id: selectedGroup}).then( (res) => {
            setIsSaving(false);
            if (res.status === 404) {
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
            else {
                toast(t('Permissões copiadas com sucesso'), successConfig);
                setCountCopy(countCopy + 1);
            }
            closeModal();
        });
    }

    const handleDropdownChange = (e, {value}) => {
        setSelectedGroup(value);
    }

    return (
        <Container>
            <div className="margin-bottom-base">
                <Link to="/grupo-utilizador"> <Icon name="angle left" /> {t('Voltar à lista')}</Link>
            </div>
            <FinalForm onSubmit={onSubmit} initialValues={initialValues} render={({ handleSubmit }) => (
                <Form warning={ errorMessages.length > 0 }>
                    <Card fluid>
                        { loading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{t('A carregar o grupo')}</Loader>
                            </Dimmer>
                        )}
                        <Card.Content header={`${ isEditMode ? t('Editar Grupo de Utilizador') : t('Novo Grupo de Utilizador') }`} />
                        { errorMessages.length > 0 && (
                            <Card.Content>
                                <Message warning>
                                    <Message.Header>{ t('Os seguintes detalhes da Unidade curricular precisam da sua atenção') }:</Message.Header>
                                    <Message.List>
                                        { errorMessages.map((message, index) => (
                                            <Message.Item key={index}>
                                                { message }
                                            </Message.Item>
                                        ))}
                                    </Message.List>
                                </Message>
                            </Card.Content>
                        )}
                        <Card.Content>
                            <Form.Group widths="equal">
                                <Field name="name">
                                    {( { input: nameInput }) => (
                                        <Form.Input label={t('Nome')} {...nameInput} />
                                    )}
                                </Field>
                            </Form.Group>
                            <Form.Group widths="equal">
                                <Field name="description_pt">
                                    {( { input: descriptionPtInput }) => (
                                        <Form.Input label={t('Descrição PT')} {...descriptionPtInput} />
                                    )}
                                </Field>
                                <Field name="description_en">
                                    {( { input: descriptionEnInput }) => (
                                        <Form.Input label={t('Descrição EN')} {...descriptionEnInput} />
                                    )}
                                </Field>
                            </Form.Group>
                            <Field name="enabled" type="checkbox">
                                {({ input: isEnabled }) => (
                                    <Checkbox label={t('Grupo de utilizador ativo?')} toggle defaultChecked={isEnabled.checked} onClick={() => isEnabled.onChange( !isEnabled.checked) } />
                                )}
                            </Field>
                        </Card.Content>
                        <Card.Content>

                            <Button onClick={handleSubmit} color="green" icon labelPosition="left" floated="right" loading={isSaving} >
                                <Icon name={isEditMode ? 'save' : 'plus'} /> {isEditMode ? t('Guardar') : t('Criar')}
                            </Button>
                            {isEditMode && (
                                <div>
                                    <Button onClick={handleCloneGroup} color="yellow" icon labelPosition="left" floated="right" loading={isSaving} >
                                        <Icon name='clone outline'/> { t('Duplicar') }
                                    </Button>
                                    <Button onClick={() => setCopyPermissionOpen(true)} icon color="blue" labelPosition="left" floated="right" loading={isSaving}>
                                        <Icon name='clone outline'/> { t('Copiar Permissões') }
                                    </Button>
                                </div>
                            )}

                        </Card.Content>
                    </Card>
                </Form>
            )} />
            <ShowComponentIfAuthorized permission={[SCOPES.CHANGE_PERMISSIONS]}>
                { isEditMode && <GroupPermissions countCopy={countCopy}/> }
            </ShowComponentIfAuthorized>
               <Modal onClose={closeModal} onOpen={() => setCopyPermissionOpen(true)} open={copyPermissionOpen}>
                   <Modal.Header>{t("Copiar permissões")}</Modal.Header>
                   <Modal.Content>
                       <Form>
                           <Form.Dropdown selectOnBlur={false} fluid options={userGroupsOptions} value={selectedGroup} selection search label={t("Grupo de Utilizador")}
                                          placeholder={t("Grupo de Utilizador")} loading={loading} onChange={handleDropdownChange}/>
                       </Form>
                   </Modal.Content>
                   <Modal.Actions>
                       <Button negative onClick={closeModal}>{t("Cancel")}</Button>
                       <Button positive onClick={handleCopy}>{t("Duplicar")}</Button>
                   </Modal.Actions>
               </Modal>
        </Container>
    );
};

export default New;
