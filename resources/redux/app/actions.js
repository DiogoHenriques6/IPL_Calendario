import types from "./action-types";

export const logout = (payload) => ({
    type: types.LOGOUT,
    payload,
});

export const setAcademicYear = (payload) => ({
    type: types.SET_ACADEMIC_YEAR,
    payload,
});

export const setCurrentGroup = (payload) => ({
    type: types.SET_CURRENT_GROUP,
    payload,
});

