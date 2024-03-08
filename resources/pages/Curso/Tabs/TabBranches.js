import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Form, Button, Table, Icon, Modal, Dimmer, Loader } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {useTranslation} from "react-i18next";

import {successConfig, errorConfig} from '../../../utils/toastConfig';
import SCOPES from "../../../utils/scopesConstants";
import ShowComponentIfAuthorized, {useComponentIfAuthorized} from "../../../components/ShowComponentIfAuthorized";
const SweetAlertComponent = withReactContent(Swal);

const CourseTabsBranches = ({ courseId }) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [branches, setBranches] = useState([]);
    const [newBranch, setNewBranch] = useState({id: null, name_pt: '', initials_pt: '', name_en: '', initials_en: ''});

    const loadCourseBranches = () => {
        setLoading(true);
        axios.get(`/courses/${courseId}/branches`).then((res) => {
            setBranches(res.data.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadCourseBranches();
    }, [courseId]);

    const addNewBranch = () => {
        setLoadingRequest(true);
        const isNew = !newBranch.id;
        const axiosFn = isNew ? axios.post : axios.patch;
        axiosFn(`/courses/${courseId}/branch`, newBranch).then((res) => {
            if (res.status === 200) {
                setBranches(res.data.data);
                toast(t('Ramo adicionado com sucesso!'), successConfig);
                closeModal();
                setLoadingRequest(false);
            } else {
                toast(t('Ocorreu um erro ao gravar o ramo!'), errorConfig);
            }
        });
    };

    const closeModal = () => {
        setOpenModal(false);
        setNewBranch({id: null, name_pt: '', initials_pt: '', name_en: '', initials_en: ''});
    }

    const editBranch = (branch) => {
        setNewBranch(branch);
        setOpenModal(true);
    }

    const removeBranch = (branchId) => {
        SweetAlertComponent.fire({
            title: t('Atenção!'),
            html: `${t('Ao eliminar este ramo, todas as UCs deste ramo, terão de ser atualizadas posteriormente!')}<br/><strong>${t("Tem a certeza que deseja eliminar este ramo?")}</strong>`,
            denyButtonText: t('Não'),
            confirmButtonText: t('Sim'),
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: '#21ba45',
            denyButtonColor: '#db2828',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoadingRequest(true);
                axios.delete(`/courses/${courseId}/branch/${branchId}`).then((res) => {
                    if (res.status === 200) {
                        setBranches(res.data.data);
                        setLoadingRequest(false);
                        toast(t('Ramo eliminado com sucesso!'), successConfig);
                    } else {
                        toast(t('Ocorreu um problema ao eliminar este ramo!'), errorConfig);
                    }
                });
            }
        });
    };

    return (
        <div>
            { loading && (
                <div style={{height: "80px"}}>
                    <Dimmer active inverted>
                        <Loader indeterminate>{t('A carregar os ramos')}</Loader>
                    </Dimmer>
                </div>
            )}
            {!loading && (
                <Table compact celled className={(useComponentIfAuthorized(SCOPES.EDIT_COURSES) ? "definition-last" : "")}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={4}>{ t("Nome") } - PT</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{ t("Iniciais") } - PT</Table.HeaderCell>
                            <Table.HeaderCell width={4}>{ t("Nome") } - EN</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{ t("Iniciais") } - EN</Table.HeaderCell>
                            <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                <Table.HeaderCell style={{ width: "1%" }} />
                            </ShowComponentIfAuthorized>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {branches?.map((branch, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{ branch.name_pt }</Table.Cell>
                                <Table.Cell>{ branch.initials_pt }</Table.Cell>
                                <Table.Cell>{ branch.name_en }</Table.Cell>
                                <Table.Cell>{ branch.initials_en }</Table.Cell>
                                <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                    <Table.Cell collapsing>
                                        <Button color="yellow" icon onClick={() => editBranch(branch)}>
                                            <Icon name={"pencil"} />
                                        </Button>
                                        <Button color="red" icon onClick={() => removeBranch(branch.id)}>
                                            <Icon name={"trash"} />
                                        </Button>
                                    </Table.Cell>
                                </ShowComponentIfAuthorized>
                            </Table.Row>
                        ))}
                    </Table.Body>
                    {/*
                        <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                            <Table.Footer fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='5'>
                                        <Button floated='right' icon labelPosition='left' color={"green"} size='small' onClick={() => setOpenModal(true)} >
                                            <Icon name='plus' /> { t("Adicionar ramo") }
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </ShowComponentIfAuthorized>
                    */}
                </Table>
            )}

            {openModal && (
                <Modal dimmer="blurring" open={openModal} onClose={closeModal}>
                    <Modal.Header>{ t("Adicionar ramo") }</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths={2}>
                                <Form.Input value={newBranch.name_pt} label={ t("Nome do ramo") + " - PT" } placeholder={ t("Nome do ramo") + " - PT" } onChange={(e, {value}) => setNewBranch(newBranch => ({...newBranch, name_pt: value}))}/>
                                <Form.Input value={newBranch.initials_pt} label={ t("Iniciais do ramo") + " - PT" } placeholder={ t("Iniciais do ramo") + " - PT" } onChange={(e, {value}) => setNewBranch(newBranch => ({...newBranch, initials_pt: value}))}/>
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Input value={newBranch.name_en} label={ t("Nome do ramo") + " - EN" } placeholder={ t("Nome do ramo") + " - EN" } onChange={(e, {value}) => setNewBranch(newBranch => ({...newBranch, name_en: value}))}/>
                                <Form.Input value={newBranch.initials_en} label={ t("Iniciais do ramo") + " - EN" } placeholder={ t("Iniciais do ramo") + " - EN" } onChange={(e, {value}) => setNewBranch(newBranch => ({...newBranch, initials_en: value}))}/>
                            </Form.Group>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button floated={"left"} negative onClick={closeModal}>{ t("Cancelar") }</Button>
                        <Button positive onClick={addNewBranch} loading={loadingRequest}>{ t((newBranch.id != null ? "Guardar" : "Adicionar")) }</Button>
                    </Modal.Actions>
                </Modal>
            )}
        </div>
    );
};

export default CourseTabsBranches;
