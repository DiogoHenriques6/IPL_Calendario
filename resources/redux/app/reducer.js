import types from "./action-types";

const initialState = {
    academicYear: {},
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ACADEMIC_YEAR:
            return {
                ...state,
                academicYear: action.payload,
            };
        default:
            return {...state};
    }
};

export default appReducer;
