import types from "./action-types";

export const createCalendar = (payload) => ({
    type: types.CREATE,
    payload,
});

export const loadPhases = (payload) => ({
    type: types.LOAD_PHASES,
    payload,
});

export const savePhaseList = (payload) => ({
    type: types.SAVE_PHASE_LIST,
    payload,
});

export const deletePhase = (payload) => ({
    type: types.DELETE_PHASE,
    payload,
});

export const setPhaseDetail = (payload) => ({
    type: types.SET_PHASE_DETAIL_LOADED,
    payload,
});

export const savePhase = (payload) => ({
    type: types.SAVE_PHASE,
    payload,
});

export const setSaved = (payload) => ({
    type: types.SET_LOADED,
    payload,
});

export const clearPhaseDetail = () => ({
    type: types.CLEAR_PHASE_DETAIL,
    payload: {},
});

export const loadPhase = (payload) => ({
    type: types.LOAD_PHASE_DETAIL,
    payload,
});
