import types from "./action-types";

export const logout = (payload) => ({
    type: types.LOGOUT,
    payload,
});

export const setAcademicYear = (payload) => ({
    type: types.SET_ACADEMIC_YEAR,
    payload,
});
