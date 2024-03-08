const baseType = 'CALENDAR';

const types = {
    LOAD_DETAIL: `${baseType}/LOAD_DETAIL`,
    LOAD_LIST: `${baseType}/LOAD_LIST`,
    SET_LOADED: `${baseType}/SET_LOADED`,
    SET_ERROR: `${baseType}/SET_ERROR`,
    SET_LIST_LOADED: `${baseType}/SET_LIST_LOADED`,
    SET_DETAIL_LOADED: `${baseType}/SET_DETAIL_LOADED`,
    CREATE: `${baseType}/CREATE`,
    LOAD_PHASES: `${baseType}/LOAD_PHASES`,
    SAVE_PHASE_LIST: `${baseType}/SAVE_PHASE_LIST`,
    DELETE_PHASE: `${baseType}/DELETE_PHASE`,
    LOAD_PHASE_DETAIL: `${baseType}/LOAD_PHASE_DETAIL`,
    CLEAR_PHASE_DETAIL: `${baseType}/CLEAR_PHASE_DETAIL`,
    SAVE_PHASE: `${baseType}/SAVE_PHASE`,
    SET_PHASE_DETAIL_LOADED: `${baseType}/SET_PHASE_DETAIL_LOADED`,
};

export default types;
