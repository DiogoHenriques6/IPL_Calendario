import types from "./action-types";

export const loadInterruptions = () => ({
    type: types.LOAD_LIST,
});

export const loadInterruptionDetail = (payload) => ({
    type: types.LOAD_DETAIL,
    payload,
});

export const setInterruptions = (payload) => ({
    type: types.SET_LIST_LOADED,
    payload,
});

export const setLoadError = (payload) => ({
    type: types.SET_ERROR,
    payload,
});

export const deleteInterruption = (payload) => ({
    type: types.DELETE,
    payload,
});

export const setInterruptionDetail = (payload) => ({
    type: types.SET_DETAIL_LOADED,
    payload,
});

export const saveInterruption = (payload) => ({
    type: types.SAVE,
    payload,
});

export const setSaved = (payload) => ({
    type: types.SET_LOADED,
    payload,
});

export const clearInterruptionDetail = () => ({
    type: types.CLEAR_DETAIL,
    payload: {},
});
