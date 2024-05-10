import React, {useEffect, useState} from 'react';
import axios from 'axios';
import _, {debounce} from 'lodash';
import {Icon, Table, Form, Button, Modal, Dimmer, Loader, Segment} from 'semantic-ui-react';
import {toast} from 'react-toastify';
import {useTranslation} from "react-i18next";
import {successConfig, errorConfig} from '../../../utils/toastConfig';
import SCOPES from "../../../utils/scopesConstants";
import ShowComponentIfAuthorized from "../../../components/ShowComponentIfAuthorized";

const CourseTabsCCP = ({ courseId, isLoading }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [ccpMembers, setCCPMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [listOfCCPMembers, setListOfCCPMembers] = useState([]);
    const [userToAdd, setUserToAdd] = useState([]);
    const [searchUser, setSearchUser] = useState(false);

    const loadCourseCCP = () => {
        setLoading(true);
        isLoading = true;
        axios.get(`/courses/${courseId}/ccp`).then((res) => {
            setLoading(false);
            isLoading = false;
            setCCPMembers(res.data.data);
        });
    };

    useEffect(() => {
        loadCourseCCP();
    }, [courseId]);


    const removeCCPMember = (ccpMemberId) => {
        axios.delete(`/courses/${courseId}/ccp/${ccpMemberId}`).then((res) => {
            if (res.status === 200) {
                toast(t('Utilizador removido com sucesso da CCP!'), successConfig);
                setCCPMembers(ccpMembers.filter(ccpMember => ccpMember.id !== ccpMemberId));
            } else {
                toast(t('Ocorreu um problema ao remover o utilizador da CCP!'), errorConfig);
            }
        });
    };


    const searchUsers = (e, {searchQuery}) => {
        setSearchUser(true);
        axios.get(`/search/students?q=${searchQuery}`).then((res) => {
            if (res.status === 200) {
                setListOfCCPMembers(res.data);
                setSearchUser(false);
            }
        }).catch((err) => {
            console.log(err);
            setSearchUser(false);
        })
    };

    const addCCPMember = () => {
        setOpenModal(false);
        axios.patch(`/courses/${courseId}/ccp`, {
            user_email: userToAdd
        }).then((res) => {
            if (res.status === 200) {
                loadCourseCCP();
                toast(t('Utilizador adicionado com sucesso!'), successConfig);
            } else {
                toast(t('Ocorreu um erro ao adicionar o utilizador!'), errorConfig);
            }
        });
    };

    return (
        <div>
            { loading && (
                <div style={{height: "80px"}}>
                    <Dimmer active inverted>
                        <Loader indeterminate>{t('A carregar membros da CCP')}</Loader>
                    </Dimmer>
                </div>
            )}
            {!loading && (
                <>
                    <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                        <Segment clearing basic className={"padding-none"}>
                            <Button floated='right' icon labelPosition='left' positive size='small' onClick={() => setOpenModal(true)}>
                                <Icon name='add' /> { t("Adicionar membro da CCP") }
                            </Button>
                        </Segment>
                    </ShowComponentIfAuthorized>
                    <Table striped color="green">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{ t("Email") }</Table.HeaderCell>
                                <Table.HeaderCell>{ t("Nome") }</Table.HeaderCell>
                                <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                    <Table.HeaderCell>{ t("Ações") }</Table.HeaderCell>
                                </ShowComponentIfAuthorized>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {ccpMembers.map((ccpMember, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{ccpMember.email}</Table.Cell>
                                    <Table.Cell>{ccpMember.name}</Table.Cell>
                                    <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                        <Table.Cell width="3">
                                            <Button color="red" onClick={() => removeCCPMember(ccpMember.id)}>
                                                <Icon name="trash"/>
                                                { t("Remover membro da CCP") }
                                            </Button>
                                        </Table.Cell>
                                    </ShowComponentIfAuthorized>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>
            )}

            {openModal && (
                <Modal dimmer="blurring" open={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>{ t("Adicionar membro da CCP ") }</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Dropdown placeholder={ t("Procurar pelo email do utilizador") } label={ t("Utilizador a adicionar") } search selection
                                loading={searchUser}
                                // options={listOfStudents}
                                options={listOfCCPMembers.map((ccpMember) => ({
                                    key: ccpMember.id,
                                    text: ccpMember.name,
                                    value: ccpMember.email,
                                }))}
                                onSearchChange={_.debounce(searchUsers, 400)}
                                onChange={(e, { value }) => setUserToAdd(value)}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={() => { setUserToAdd(undefined);setOpenModal(false); }}>{ t("Cancelar") }</Button>
                        <Button positive onClick={addCCPMember}>{ t("Adicionar") }</Button>
                    </Modal.Actions>
                </Modal>
            )}
        </div>
    );
};

export default CourseTabsCCP;
