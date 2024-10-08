import React, {useState} from 'react';
import {Icon, Menu, Popup, Tab} from 'semantic-ui-react';
import {useTranslation} from "react-i18next";

import Methods from "./TabMethods";
import CurricularUnits from "./TabCurricularUnits";
import Logs from "./TabLogs";
import {useComponentIfAuthorized} from "../../../components/ShowComponentIfAuthorized";
import SCOPES from "../../../utils/scopesConstants";
import TabCourses from "./TabCourses";

const CourseTabs = ({ groupId, coursesCount }) => {
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
                        <Popup trigger={<Icon color='orange' name="warning sign" />} content={t('Falta adicionar os métodos deste grupo de unidades curriculares')} position='top center'/>
                    )}
                </Menu.Item>
            ),
            pane: { key: 'tab_methods',     content: <Methods groupId={groupId} warningsHandler={setHasWarningsMethods} /> }
        });

        panes.push({
            menuItem: (
                <Menu.Item key='tab_curricular_units'>
                    <Icon name="file alternate"/> { t("Unidade Curricular") }
                </Menu.Item>
            ),
            pane: { key: 'tab_curricular_units',    content: <CurricularUnits groupId={groupId}  /> }
        });
    }

    panes.push({
        menuItem: (<Menu.Item key='tab_header_courses'><Icon name="paste"/> { t("Cursos") }</Menu.Item>),
        pane: { key: 'tab_courses',        content: <TabCourses groupId={groupId} coursesCount={coursesCount} /> }
    });

    panes.push({
        menuItem: (<Menu.Item key='tab_header_logs'><Icon name="unordered list"/> { t("Logs") }</Menu.Item>),
        pane: { key: 'tab_logs',        content: <Logs groupId={groupId} /> }
    });

    return ( <Tab panes={panes} renderActiveOnly={false} /> );
};

export default CourseTabs;
