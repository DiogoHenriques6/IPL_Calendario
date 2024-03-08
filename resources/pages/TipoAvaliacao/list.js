import React, { useCallback, useEffect, useState } from 'react';
import { Card, Container, Table, Form, Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import { errorConfig, successConfig } from '../../utils/toastConfig';
import ShowComponentIfAuthorized from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import EmptyTable from "../../components/EmptyTable";

const List = () => {
    const { t } = useTranslation();
    const columns = [
        {name: t('Nome')},
        {name: t('Ativo?'), align: 'center', style: {width: '15%'} },
        {name: t('Ações'),  align: 'center', style: {width: '15%'} },
    ];
    const [filteredResults, setFilteredResults] = useState([]);
    const [evaluationTypes, setEvaluationTypes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvaluationTypes = () => {
        setIsLoading(true);

        axios.get('/evaluation-types/').then((response) => {
            setIsLoading(false);
            if (response.status >= 200 && response.status < 300) {
                setEvaluationTypes(response.data?.data);
                setFilteredResults(response?.data?.data);
            }
        });
    };

    useEffect(() => {
        fetchEvaluationTypes();
    }, []);

    const filterResults = useCallback(
        (searchTerm) => {
            const filtered = evaluationTypes.filter(
                (x) => x.code.toLowerCase().includes(searchTerm.toLowerCase()) || x.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            setFilteredResults(filtered);
        },
        [evaluationTypes],
    );

    const handleModalClose = () => setModalOpen(false);

    const handleSearch = ({ target: { value: searchTerm } }) => {
        filterResults(searchTerm);
    };

    const remove = (interruption) => {
        setModalInfo(interruption);
        setModalOpen(true);
    };

    const handleRemoval = () => {
        axios.delete(`/evaluation-types/${modalInfo?.id}`).then((res) => {
            if (res.status === 200) {
                toast(t("Tipo de Avaliação removido com sucesso!"), successConfig);
                setEvaluationTypes(response.data?.data);
                setFilteredResults(response?.data?.data);
            } else {
                toast(t("Não foi possível remover o Tipo de Avaliação!"), errorConfig);
            }
        });
        handleModalClose();
    };

    return (
        <Container>
            <Card fluid>
                <Card.Content>
                    <div className='card-header-alignment'>
                        <Header as="span">{t("Tipos de Avaliação")}</Header>
                        <ShowComponentIfAuthorized permission={[SCOPES.CREATE_EVALUATION_TYPES]}>
                            { !isLoading && (
                                <Link to="/tipo-avaliacao/novo">
                                    <Button floated="right" color="green">{t("Novo")}</Button>
                                </Link>
                            )}
                        </ShowComponentIfAuthorized>
                    </div>
                </Card.Content>

                <Card.Content>
                    <Form>
                        <Form.Group widths="2">
                            <Form.Input label={t("Pesquisar")} placeholder={t("Pesquisar tipo de avaliação...")} onChange={_.debounce(handleSearch, 400)} />
                        </Form.Group>
                    </Form>
                </Card.Content>

                <Card.Content>
                { filteredResults.length < 1 || isLoading ? (
                    <EmptyTable isLoading={isLoading} label={t("Ohh! Não foi possível encontrar Tipos de Avaliação!")}/>
                    ) : (
                    <Table celled fixed>
                        <Table.Header>
                            <Table.Row>
                                {columns.map((col, index) => (
                                    <Table.HeaderCell key={index} textAlign={col.align} style={ col.style } >{col.name}</Table.HeaderCell>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { filteredResults?.map(({ id, name, enabled, removable }, index ) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Icon name={!enabled ? 'close' : 'check'} />
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <ShowComponentIfAuthorized permission={[SCOPES.EDIT_EVALUATION_TYPES]}>
                                            <Link to={`/tipo-avaliacao/edit/${id}`}>
                                                <Button color="yellow" icon>
                                                    <Icon name="edit"/>
                                                </Button>
                                            </Link>
                                        </ShowComponentIfAuthorized>
                                        <ShowComponentIfAuthorized permission={[SCOPES.DELETE_EVALUATION_TYPES]}>
                                            <Button onClick={() => remove({id, name}) } color="red" icon>
                                                <Icon name="trash"/>
                                            </Button>
                                        </ShowComponentIfAuthorized>
                                    </Table.Cell>
                                </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                    )}
                </Card.Content>
            </Card>

            <Modal dimmer="blurring" open={modalOpen} onClose={handleModalClose} >
                <Modal.Header>{t("Remover Tipo de Avaliação")}</Modal.Header>
                <Modal.Content>{t("Tem a certeza que deseja remover o tipo de avaliação")} <strong>{modalInfo?.name}</strong> ?</Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleModalClose}>{t("Cancelar")}</Button>
                    <Button positive onClick={handleRemoval}>{t("Sim")}</Button>
                </Modal.Actions>
            </Modal>
        </Container>
    );
};

export default List;
