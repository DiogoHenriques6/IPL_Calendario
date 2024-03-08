import types from "./action-types";

export const loadUserGroups = () => ({
    type: types.LOAD_LIST,
});

export const loadUserGroupDetail = (payload) => ({
    type: types.LOAD_DETAIL,
    payload,
});

export const setUserGroups = (payload) => ({
    type: types.SET_LIST_LOADED,
    payload,
});

export const setLoadError = (payload) => ({
    type: types.SET_ERROR,
    payload,
});

export const deleteUserGroup = (payload) => ({
    type: types.DELETE,
    payload,
});

export const setUserGroupDetail = (payload) => ({
    type: types.SET_DETAIL_LOADED,
    payload,
});

export const saveUserGroup = (payload) => ({
    type: types.SAVE,
    payload,
});

export const setSaved = (payload) => ({
    type: types.SET_LOADED,
    payload,
});

export const clearUserGroupDetail = () => ({
    type: types.CLEAR_DETAIL,
    payload: {},
});
