import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {Container, Menu, Dropdown, Icon, Label} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import {logout, setAcademicYear} from '../../redux/app/actions';
import {
    ACADEMIC_YEAR_SCOPES,
    CALENDAR_PHASES_SCOPES,
    CONFIG_SCOPES,
    COURSE_SCOPES,
    COURSE_UNIT_SCOPES,
    UC_GROUPS_SCOPES,
    EVALUATION_TYPE_SCOPES,
    INTERRUPTION_TYPES_SCOPES,
    SCHOOLS_SCOPES,
    USER_GROUPS_SCOPES,
    USER_SCOPES,
} from '../../utils/scopesConstants';
import ShowComponentIfAuthorized from '../ShowComponentIfAuthorized';

const HeaderMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [academicYearsList, setAcademicYearsList] = useState([]);

    useEffect(() => {
        axios.get('academic-years/menu').then((response) => {
            if (response.status >= 200 && response.status < 300) {
                dispatch(setAcademicYear(response?.data?.data?.find((year) => year.selected)));
                setAcademicYearsList(response?.data?.data);
            }
        });
    }, []);

    const logoutUser = () => {
        axios.post('/logout').then(() => {
            localStorage.removeItem('language');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('groups');
            localStorage.removeItem('scopes');
            localStorage.removeItem('calendarPermissions');
            localStorage.removeItem('academicYear');
            dispatch(logout());
            navigate('/login');
        });
    };

    const switchAcademicYear = (academicYear) => {
        axios.post('academic-years/switch', {
                switch_to: academicYear.id,
            })
            .then(() => {
                const splitYear = (academicYear.display).split("-");
                localStorage.setItem('academicYear', splitYear[0] + "-20" + splitYear[1]);
                dispatch(setAcademicYear(academicYear));
                window.location.reload();
            });
    };

    const selectedAcademicYear = useSelector((state) => state.app.academicYear);

    return (
        <Menu borderless>
            <Container>
                <Menu.Item as={Link} to="/"
                           className={ (location.pathname.includes('/calendario') || location.pathname === '/') ? 'active' : ''}>
                    {t('menu.Calendários') }
                </Menu.Item>
                <ShowComponentIfAuthorized permission={[COURSE_UNIT_SCOPES[0]]}>
                    <Menu.Item  as={Link} to="/unidade-curricular" disabled={academicYearsList.length === 0}
                                className={ location.pathname.includes('/unidade-curricular') ? 'active' : ''}>
                        {t('menu.Unidades Curriculares')}
                    </Menu.Item>
                </ShowComponentIfAuthorized>
                <ShowComponentIfAuthorized permission={[UC_GROUPS_SCOPES[0]]}>
                    <Menu.Item as={Link} to="/agrupamento-unidade-curricular" disabled={academicYearsList.length === 0}
                               className={ location.pathname.includes('/agrupamento-unidade-curricular') ? 'active' : ''}>
                        {t('menu.UCs Agrupadas')}
                    </Menu.Item>
                </ShowComponentIfAuthorized>
                <ShowComponentIfAuthorized permission={[COURSE_SCOPES[0]]}>
                    <Menu.Item as={Link} to="/curso" disabled={academicYearsList.length === 0}
                               className={ location.pathname.includes('/curso') ? 'active' : ''}>
                        {t('menu.Cursos')}
                    </Menu.Item>
                </ShowComponentIfAuthorized>

                <ShowComponentIfAuthorized permission={[...CONFIG_SCOPES]}>
                    <Dropdown item text={t('menu.Configurações')} icon={ (academicYearsList.length === 0 ? "warning circle" : "dropdown") }
                        className={ (location.pathname.includes('/ano-letivo') || location.pathname.includes('/escola') ||
                            location.pathname.includes('/fases-calendario') || location.pathname.includes('/tipo-interrupcao') ||
                            location.pathname.includes('/tipo-avaliacao') || location.pathname.includes('/grupo-utilizador') ||
                            location.pathname.includes('/utilizador')) ? 'active' : ''}>
                        <Dropdown.Menu>
                            <ShowComponentIfAuthorized permission={[...ACADEMIC_YEAR_SCOPES]}>
                                <Dropdown.Item as={Link} to="/ano-letivo">{t('menu.Anos Letivos')} { academicYearsList.length === 0 && (<Icon name={"warning circle"} />) }</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[...SCHOOLS_SCOPES]}>
                                <Dropdown.Item as={Link} to="/escola">{t('menu.Escolas')}</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[...CALENDAR_PHASES_SCOPES]}>
                                <Dropdown.Item disabled={academicYearsList.length === 0} as={Link} to="/fases-calendario">{t('menu.Fases Calendário')}</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[...INTERRUPTION_TYPES_SCOPES,]}>
                                <Dropdown.Item disabled={academicYearsList.length === 0} as={Link} to="/tipo-interrupcao">{t('menu.Tipos Interrupções')}</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[...EVALUATION_TYPE_SCOPES]}>
                                <Dropdown.Item disabled={academicYearsList.length === 0} as={Link} to="/tipo-avaliacao">{t('menu.Tipos Avaliações')}</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[...USER_GROUPS_SCOPES]}>
                                <Dropdown.Item disabled={academicYearsList.length === 0} as={Link} to="/grupo-utilizador">{t('menu.Grupos Utilizador')}</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                            <ShowComponentIfAuthorized permission={[...USER_SCOPES]}>
                                <Dropdown.Item disabled={academicYearsList.length === 0} as={Link} to="/utilizador">{t('menu.Utilizadores')}</Dropdown.Item>
                            </ShowComponentIfAuthorized>
                        </Dropdown.Menu>
                    </Dropdown>
                </ShowComponentIfAuthorized>
                <Menu.Menu position="right">
                    {academicYearsList?.length === 1 && (
                        <Menu.Item>{academicYearsList[0].display}</Menu.Item>
                    )}
                    {academicYearsList?.length > 1 && (
                        <Dropdown item text={selectedAcademicYear?.display}>
                            <Dropdown.Menu>
                                {academicYearsList?.map((academicYear) => (
                                    <Dropdown.Item key={academicYear?.code} onClick={()=>{switchAcademicYear(academicYear)}}>
                                        { academicYear.selected ? (
                                            <span className={"align-items-center"}>
                                                <b className={"margin-right-xs"}>{academicYear?.display}</b>
                                                <Label circular color={"green"} empty />
                                                { !!academicYear.default && (<Icon name={"calendar check outline"} className={"margin-none-important"} />) }
                                            </span>
                                        ) : (
                                            <span className={"align-items-center"}>
                                                <span className={"margin-right-xs"}>{academicYear?.display}</span>
                                                { !!academicYear.default && (<Icon name={"calendar check outline"} className={"margin-none-important"} />) }
                                            </span>
                                        )}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    <Menu.Item onClick={logoutUser}>
                        {localStorage.getItem('username') + ' '}| {t('menu.Sair')}
                    </Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

export default HeaderMenu;
