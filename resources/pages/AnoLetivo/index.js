import React, {useEffect, useState} from 'react';
import {Card, Container, Table, Button, Icon, Modal, Header, Checkbox, Popup, Message} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {toast} from 'react-toastify';
import ShowComponentIfAuthorized from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import {successConfig, errorConfig, infoConfig} from '../../utils/toastConfig';
import EmptyTable from "../../components/EmptyTable";
import YearSelector from "./yearSelector";
import moment from "moment";

const SweetAlertComponent = withReactContent(Swal);


const AnoLetivo = () => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState();
    const [academicYearsList, setAcademicYearsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        {name: t('Descrição') },
        {name: t('Ativo'),          textAlign: 'center', popup: <Popup trigger={<Icon name="info circle" />} content={t('Anos letivos disponivies para os utilizadores selecionarem.')} position='top center'/>},
        {name: t('Selecionado'),    textAlign: 'center', popup: <Popup trigger={<Icon name="info circle" />} content={t('É o ano que irá estar selecionado automáticamente para o utilizador! Apenas um pode estar selecionado de cada vez.')} position='top center'/>},
        {name: 'S1 Sync',           popup: <Popup trigger={<Icon name="info circle" />} content={t('Quando os 2 semestres estao sincronizados, o ano letivo poderá ser ativado.')} position='top center'/>},
        {name: 'S2 Sync',           popup: <Popup trigger={<Icon name="info circle" />} content={t('Quando os 2 semestres estao sincronizados, o ano letivo poderá ser ativado.')} position='top center'/>},
        {name: t('Ações'),          style: {width: '15%'}}
    ];

    const getAcademicYearsList = () => {
        setLoading(true);
        axios.get('academic-years').then((response) => {
            setLoading(false);
            if (response.status >= 200 && response.status < 300) {
                setAcademicYearsList(response?.data?.data);
            }
        });
    }

    useEffect(() => {
        getAcademicYearsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const remove = (id, code) => {
        setModalInfo({id, code});
        setModalOpen(true);
    };


    const handleModalClose = () => setModalOpen(false);

    const handleRemoval = () => {
        handleModalClose();
        setLoading(true);
        axios.delete('/academic-year/' + modalInfo.id).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                toast(t('ano_letivo.Ano letivo removido com sucesso!'), successConfig);
                setAcademicYearsList(res?.data?.data);
            } else {
                toast(t('ano_letivo.Ocorreu um problema ao remover o ano letivo!'), errorConfig);
            }
        });
    };

    const handleYearSelected = (id, index) => {
        const toUpdateSelectedIndex = academicYearsList.findIndex((el) => el.id === id);
        const toUpdateUnSelectedIndex = academicYearsList.findIndex((el) => el.selected);

        if(toUpdateUnSelectedIndex === -1 || (toUpdateSelectedIndex !== toUpdateUnSelectedIndex)){
            setAcademicYearsList((current) => {
                const oldList = [...current];
                // update isSelectedLoading value
                oldList.forEach((item) =>  item.isSelectedLoading = item.id === id);
                return oldList;
            });
            axios.post('/academic-year/' + id + "/selected").then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    setAcademicYearsList((current) => {
                        const oldList = [...current];
                        // update isSelectedLoading and selected value
                        oldList.forEach((item) => {
                            if(item.id === id) {
                                item.selected = true;
                                item.isSelectedLoading = false;
                            }
                            return item;
                        });
                        return oldList;
                    });
                    toast(t('ano_letivo.Ano letivo atualizado com sucesso!'), successConfig);
                    document.location.reload();
                } else {
                    toast(t('ano_letivo.Ocorreu um problema ao atualizar o ano letivo!'), errorConfig);
                }
            });
        } else {
            toast(t('O ano letivo já está selecionado!'), infoConfig);
        }
    };

    const handleYearActive = (id, index) => {
        setAcademicYearsList((current) => {
            const oldList = [...current];
            // update isActiveLoading value
            oldList.forEach((item) => item.isActiveLoading = (item.id === id ? true : item.isActiveLoading));
            return oldList;
        });
        axios.post('/academic-year/' + id + "/active").then((res) => {
            if (res.status === 200) {
                toast(t('ano_letivo.Ano letivo atualizado com sucesso!'), successConfig);
                setAcademicYearsList((current) => {
                    const oldList = [...current];
                    // update isActiveLoading and active value
                    oldList.forEach((item) => {
                        if(item.id === id) {
                            item.isActiveLoading = false;
                            item.active = !item.active;
                        }
                        return item;
                    });
                    return oldList;
                });
            } else {
                toast(t('ano_letivo.Ocorreu um problema ao atualizar o ano letivo!'), errorConfig);
                setAcademicYearsList((current) => {
                    const oldList = [...current];
                    // update isActiveLoading value
                    oldList.forEach((item) => item.isActiveLoading = (item.id === id ? false : item.isActiveLoading));
                    return oldList;
                });
            }
        });
    };
    const syncSemester = (id, semester, year, index) => {
        // update s[X]_sync_active, s[X]_sync_waiting value
        setAcademicYearsList((current) => {
            const oldList = [...current];
            oldList.forEach((item) => {
                if(item.id === id) {
                    if(semester === 1) {
                        item.s1_sync_active = true;
                        item.s1_sync_waiting = true;
                    } else {
                        item.s2_sync_active = true;
                        item.s2_sync_waiting = true;
                    }
                }
                return item;
            });
            return oldList;
        });
        axios.get('/academic-year/' + id + "/sync/" + semester).then((res) => {
            if (res.status === 200) {
                toast(() => <div>{t('ano_letivo.Irá começar brevemente a sincronização do ano letivo')} <b>{year}</b>!</div>, successConfig);
            } else {
                if (res.status === 409){ // conflict?
                    toast(() => <div>{t(res.data)}</div>, errorConfig);
                } else {
                    toast(() => <div>{t('ano_letivo.Ocorreu um problema ao tentar começar sincronizar o ano letivo')} <b>{ year }</b>!</div>, errorConfig);
                }
                // update s[X]_sync_active, s[X]_sync_waiting value
                setAcademicYearsList((current) => {
                    const oldList = [...current];
                    oldList.forEach((item) => {
                        if(item.id === id) {
                            if(semester === 1) {
                                item.s1_sync_active = false;
                                item.s1_sync_waiting = false;
                            } else {
                                item.s2_sync_active = false;
                                item.s2_sync_waiting = false;
                            }
                        }
                        return item;
                    });
                    return oldList;
                });
            }
        });
    }

    const openNewAcademicYear = () => {
        let selectedYear = "";
        SweetAlertComponent.fire({
            title: t('ano_letivo.Abrir novo ano letivo'),
            html: <YearSelector existingYears={academicYearsList} yearChange={(year) => {selectedYear = year;}} />,
            denyButtonText: t('Não'),
            confirmButtonText: t('Sim'),
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: '#21ba45',
            denyButtonColor: '#db2828',
        }).then((result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    const codeYear = selectedYear.replace('-', '');
                    axios.post('/academic-years', {
                        code: codeYear,
                        display: selectedYear,
                    }).then((res) => {
                        if (res.status === 201) {
                            toast(t('ano_letivo.O novo ano letivo foi aberto com sucesso!'), successConfig);
                            setAcademicYearsList(res?.data?.data);
                            setLoading(false);
                        } else {
                            toast(t('ano_letivo.Ocorreu um problema ao abrir um novo ano letivo!'), errorConfig);
                        }
                    });
                }
            });
    };

    return (
        <Container>
            <Card fluid>
                <Card.Content>
                    <div>
                        <Header as="span" className={'display-inline'}>{t('ano_letivo.Anos letivos')}</Header>
                        <ShowComponentIfAuthorized permission={[SCOPES.CREATE_ACADEMIC_YEARS]}>
                            {!loading && (
                                <Button floated="right" color="green" onClick={openNewAcademicYear}>
                                    {t('Criar novo')}
                                </Button>
                            )}
                        </ShowComponentIfAuthorized>
                    </div>
                </Card.Content>
                <Card.Content>
                    { !loading && academicYearsList.length > 0 ? (
                        <Table celled fixed>
                            <Table.Header>
                                <Table.Row>
                                    {columns.map(({name, textAlign, popup, style}, index) => (
                                        <Table.HeaderCell key={index} textAlign={textAlign} style={ style }>{name} {popup}</Table.HeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { academicYearsList.map(({id, active, selected, display, code, isActiveLoading, isSelectedLoading, s1_sync, s2_sync, s1_sync_active, s2_sync_active, s1_sync_waiting, s2_sync_waiting}, index) => (
                                    <Table.Row key={id}>
                                        <Table.Cell><b>{display}</b> <small>({code})</small></Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <ShowComponentIfAuthorized permission={[SCOPES.EDIT_ACADEMIC_YEARS]} renderIfNotAllowed={<Checkbox toggle disabled defaultChecked={active}/>}>
                                                { isActiveLoading && (<Icon loading name='spinner'/>)}
                                                <Checkbox toggle checked={active} disabled={!(s1_sync || s2_sync)} onChange={() => handleYearActive(id, index)} />
                                            </ShowComponentIfAuthorized>
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <ShowComponentIfAuthorized permission={[SCOPES.EDIT_ACADEMIC_YEARS]} renderIfNotAllowed={<Checkbox toggle disabled defaultChecked={selected}/>}>
                                                { isSelectedLoading && (<Icon loading name='spinner'/>)}
                                                <Checkbox toggle checked={selected} disabled={selected || !active} onChange={() => handleYearSelected(id, index)} />
                                            </ShowComponentIfAuthorized>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button disabled={s1_sync_active || s1_sync_waiting} loading={s1_sync_active} icon color="olive" onClick={() => syncSemester(id, 1, display, index)}>
                                                <Icon name={'sync'}/>
                                            </Button>
                                            { s1_sync ? (<span title={moment.utc(s1_sync).local().format('YYYY-MM-DD HH:mm:ss')}> {moment.utc(s1_sync).local().fromNow()}</span>) : 'N/A' }
                                            { s1_sync_waiting && <div> Waiting to be synced </div> }
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button disabled={s2_sync_active || s2_sync_waiting} loading={s2_sync_active} icon color="olive" onClick={() => syncSemester(id, 2, display, index)}>
                                                <Icon name={'sync'}/>
                                            </Button>
                                            { s2_sync ? (<span title={moment.utc(s2_sync).local().format('YYYY-MM-DD HH:mm:ss')}> {moment.utc(s2_sync).local().fromNow()}</span>) : 'N/A' }
                                            { s2_sync_waiting && <div> Waiting to be synced </div> }
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <ShowComponentIfAuthorized permission={[SCOPES.DELETE_ACADEMIC_YEARS]}>
                                                <Button onClick={() => remove(id, code)} color="red" icon disabled={selected}>
                                                    <Icon name="trash"/>
                                                </Button>
                                            </ShowComponentIfAuthorized>
                                        </Table.Cell>
                                    </Table.Row>
                                )) }
                            </Table.Body>
                        </Table>
                        ) : ( <EmptyTable isLoading={loading} label={t('Sem resultados')}/> ) }
                </Card.Content>
            </Card>
            <Message info>
                <Message.Header>{t('ano_letivo.Não consigo ativar um ano letivo.. Porquê?')}</Message.Header>
                <p>{ t('ano_letivo.Para ativar um Ano Letivo é necessário correr 1º a sincronização de um semestre.') }</p>
                <br/>
                <Message.Header>{t('ano_letivo.A sincronização vai sempre acontecer quando clicarmos no botão?')}</Message.Header>
                <p>{ t('ano_letivo.Não. Irá ser iniciada a sincronização quando não houver trabalho para o servidor.') }</p>
                <br/>

                    <Message.Header>{t('ano_letivo.O que vai sincronizar?')}</Message.Header>
                    <p>
                        { t('ano_letivo.Irá sincronizar as escolas que já tenham os dados preenchidos. Para ver a lista das escolas que irão ser sincronizadas.') }
                        <ShowComponentIfAuthorized permission={[SCOPES.EDIT_SCHOOLS]}>
                            { t('Para mais informações, pode ver através deste')} <a className="margin-left-xs" href="/escola" target={"_blank"}><Icon name={"external"}/>link</a>
                        </ShowComponentIfAuthorized>
                    </p>
                    <br/>

                <Message.Header>{ t('ano_letivo.Outras informações') }</Message.Header>
                <p>{ t('ano_letivo.Apenas 1 sincronização pode acontecer de cada vez, para prevenir duplicações ou bloqueio do servidor.') }</p>
            </Message>
            <Modal dimmer="blurring" open={modalOpen} onClose={handleModalClose}>
                <Modal.Header>{t('ano_letivo.Remover Ano letivo')}</Modal.Header>
                <Modal.Content>
                    {t('ano_letivo.Tem a certeza que deseja remover o Ano letivo')} <strong>{modalInfo?.code}</strong>?
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleModalClose}>{t('Cancelar')}</Button>
                    <Button positive onClick={handleRemoval}>{t('Sim')}</Button>
                </Modal.Actions>
            </Modal>
        </Container>
    );
};

export default AnoLetivo;
