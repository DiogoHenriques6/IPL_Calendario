import React from 'react';
import {Icon, Menu, Tab} from 'semantic-ui-react';

import Branches from "./TabBranches";
import Students from "./TabStudents";
import CurricularUnits from "./TabCurricularUnits";
import {useTranslation} from "react-i18next";

const CourseTabs = ({ courseId }) => {
    const { t } = useTranslation();
    const panes = [
        { menuItem: (<Menu.Item key='tab_header_units'><Icon name="book"/> { t("Unidades Curriculares") }</Menu.Item>), pane: { key: 'tab_units',       content: <CurricularUnits courseId={courseId} /> } },
        { menuItem: (<Menu.Item key='tab_header_branches'><Icon name="code branch"/> { t("Ramos") }</Menu.Item>),       pane: { key: 'tab_branches',    content: <Branches courseId={courseId}/> } },
        { menuItem: (<Menu.Item key='tab_header_students'><Icon name="user"/> { t("Estudantes") }</Menu.Item>),         pane: { key: 'tab_students',    content: <Students courseId={courseId}/> } },
    ]
    return ( <Tab panes={panes} renderActiveOnly={false} /> );
};

export default CourseTabs;
