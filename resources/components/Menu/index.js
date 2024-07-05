import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {Container, Menu, Dropdown, Icon, Label} from 'semantic-ui-react';
import axios from 'axios';
import {useTranslation} from "react-i18next";
import {logout, setAcademicYear, setCurrentGroup} from '../../redux/app/actions';
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
import {toast} from "react-toastify";

const HeaderMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [academicYearsList, setAcademicYearsList] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const isDisabled = academicYearsList.length === 0;


    useEffect(() => {
        //TODO join both api calls into one (less time loading)
            axios.get('user-group/menu').then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    setUserGroups(response?.data?.data ? response?.data?.data : response?.data);
                    if(!localStorage.getItem('selectedGroup')){
                        if(response?.data?.data?.value){
                            // console.log(response.data.data)
                            setSelectedGroup(response?.data )
                            localStorage.setItem('selectedGroup',
                                [response?.data?.data?.key,
                                    response?.data?.data?.text,
                                    response?.data?.data?.value]);
                        }
                        else{
                            setSelectedGroup(response?.data?.data[0])
                            localStorage.setItem('selectedGroup',
                                [response?.data?.data[0].key,
                                    response?.data?.data[0].text,
                                    response?.data?.data[0].value]);
                        }
                    }
                    else{
                        var selectedGroupString = localStorage.getItem('selectedGroup').split(',');
                        setSelectedGroup({
                            key: parseInt(selectedGroupString[0].trim()),
                            text: selectedGroupString[1].trim(),
                            value: selectedGroupString[2].trim()
                        });
                    }
                }
            });

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
            localStorage.removeItem('selectedGroup');
            localStorage.removeItem('courseUnits');
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
    //TODO if we change it on a page that the new group has no permissions it returns the webpage no permissions
    // LOCALSTORAGE not updating correctly... check why fix it
    const switchSelectedGroup = (group) => {
        axios.post('user-group/switch', {
            switch: group.key,
        })
            .then((res) => {
                setSelectedGroup(group);
                localStorage.setItem('selectedGroup', [group.key, group.text, group.value])
                localStorage.setItem('scopes', JSON.stringify(res.data));
                localStorage.removeItem('calendarPermissions');
                dispatch(setCurrentGroup(group));
                window.location.reload();
            })
    };

    const handleClick = (e) => {
        if (academicYearsList.length === 0) {
            e.preventDefault();
        }
    };


    const selectedAcademicYear = useSelector((state) => state.app.academicYear);

    return (
        <Menu borderless >
            <Container>
                <Menu.Item as={Link} to="/"
                           className={ (location.pathname.includes('/calendario') || location.pathname === '/') ? 'active' : ''}>
                    {t('menu.Calendários') }
                </Menu.Item>
                <ShowComponentIfAuthorized permission={[COURSE_UNIT_SCOPES[0]]}>
                    <Menu.Item as={Link}
                               to="/unidade-curricular"
                               onClick={handleClick}
                               className={`${isDisabled ? 'disabled' : ''} ${location.pathname.includes('/unidade-curricular') ? 'active' : ''} item`}
                    >
                        {t('menu.Unidades Curriculares')}
                    </Menu.Item>
                </ShowComponentIfAuthorized>
                <ShowComponentIfAuthorized permission={[UC_GROUPS_SCOPES[0]]}>
                    <Menu.Item as={Link}
                               to="/agrupamento-unidade-curricular"
                               onClick={handleClick}
                               className={`${isDisabled ? 'disabled' : ''} ${location.pathname.includes('/agrupamento-unidade-curricular') ? 'active' : ''} item`}
                       >
                            {t('menu.UCs Agrupadas')}
                    </Menu.Item>
                </ShowComponentIfAuthorized>
                <ShowComponentIfAuthorized permission={[COURSE_SCOPES[0]]}>
                    <Menu.Item
                        as={Link}
                        to="/curso"
                        onClick={handleClick}
                        className={`${isDisabled ? 'disabled' : ''} ${location.pathname.includes('/curso') ? 'active' : ''} item`}
                    >
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
                                <Dropdown.Item disabled={academicYearsList.length === 0}
                                               as={Link} to="/tipo-interrupcao">{t('menu.Tipos Interrupções')}</Dropdown.Item>
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
                    {userGroups?.length === 1 && (
                        // <Menu.Item>{userGroups[0].text}</Menu.Item>
                        <></>
                    )}
                    {userGroups?.length > 1 && (
                        <Dropdown item text={selectedGroup?.text}>
                            <Dropdown.Menu>
                                {userGroups?.map((group) => (
                                    <Dropdown.Item key={group?.key} onClick={()=>{switchSelectedGroup(group)}}>
                                        {selectedGroup && group.key === selectedGroup.key ? (
                                            <span className={"align-items-center"}>
                                                <b className={"margin-right-xs"}>{group?.text}</b>
                                                <Label circular color={"green"} empty />
                                            </span>
                                        ) : (
                                            <span className={"align-items-center"}>
                                                <span className={"margin-right-xs"}>{group?.text}</span>
                                            </span>
                                        )}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

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
