import types from "./action-types";

export const loadLanguages = () => ({
    type: types.LOAD_LIST,
});

export const loadLanguage = (payload) => ({
    type: types.LOAD_DETAIL,
    payload,
});

export const setLanguages = (payload) => ({
    type: types.SET_LIST_LOADED,
    payload,
});

export const setLoadError = (payload) => ({
    type: types.SET_ERROR,
    payload,
});

export const deleteLanguage = (payload) => ({
    type: types.DELETE,
    payload,
});

export const setLanguageDetail = (payload) => ({
    type: types.SET_DETAIL_LOADED,
    payload,
});

export const saveLanguage = (payload) => ({
    type: types.SAVE,
    payload,
});

export const setSaved = (payload) => ({
    type: types.SET_LOADED,
    payload,
});

export const clearLanguageDetail = () => ({
    type: types.CLEAR_DETAIL,
    payload: {},
});
