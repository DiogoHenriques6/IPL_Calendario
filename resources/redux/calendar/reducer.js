import types from "./action-types";

const initialState = {
    detail: {},
    list: [],
    loading: false,
    error: undefined,
    phaseList: [],
    phaseDetail: {},
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_LIST:
        case types.LOAD_PHASES:
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
        case types.SAVE_PHASE_LIST: {
            return {...state, loading: false, phaseList: action.payload};
        }
        case types.SET_PHASE_DETAIL_LOADED: {
            return {
                ...state,
                loading: false,
                phaseDetail: action.payload,
            };
        }
        default:
            return {...state};
    }
};

export default appReducer;
