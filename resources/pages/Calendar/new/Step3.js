import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    Header,
    Dimmer,
    Form,
    Grid,
    Divider,
    Icon,
    Card,
    Label,
    Loader,
    Table,
    Popup, Segment
} from 'semantic-ui-react';
import {useField} from 'react-final-form';
import axios from "axios";
import PaginationDetail from "../../../components/Pagination";
import FilterOptionPerPage from "../../../components/Filters/PerPage";
import {useTranslation} from "react-i18next";
import FilterOptionDegree from "../../../components/Filters/Degree";

const Step3 = ({allCourses, setAllCourses, courses, removeCourse, clearCourses, epoch, addCourse, addMultiCourses, loading, setLoading}) => {
    const { t } = useTranslation();
    const {input: coursesFieldInput} = useField('step3.courses');
    const [courseList, setCourseList] = useState([]);
    const [courseSearch, setCourseSearch] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [degree, setDegree] = useState();
    const [perPage, setPerPage] = useState(10);
    const [allResults, setAllResults] = useState(false);

    const [paginationInfo, setPaginationInfo] = useState({});

    useEffect(() => {
        coursesFieldInput.onChange(courses);
    }, [courses]);

    const searchCourse = (evt, {value}) => {
        setCourseSearch(value);
    };

    useEffect(() => {
        fetchCourses();
    }, [currentPage]);

    useEffect(() => {
        if(allResults) {
            fetchCourses();
        }
    }, [allResults]);

    useEffect(() => {
        if(currentPage === 1){
            fetchCourses();
        } else {
            setCurrentPage(1);
        }
    }, [courseSearch, perPage, degree, epoch]);

    const fetchCourses = () => {
        if(!allResults) {
            setLoading(true);
        }

        let searchLink = `/courses?page=${currentPage}`;
        searchLink += `${courseSearch ? `&search=${courseSearch}` : ''}`;
        searchLink += `${degree ? `&degree=${degree}` : ''}`;
        searchLink += `${epoch ? `&epoch=${epoch}` : ''}`;
        searchLink += '&per_page=' + ( allResults ? "all" : perPage );
        //searchLink += `${school ? `&school=${school}` : ''}`;
        //searchLink += `${degree ? `&degree=${degree}` : ''}`;

        axios.get(searchLink).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if(!allResults) {
                    setCourseList(response.data.data);
                    setPaginationInfo(response.data.meta);
                    setLoading(false);
                } else {
                    addMultiCourses(response.data.data);
                    setAllResults(false);
                }
            }
        });
    };

    const changedPage = (activePage) => {
        setCurrentPage(activePage);
    }

    return (
        <Container>
            <Card.Content>
                <Form.Group>
                    <Form.Input width={6} label={t("Pesquisar curso (Código, Sigla ou Nome)")} placeholder={ t("Pesquisar...") } fluid onChange={_.debounce(searchCourse, 900)}/>
                    <FilterOptionDegree widthSize={5} showAllDegrees={true} eventHandler={(value) => setDegree(value)}/>
                    <FilterOptionPerPage widthSize={2} eventHandler={(value) => setPerPage(value)} />
                </Form.Group>
            </Card.Content>
            <div className='margin-top-m margin-bottom-base'><Divider fitted /></div>
            <Card.Content>
                {courses.length ? (
                    <div>
                        <Header as="h5">
                            { t("Cursos selecionados") }
                            { courses.length > 0 && (
                                <Button floated='right' onClick={() => clearCourses() } color="red">{ t("Remover cursos selecionados") + " (" + courses.length + ")" }</Button>
                            )}
                        </Header>
                        <Grid.Row>
                            {courses.map((course, index) => (
                                <Label key={index} size={"large"} className={"margin-bottom-s"}>
                                    {course.code + ' - ' + course.name}
                                    <Icon name='delete' color={"red"} onClick={() => removeCourse(course.id)} />
                                </Label>
                            ))}
                        </Grid.Row>
                        <div className='margin-top-base margin-bottom-m'><Divider fitted /></div>
                    </div>
                ) : null}
            </Card.Content>
            <Card.Content>
            {!allCourses && (
                    <>
                        {paginationInfo.total > 0 && (
                            <Segment clearing basic>
                                <Button floated='right' onClick={() => setAllResults(true) } color="blue">{ t("Adicionar todos os cursos") + " (" + paginationInfo.total + ")" }</Button>
                            </Segment>
                        )}
                        <Grid.Row>
                            <Table color="green">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{ t("Código") }</Table.HeaderCell>
                                        <Table.HeaderCell>{ t("Sigla") }</Table.HeaderCell>
                                        <Table.HeaderCell>{ t("Nome") }</Table.HeaderCell>
                                        <Table.HeaderCell>{ t("Adicionar") }</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {courseList.map((course, index) => (
                                        <Table.Row key={index} warning={course.has_calendar}>
                                            <Table.Cell>{course.code}</Table.Cell>
                                            <Table.Cell>{course.initials}</Table.Cell>
                                            <Table.Cell>
                                                {course.has_calendar && (<Popup trigger={<Icon name="warning sign" />} content={(<div>{t("Já tem calendário")}</div>)} position='top center'/>)}
                                                {course.name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                { ( !!courses.find(({id: courseId}) => courseId === course.id) ? (
                                                    <Button onClick={() => removeCourse(course.id)} color="red">{ t("Remover") }</Button>
                                                ) : (
                                                    <Button onClick={() => addCourse(course)} color="teal">{ t("Adicionar") }</Button>
                                                )) }
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Row>
                        <Grid.Row>
                            <PaginationDetail currentPage={currentPage} info={paginationInfo} eventHandler={changedPage} />
                        </Grid.Row>
                        {loading && (
                            <Dimmer active inverted>
                                <Loader indeterminate>{ t("A carregar os cursos") }</Loader>
                            </Dimmer>
                        )}
                    </>
                )}
            </Card.Content>
        </Container>
    );
};

export default Step3;
