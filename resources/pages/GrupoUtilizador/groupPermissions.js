import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Header, Grid, Checkbox, Tab, Loader, Dimmer} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

import { errorConfig, successConfig } from '../../utils/toastConfig';

const GroupPermissions = () => {
    const { t } = useTranslation();
    // get URL params
    let { id } = useParams();
    let paramsId = id;

    const [state, setState] = useState({
        loadingCalendarPermissions: true,
        loadingGenericPermissions: true,
        groupPermissions: [],
        calendarGroupPermissions: [],
    });


    useEffect(() => {
        axios.get('/user-group/' + paramsId + '/permissions').then((res) => {
            let permissionSections = res.data.data || [];
            setState( prevState => ({
                loadingGenericPermissions: false,
                calendarGroupPermissions: prevState.calendarGroupPermissions,
                groupPermissions: permissionSections
            }));
        });

        axios.get('/user-group/' + paramsId + '/calendar-permissions').then((res) => {
            let permissionPhases = res.data.data || [];
            setState( prevState => ({
                loadingCalendarPermissions: false,
                groupPermissions: prevState.groupPermissions,
                calendarGroupPermissions: permissionPhases
            }));
        });
    }, []);

    const updateGroupPermissions = (isEnabled, permissionId, phaseId) => {
        const request = {
            permission_id: permissionId,
            group_id: paramsId,
            phase_id: phaseId,
            enabled: isEnabled
        };
        axios.put('/permission', request).then(response =>{
            if (response.status === 200 || response.status === 201) {
                toast(t('Permissao atualizada com sucesso'), successConfig);
            } else {
                toast(t('Existiu um problema ao gravar as alterações!'), errorConfig);
            }
        });
    };

    const panes = [
        {menuItem: t("Permissões Gerais"), render: () => (
            <Tab.Pane loading={state.loadingGenericPermissions}>
                <div className='padding-s-base'>
                    <Grid columns={3} >
                        <Grid.Row>
                            { state.groupPermissions.map( (section, index) => (
                                <Grid.Column key={index}>
                                    <div className='section'>
                                        <div className='section-title'>
                                            {section.label}
                                        </div>
                                        <div className='section-content'>
                                            {section.permissions.map((permission, indexP) => (
                                                <div className='margin-top-base' key={indexP}>
                                                    <Checkbox toggle label={permission.description} defaultChecked={permission.isActive}
                                                              onChange={ (e, data) => {updateGroupPermissions(data.checked, permission.permission_id, null); permission.isActive = data.checked;}} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid>
                </div>
            </Tab.Pane>
        )},
        {
            menuItem: t("Permissões do Calendário"), render: () => (
                <Tab.Pane loading={state.loadingCalendarPermissions}>
                    <div className='padding-s-base'>
                        { state.calendarGroupPermissions.map( (phase, phaseIndex) => (
                            <div className='section sticky--section' key={phaseIndex}>
                                <div className='section-title'>
                                    <Header as='h3'>{phase.label}</Header>
                                </div>
                                <div className='section-content'>
                                    <Grid columns={3} >
                                        <Grid.Row>
                                            { phase.sections.map( (section, sectionIndex) => (
                                                <Grid.Column key={sectionIndex}>
                                                    <div className='section'>
                                                        <div className='section-title'>{section.label}</div>
                                                        <div className='section-content'>
                                                            { section.permissions.map( (perm, permIndex) => (
                                                                <div className='margin-top-base' key={permIndex}>
                                                                    <Checkbox toggle label={perm.description} defaultChecked={perm.isActive}
                                                                              onChange={ (e, data) => { updateGroupPermissions(data.checked, perm.permission_id, phase.phase_id); perm.isActive = data.checked}} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Grid.Column>
                                            ))}
                                        </Grid.Row>
                                    </Grid>
                                </div>
                            </div>
                        ))}
                    </div>
                </Tab.Pane>
            ),
        },
    ];

    return (
        <>
            { state.groupPermissions.length > 0 ? (
                <div className='margin-top-l'>
                    <Tab panes={panes} renderActiveOnly/>
                </div>
            ) : (
                <div className='margin-top-l'>
                    <Dimmer active inverted>
                        <Loader indeterminate>{t("A carregar Permissoes")}</Loader>
                    </Dimmer>
                </div>
            )}
        </>
    );
};

export default GroupPermissions;
