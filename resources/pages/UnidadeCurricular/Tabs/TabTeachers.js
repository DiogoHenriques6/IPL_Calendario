import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Table, Form, Button, Checkbox, Dimmer, Loader} from 'semantic-ui-react';
import {toast} from 'react-toastify';
import {successConfig, errorConfig} from '../../../utils/toastConfig';
import ShowComponentIfAuthorized from "../../../components/ShowComponentIfAuthorized";
import SCOPES from "../../../utils/scopesConstants";
import Teachers from "../../../components/Filters/Teachers";
import {useTranslation} from "react-i18next";
import EmptyTable from "../../../components/EmptyTable";

const UnitTabTeacher = ({ unitId, isLoading, warningsHandler }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(true);
    const [teacherToAdd, setTeacherToAdd] = useState();
    const [courseUnitTeachers, setCourseUnitTeachers] = useState([]);

    const loadCourseUnitTeachers = () => {
        setContentLoading(true);
        isLoading = true;
        axios.get(`/course-units/${unitId}/teachers`).then((res) => {
            setLoading(false);
            setContentLoading(false);
            isLoading = false;
            setCourseUnitTeachers(res.data.data);
        });
    };

    const addTeacher = () => {
        setContentLoading(true);
        axios.post(`/course-units/${unitId}/teacher`, {
            teacher: teacherToAdd,
        }).then((res) => {
            if (res.status === 200) {
                loadCourseUnitTeachers();
                toast('Professor adicionado com sucesso!', successConfig);
            } else {
                setContentLoading(false);
                toast('Ocorreu um erro ao adicionar o professor!', errorConfig);
            }
        });
    };

    const removeTeacher = (teacherId) => {
        setContentLoading(true);
        axios.delete(`/course-units/${unitId}/teacher/${teacherId}`).then((res) => {
            if (res.status === 200) {
                loadCourseUnitTeachers();
                toast(t('Professor removido com sucesso da unidade curricular!'), successConfig);
            } else {
                setContentLoading(false);
                toast(t('Ocorreu um problema ao remover o professor da unidade curricular!'), errorConfig);
            }
        });
    };

    const setResponsible = (teacherId) => {
        setContentLoading(true);
        axios.patch(`/course-units/${unitId}/responsible`, {
            responsible_teacher: teacherId
        }).then((res) => {
            if (res.status === 200) {
                loadCourseUnitTeachers();
                toast(t('Guardou o responsável da UC com sucesso!'), successConfig);
            } else {
                setContentLoading(false);
                toast(t('Ocorreu um erro ao guardar o responsável da UC!'), errorConfig);
            }
        });
    };

    const handleSearchTeachers = (teacher) => {
        setTeacherToAdd(teacher);
    }

    useEffect(() => {
        loadCourseUnitTeachers();
    }, [unitId]);

    useEffect(() => {
        const hasResponable = courseUnitTeachers.filter((teacher) => teacher.is_responsible).length > 0;
        warningsHandler(!hasResponable);
    }, [courseUnitTeachers]);

    return (
        <div>
            <ShowComponentIfAuthorized permission={[SCOPES.DEFINE_COURSE_UNIT_TEACHERS]}>
                <Form>
                    <Form.Group widths="2" className={"align-items-end"}>
                        <Teachers isSearch={false} eventHandler={(value) => handleSearchTeachers(value)} isDisabled={loading}/>
                        <Form.Field className={"align-bottom"}>
                            <Button onClick={addTeacher} color={"green"}>{ t("Adicionar professor")}</Button>
                        </Form.Field>
                    </Form.Group>
                </Form>
            </ShowComponentIfAuthorized>
            { courseUnitTeachers.length < 1 || loading ? (
                <EmptyTable isLoading={loading} label={t("Ohh! Não foi possível encontrar professores para esta Unidades Curriculares!")}/>
            ) : (
                <Table striped color="green">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{ t('Nome') }</Table.HeaderCell>
                            <Table.HeaderCell>{ t('Email') }</Table.HeaderCell>
                            <ShowComponentIfAuthorized permission={[SCOPES.DEFINE_COURSE_UNIT_RESPONSIBLE]}>
                                <Table.HeaderCell style={{width: '15%'}} textAlign={"center"}>{ t('Responsável') }</Table.HeaderCell>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[SCOPES.DEFINE_COURSE_UNIT_TEACHERS]}>
                                <Table.HeaderCell style={{width: '15%'}} textAlign={"center"}>{ t('Ações') }</Table.HeaderCell>
                            </ShowComponentIfAuthorized>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {courseUnitTeachers?.map((teacher, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{teacher.name}</Table.Cell>
                                <Table.Cell>{teacher.email}</Table.Cell>
                                <ShowComponentIfAuthorized permission={[SCOPES.DEFINE_COURSE_UNIT_RESPONSIBLE]}>
                                    <Table.Cell style={{width: '15%'}} textAlign={"center"}>
                                            <Checkbox toggle disabled={teacher.is_responsible}  checked={teacher.is_responsible} onChange={() => setResponsible(teacher.id)} />
                                    </Table.Cell>
                                </ShowComponentIfAuthorized>
                                <ShowComponentIfAuthorized permission={[SCOPES.DEFINE_COURSE_UNIT_TEACHERS]}>
                                    <Table.Cell style={{width: '15%'}} textAlign={"center"}>
                                        <Button disabled={teacher.is_responsible} onClick={() => removeTeacher(teacher.id)} color="red" icon="trash" />
                                    </Table.Cell>
                                </ShowComponentIfAuthorized>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
            {!loading && contentLoading && (
                <Dimmer active inverted>
                    <Loader indeterminate>
                        { t("A carregar os dados") }
                    </Loader>
                </Dimmer>
            )}
        </div>
    );
};

export default UnitTabTeacher;
