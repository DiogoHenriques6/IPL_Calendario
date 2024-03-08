import React, {useEffect, useState} from 'react';
import axios from 'axios';
import _, {debounce} from 'lodash';
import {Icon, Table, Form, Button, Modal, Dimmer, Loader, Segment} from 'semantic-ui-react';
import {toast} from 'react-toastify';
import {useTranslation} from "react-i18next";
import {successConfig, errorConfig} from '../../../utils/toastConfig';
import SCOPES from "../../../utils/scopesConstants";
import ShowComponentIfAuthorized from "../../../components/ShowComponentIfAuthorized";

const CourseTabsStudents = ({ courseId, isLoading }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [listOfStudents, setListOfStudents] = useState([]);
    const [studentToAdd, setStudentToAdd] = useState([]);
    const [searchStudent, setSearchStudent] = useState(false);

    const loadCourseStudents = () => {
        setLoading(true);
        isLoading = true;
        axios.get(`/courses/${courseId}/students`).then((res) => {
            setLoading(false);
            isLoading = false;
            setStudents(res.data.data);
        });
    };

    useEffect(() => {
        loadCourseStudents();
    }, [courseId]);


    const removeStudent = (studentId) => {
        axios.delete(`/courses/${courseId}/student/${studentId}`).then((res) => {
            if (res.status === 200) {
                toast(t('Estudante removido com sucesso do curso!'), successConfig);
            } else {
                toast(t('Ocorreu um problema ao remover o estudante do curso!'), errorConfig);
            }
        });
    };

    const searchStudents = (e, {searchQuery}) => {
        setSearchStudent(true);
        axios.get(`/search/students?q=${searchQuery}`).then((res) => {
            if (res.status === 200) {
                setListOfStudents(res.data);
                setSearchStudent(false);
            }
        });
    };

    const addStudent = () => {
        setOpenModal(false);
        axios.patch(`/courses/${courseId}/student`, {
            user_email: studentToAdd.value
        }).then((res) => {
            if (res.status === 200) {
                loadCourseStudents();
                toast(t('Estudante adicionado com sucesso!'), successConfig);
            } else {
                toast(t('Ocorreu um erro ao adicionar o estudante!'), errorConfig);
            }
        });
    };

    return (
        <div>
            { loading && (
                <div style={{height: "80px"}}>
                    <Dimmer active inverted>
                        <Loader indeterminate>{t('A carregar os estudantes')}</Loader>
                    </Dimmer>
                </div>
            )}
            {!loading && (
                <>
                    <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                        <Segment clearing basic className={"padding-none"}>
                            <Button floated='right' icon labelPosition='left' positive size='small' onClick={() => setOpenModal(true)}>
                                <Icon name='add' /> { t("Adicionar estudante") }
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
                            {students.map((student, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell>{student.email}</Table.Cell>
                                    <Table.Cell>{student.name}</Table.Cell>
                                    <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                        <Table.Cell width="3">
                                            <Button color="red" onClick={() => removeStudent(student.id)}>
                                                <Icon name="trash"/>
                                                { t("Remover estudante") }
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
                    <Modal.Header>{ t("Adicionar estudante") }</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Dropdown placeholder={ t("Procurar pelo email do estudante") } label={ t("Estudante a adicionar") } search selection
                                loading={searchStudent} options={listOfStudents} onSearchChange={_.debounce(searchStudents, 400)}
                                onChange={(e, {value}) => setStudentToAdd(
                                    listOfStudents.find((x) => x.value === value),
                                )}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={() => { setStudentToAdd(undefined);setOpenModal(false); }}>{ t("Cancelar") }</Button>
                        <Button positive onClick={addStudent}>{ t("Adicionar") }</Button>
                    </Modal.Actions>
                </Modal>
            )}
        </div>
    );
};

export default CourseTabsStudents;
