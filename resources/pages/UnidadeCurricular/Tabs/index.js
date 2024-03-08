import React, {useState} from 'react';
import {Icon, Menu, Popup, Tab} from 'semantic-ui-react';
import {useTranslation} from "react-i18next";

import Methods from "./TabMethods";
import Teachers from "./TabTeachers";
import Logs from "./TabLogs";
import {useComponentIfAuthorized} from "../../../components/ShowComponentIfAuthorized";
import SCOPES from "../../../utils/scopesConstants";

const CourseTabs = ({ unitId, hasGroup }) => {
    const { t } = useTranslation();
    const [hasWarningsMethods, setHasWarningsMethods] = useState(false);
    const [hasWarningsTeachers, setHasWarningsTeachers] = useState(false);

    let panes = [];

    if(useComponentIfAuthorized(SCOPES.MANAGE_EVALUATION_METHODS)){
        panes.push({
            menuItem: (
                <Menu.Item key='tab_header_methods'>
                    <Icon name="file alternate"/> { t("Métodos") }
                    {hasWarningsMethods && (
                        <Popup trigger={<Icon color='orange' name="warning sign" />} content={t('Falta adicionar os métodos desta unidade curricular')} position='top center'/>
                    )}
                </Menu.Item>
            ),
            pane: { key: 'tab_methods',     content: <Methods hasGroup={hasGroup} unitId={unitId} warningsHandler={setHasWarningsMethods} /> }
        });
    }
    panes.push({
        menuItem: (
            <Menu.Item key='tab_header_teachers'>
                <Icon name="users"/> { t("Professores") }
                { useComponentIfAuthorized(SCOPES.EDIT_COURSE_UNITS) && hasWarningsTeachers && (
                    <Popup trigger={<Icon color='orange' name="warning sign" />} content={t('Falta selecionar o responsável da unidade curricular')} position='top center'/>
                )}
            </Menu.Item>
        ),
        pane: { key: 'tab_teachers',    content: <Teachers unitId={unitId} warningsHandler={setHasWarningsTeachers} /> }
    });
    if(useComponentIfAuthorized(SCOPES.EDIT_COURSE_UNITS)) {
        panes.push({
            menuItem: (<Menu.Item key='tab_header_logs'><Icon name="unordered list"/> {t("Logs")}</Menu.Item>),
            pane: {key: 'tab_logs', content: <Logs unitId={unitId}/>}
        });
    }
    return ( <Tab panes={panes} renderActiveOnly={false} /> );
};

export default CourseTabs;
