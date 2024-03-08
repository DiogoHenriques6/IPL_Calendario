import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button, Dropdown, Icon, Tab, Table,
} from 'semantic-ui-react';

const cells = [
  {
    name: 'Descrição',
  },
];

const PermissoesGerais = () => {
  const [permissionsList, setPermissionsList] = useState([]);
  const [actionsList, setActionsList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [groupsPermissions, setGroupsPermissions] = useState([]);
  const [reloadList, setReloadList] = useState(false);

  const mapPermissions = (data) => data?.reduce((acc, curr) => {
    const foundPermission = acc.find(
      (existingPermission) => existingPermission.permission_id === curr.permission_id,

    );
    if (!foundPermission) {
      acc.push({
        permission_id: curr.permission_id,
        groups: [curr.group_id],
      });
    } else {
      foundPermission.groups.push(curr.group_id);
    }

    return acc;
  }, []);

  useEffect(() => {
    axios.get('/permission/general').then((response) => {
      setPermissionsList(response?.data?.permissions);
      setActionsList(response?.data?.actions);
      setGroupList(
        response?.data?.groups?.map((group) => ({
          key: group.id,
          text: group.description,
          value: group.id,
        })),
      );
      fetchGroupsPermissions();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reloadList) {
      fetchGroupsPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadList]);

  const fetchGroupsPermissions = () => {
    axios.get('/permission/general/groups').then((response) => {
      setReloadList(false);
      setGroupsPermissions(mapPermissions(response?.data?.data));
    });
  };

  const setPermissionToGroup = (permissionId, actionId, groupsAdded) => {
    const data = groupsAdded.map((group) => ({
      permission_id: permissionId,
      group_id: group,
      enabled: true,
    }));

    const groupsForPermissionAndAction = groupsPermissions.find(
      ({ permission_id }) => permission_id === permissionId,
    );

    if (groupsForPermissionAndAction) {
      groupsForPermissionAndAction.groups.forEach((groupId) => {
        if (!groupsAdded.includes(groupId)) {
          data.push({
            permission_id: permissionId,
            group_id: groupId,
            enabled: false,
          });
        }
      });
    }
    // axios.put("/permission", data).then((response) => setReloadList(true));
  };

  const giveThisActionToAllGroupsAndPermissions = (actionId) => {
    const data = [];
    groupList.forEach((group) => {
      permissionsList.forEach((permission) => {
        data.push({
          permission_id: permission.id,
          group_id: group.value,
          enabled: true,
        });
      });
    });

    axios.put('/permission', data).then(() => setReloadList(true));
  };

  return (
    <Tab.Pane>
      {false && (
        <Table fixed>
          <Table.Header>
            <Table.Row>
              {cells.map((cell, idx) => (
                <Table.HeaderCell key={idx}>
                  {cell.description}
                </Table.HeaderCell>
              ))}
              {actionsList.map((action, idx) => (
                <Table.HeaderCell textAlign="center" key={idx}>
                  {action.description}
                </Table.HeaderCell>
              ))}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Selecionar</Table.HeaderCell>
              {actionsList.map((action, idx) => (
                <Table.HeaderCell key={idx}>
                  <Button
                    icon
                    labelPosition="left"
                    onClick={() => giveThisActionToAllGroupsAndPermissions(
                      action.id,
                    )}
                  >
                    Todos
                    <Icon name="check" />
                  </Button>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {permissionsList.map((permission, idx_permission) => (
              <Table.Row key={idx_permission}>
                <Table.Cell key={idx_permission}>
                  {permission.description}
                </Table.Cell>
                {actionsList.map((action, idx_action) => (
                  <Table.Cell
                    key={`${idx_permission}_${idx_action}`}
                    style={{ overflow: 'visible' }}
                  >
                    <Dropdown
                      placeholder="Grupos"
                      fluid
                      multiple
                      selection
                      floating
                      options={groupList}
                      value={
                                                groupsPermissions.find(
                                                  (permissions) => permissions.permission_id
                                                            === permission.id,
                                                )?.groups || []
                                            }
                      onChange={(
                        event,
                        { value: groupsAdded },
                      ) => {
                        setPermissionToGroup(
                          permission.id,
                          action.id,
                          groupsAdded,
                        );
                      }}
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Tab.Pane>
  );
};

export default PermissoesGerais;
