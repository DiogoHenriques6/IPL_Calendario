import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button, Card, Dropdown, Icon, List, Segment, Tab,
} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { errorConfig, successConfig } from '../../../utils/toastConfig';

const PermissoesGerais = () => {
  const [groups, setGroups] = useState([]);
  const [permissionsWithGroups, setPermissionsWithGroups] = useState([]);
  const [savingPermissions, setSavingPermissions] = useState([]);
  const [removingGroups, setRemovingGroups] = useState([]);

  const updateGroupPermissions = (added, permissionId, groupId) => axios.put('/permission', {
    permission_id: permissionId,
    group_id: groupId,
    enabled: added,
  });

  useEffect(() => {
    axios.get('/permission/general').then((res) => {
      const perms = res?.data?.permissions || [];
      const groupList = res?.data?.groups || [];
      setGroups(groupList);

      const permWithGroups = perms.map((permission) => {
        const filteredGroupsWithPermission = groupList.filter(
          (x) => x.permissions.find((y) => y.id === permission.id),
        );
        if (!permission.groups) {
          permission.groups = [];
        }
        if (filteredGroupsWithPermission?.length > 0) {
          permission.groups.push(...filteredGroupsWithPermission);
        }
        return permission;
      });
      setPermissionsWithGroups(permWithGroups);
    });
  }, []);

  const addGroupToPermission = (newGroupId, permissionId) => {
    setSavingPermissions((current) => [...current, { permissionId, groupId: newGroupId }]);
    const copy = [...permissionsWithGroups];

    copy.find(
      (x) => x.id === permissionId,
    ).groups.push(groups.find((x) => x.id === newGroupId));

    setPermissionsWithGroups(copy);
    updateGroupPermissions(true, permissionId, newGroupId).then((res) => {
      if (res.status >= 200 && res.status <= 300) {
        toast('Permissão adicionada ao grupo com sucesso!', successConfig);
        setSavingPermissions((current) => [
          ...current.filter((x) => x.permissionId !== permissionId && x.groupId !== newGroupId),
        ]);
      } else {
        toast('Erro ao adicionar a permissão ao grupo!', errorConfig);
      }
    });
  };

  const removePermissionOfGroup = (index, permissionId, groupId) => {
    setRemovingGroups((current) => [...current, { permissionId, index }]);
    const copy = [...permissionsWithGroups];
    updateGroupPermissions(
      false,
      permissionId,
      groupId,
    ).then((res) => {
      if (res.status >= 200 && res.status <= 300) {
        toast('Permissão removida ao grupo com sucesso!', successConfig);
        setRemovingGroups((current) => [
          ...current.filter((x) => x.permissionId !== permissionId && x.index !== index),
        ]);

        const groupsOfPermission = copy.find(
          (x) => x.id === permissionId,
        );

        groupsOfPermission
          .groups.splice(groupsOfPermission.groups.map((x) => x.id).indexOf(groupId), 1);
        setPermissionsWithGroups(copy);
      } else {
        toast('Erro ao remover a permissão ao grupo!', errorConfig);
      }
    });
  };

  return (
    <Tab.Pane>
      <Card.Group itemsPerRow="4">
        {permissionsWithGroups.map((perm) => (
          <Card>
            <Card.Content header={perm.description} />
            <Card.Content>
              Grupos:
              <Dropdown
                renderLabel="Selecione um grupo"
                fluid
                search
                options={
                  groups.filter((grp) => !perm.groups?.includes(grp))
                    .map(({ id, description }) => ({ key: id, value: id, text: description }))
                }
                selection
                onChange={(evt, { value: newGroup }) => addGroupToPermission(newGroup, perm.id)}
              />
              <Segment style={{ width: '100%' }}>
                <List divided verticalAlign="middle">
                  {perm.groups.length === 0 && 'Nenhum grupo adicionado!'}
                  {perm.groups.map((group, index) => (
                    <List.Item key={index}>
                      <List.Content floated="right">
                        <Button
                          color={
                            savingPermissions.find(
                              (x) => x.permissionId === perm.id && x.groupId === group.id,
                            ) ? 'green' : 'red'
                          }
                          icon
                          onClick={() => removePermissionOfGroup(index, perm.id, group.id)}
                          loading={
                            savingPermissions.find(
                              (x) => x.permissionId === perm.id && x.groupId === group.id,
                            )
                            || removingGroups.find(
                              (x) => x.permissionId === perm.id && x.index === index,
                            )
                          }
                        >
                          <Icon name="trash" />
                        </Button>
                      </List.Content>
                      <List.Content>
                        {group.description}
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </Segment>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>

    </Tab.Pane>
  );
};

export default PermissoesGerais;
