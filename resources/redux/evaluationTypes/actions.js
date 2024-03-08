import types from "./action-types";

export const loadEvaluationTypes = () => ({
    type: types.LOAD_LIST,
});

export const loadEvaluationTypeDetail = (payload) => ({
    type: types.LOAD_DETAIL,
    payload,
});

export const setEvaluationTypes = (payload) => ({
    type: types.SET_LIST_LOADED,
    payload,
});

export const setLoadError = (payload) => ({
    type: types.SET_ERROR,
    payload,
});

export const deleteEvaluationType = (payload) => ({
    type: types.DELETE,
    payload,
});

export const setEvaluationTypeDetail = (payload) => ({
    type: types.SET_DETAIL_LOADED,
    payload,
});

export const saveEvaluationType = (payload) => ({
    type: types.SAVE,
    payload,
});

export const setSaved = (payload) => ({
    type: types.SET_LOADED,
    payload,
});

export const clearEvaluationTypeDetail = () => ({
    type: types.CLEAR_DETAIL,
    payload: {},
});
