import React from "react";
import {Container, Tab} from "semantic-ui-react";
import PermissoesGerais from "./partials/PermissoesGerais";
import PermissoesCalendario from "./partials/PermissoesCalendario";

const Permissions = () => {
    const panes = [
        {menuItem: "Permissões Gerais", render: () => <PermissoesGerais/>},
        {
            menuItem: "Permissões do Calendário",
            render: () => <PermissoesCalendario/>,
        },
    ];

    return (
        <Container>
            <Tab panes={panes} renderActiveOnly/>
        </Container>
    );
};

export default Permissions;
