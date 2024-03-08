import React, {useEffect, useState} from 'react';
import {Card, Container, Dimmer, Form, Loader, Table, Button, Icon, Header, Popup} from 'semantic-ui-react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {toast} from 'react-toastify';
import ShowComponentIfAuthorized, {useComponentIfAuthorized} from '../../components/ShowComponentIfAuthorized';
import SCOPES from '../../utils/scopesConstants';
import {successConfig, errorConfig} from '../../utils/toastConfig';
import EmptyTable from "../../components/EmptyTable";
import {useTranslation} from "react-i18next";
import FilterOptionSchool from "../../components/Filters/Schools";
import FilterOptionDegree from "../../components/Filters/Degree";
import FilterOptionPerPage from "../../components/Filters/PerPage";
import PaginationDetail from "../../components/Pagination";
import _ from "lodash";

const SweetAlertComponent = withReactContent(Swal);

const CoursesList = () => {
    const { t } = useTranslation();
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(true);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [removingCourse, setRemovingCourse] = useState(undefined);

    // Filters
    const [searchTerm, setSearchTerm] = useState();
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [school, setSchool] = useState();
    const [degree, setDegree] = useState();
    const [withoutDegree, setWithoutDegree] = useState(false);

    // Table columns
    const columns = [
        {name: t('Unidade de Ensino'), style: {width: '15%'} },
        {name: t('Código'), style: {width: '10%'} },
        {name: t('Nome')},
        //{name: 'Sigla'},
        {name: t('Tipo de Curso'), style: {width: '15%'}},
        //{name: 'Numero de Anos'},
        {name: t('Ações'),  align: 'center', style: {width: '10%'} },
    ];

    useEffect(() => {
        fetchCourses();
    }, [searchTerm, school, degree, perPage, currentPage, withoutDegree]);

    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    const handleSearchCourses = (evt, {value}) => {
        setSearchTerm(value);
    };

    const fetchCourses = () => {
        setContentLoading(true);

        let searchLink = `/courses?page=${currentPage}`;
        searchLink += `${searchTerm ? `&search=${searchTerm}` : ''}`;
        searchLink += `${school ? `&school=${school}` : ''}`;
        searchLink += `${degree ? `&degree=${degree}` : ''}`;
        searchLink += `${withoutDegree ? `&without-degrees=${withoutDegree}` : ''}`;
        searchLink += '&per_page=' + perPage;

        axios.get(searchLink).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                setCourseList(response.data.data);
                setPaginationInfo(response.data.meta);
            }
            setLoading(false);
            setContentLoading(false);
            document.title = "Listagem dos Cursos - " + "Calendários de Avaliação - IPLeiria";
        });
    };


    const remove = (courseId) => {
        SweetAlertComponent.fire({
            title: t('Atenção!'),
            html: t('Ao eliminar o curso, todos os calendários, avaliações e métodos serão também eliminados.') + '<br/><strong>' + t('Tem a certeza que deseja eliminar este curso, em vez de editar?') + '</strong>',
            denyButtonText: t('Não'),
            confirmButtonText: t('Sim'),
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonColor: '#21ba45',
            denyButtonColor: '#db2828',
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setRemovingCourse(courseId);
                    axios.delete(`/courses/${courseId}`).then((res) => {
                        setRemovingCourse(null);
                        fetchCourses();
                        if (res.status === 200) {
                            toast(t('Curso eliminado com sucesso!'), successConfig);
                        } else {
                            toast(t('Ocorreu um problema ao eliminar este curso!'), errorConfig);
                        }
                    });
                }
            });
    };

    return (
        <Container>
            <Card fluid>
                <Card.Content>
                    <div className='card-header-alignment'>
                        <Header as="span">{ t("Cursos") }</Header>
                        <ShowComponentIfAuthorized permission={[SCOPES.CREATE_COURSES]} >
                            <Button onClick={() => setWithoutDegree(current => !current)} color="blue" loading={contentLoading}>Mostrar os sem Tipo de Curso</Button>
                        </ShowComponentIfAuthorized>
                    </div>
                </Card.Content>
                <Card.Content>
                    <Form>
                        <Form.Group>
                            <Form.Input icon='search' iconPosition='left' width={5} label={ t("Pesquisar curso...") } placeholder={ t("Pesquisar curso...") } onChange={_.debounce(handleSearchCourses, 500)} />
                            <FilterOptionSchool widthSize={5} eventHandler={(value) => setSchool(value)} />
                            <FilterOptionDegree widthSize={5} eventHandler={(value) => setDegree(value)} />
                            <FilterOptionPerPage widthSize={2} eventHandler={(value) => setPerPage(value)} />
                        </Form.Group>
                    </Form>
                </Card.Content>
                { !loading && courseList.length > 0 ? (
                    <Card.Content>
                        <Table celled fixed selectable striped>
                            <Table.Header>
                                <Table.Row>
                                    {columns.map((col, index) => (
                                        <Table.HeaderCell key={index} textAlign={col.align} style={ col.style } >{col.name} </Table.HeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {courseList.map(({id, school, code, name, level, has_issues}) => (
                                    <Table.Row key={code} warning={ (useComponentIfAuthorized(SCOPES.EDIT_COURSES) ? (has_issues) : false) }>
                                        <Table.Cell>{school}</Table.Cell>
                                        <Table.Cell>{code}</Table.Cell>
                                        <Table.Cell>
                                            <ShowComponentIfAuthorized permission={[SCOPES.EDIT_COURSES]}>
                                                {has_issues && <Popup trigger={<Icon name="warning sign" />} content={t('Falta preencher detalhes sobre este curso.')} position='top center'/>}
                                            </ShowComponentIfAuthorized>
                                            {name}
                                        </Table.Cell>
                                        <Table.Cell>{level}</Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <Link to={`/curso/${id}`}>
                                                <Button color="green" icon>
                                                    <Icon name="eye"/>
                                                </Button>
                                            </Link>
                                            <ShowComponentIfAuthorized permission={[SCOPES.DELETE_COURSES]}>
                                                <Button onClick={() => remove(id)} color="red" icon loading={removingCourse === id}>
                                                    <Icon name="trash"/>
                                                </Button>
                                            </ShowComponentIfAuthorized>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <PaginationDetail currentPage={currentPage} info={paginationInfo} eventHandler={changedPage} />
                        {contentLoading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{ t("A carregar os cursos") }</Loader>
                            </Dimmer>
                        )}
                    </Card.Content>
                    ) : ( <EmptyTable isLoading={loading} label={t('Sem resultados')}/> ) }
            </Card>
        </Container>
    );
};

export default CoursesList;
