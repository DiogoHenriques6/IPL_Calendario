import types from "./action-types";

export const loadCourses = (payload) => ({
    type: types.LOAD_LIST,
    payload,
});

export const loadCourseDetail = (payload) => ({
    type: types.LOAD_DETAIL,
    payload,
});

export const setCourses = (payload) => ({
    type: types.SET_LIST_LOADED,
    payload,
});

export const setCourseDetail = (payload) => ({
    type: types.SET_DETAIL_LOADED,
    payload,
});

export const setCourseDetailLoadingError = (payload) => ({
    type: types.SET_ERROR,
    payload,
});
