import types from "./action-types";

const initialState = {
    detail: {},
    list: [],
    loading: false,
    error: undefined,
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LIST: {
            return {
                ...state,
                loading: true,
            };
        }
        case types.LOAD_DETAIL: {
            return {
                ...state,
                loading: true,
            };
        }
        case types.SET_LIST_LOADED: {
            return {
                ...state,
                loading: false,
                error: undefined,
                list: action.payload,
            };
        }
        case types.CLEAR_DETAIL:
        case types.SET_DETAIL_LOADED: {
            return {
                ...state,
                loading: false,
                error: undefined,
                detail: action.payload,
            };
        }
        case types.SET_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        }
        case types.SAVE: {
            return {
                ...state,
                loading: true,
            };
        }
        case types.SET_LOADED: {
            return {
                ...state,
                loading: false,
            };
        }
        default:
            return {...state};
    }
};

export default appReducer;
