const SCOPES = {
    CREATE_CALENDAR: 'create_calendar',
    DELETE_CALENDAR: 'delete_calendar',
    VIEW_CALENDAR_INFO: 'view_calendar_info',
    VIEW_COMMENTS: 'view_comments',
    VIEW_CALENDAR_HISTORY: 'view_calendar_history',
    VIEW_ACTUAL_PHASE: 'view_actual_phase',

    PUBLISH_CALENDAR: 'publish_calendar',
    CREATE_COPY: 'create_copy',

    VIEW_COURSE_UNITS: 'view_course_units',
    CREATE_COURSE_UNITS: 'create_course_units',
    EDIT_COURSE_UNITS: 'edit_course_units',
    DELETE_COURSE_UNITS: 'delete_course_units',
    MANAGE_EVALUATION_METHODS: 'manage_evaluation_methods',

    VIEW_UC_GROUPS: 'view_uc_groups',
    CREATE_UC_GROUPS: 'create_uc_groups',
    EDIT_UC_GROUPS: 'edit_uc_groups',
    DELETE_UC_GROUPS: 'delete_uc_groups',

    EDIT_USER_GROUPS: 'edit_user_groups',
    DELETE_USER_GROUPS: 'delete_user_groups',
    CREATE_USER_GROUPS: 'create_user_groups',

    EDIT_USERS: 'edit_users',
    LOCK_USERS: 'lock_users',

    CREATE_EVALUATION_TYPES: 'create_evaluation_types',
    EDIT_EVALUATION_TYPES: 'edit_evaluation_types',
    DELETE_EVALUATION_TYPES: 'delete_evaluation_types',

    CREATE_INTERRUPTION_TYPES: 'create_interruption_types',
    EDIT_INTERRUPTION_TYPES: 'edit_interruption_types',
    DELETE_INTERRUPTION_TYPES: 'delete_interruption_types',

    CREATE_CALENDAR_PHASES: 'create_calendar_phases',
    EDIT_CALENDAR_PHASES: 'edit_calendar_phases',
    DELETE_CALENDAR_PHASES: 'delete_calendar_phases',

    CREATE_SCHOOLS: 'create_schools',
    EDIT_SCHOOLS: 'edit_schools',

    CREATE_ACADEMIC_YEARS: 'create_academic_years',
    EDIT_ACADEMIC_YEARS: 'edit_academic_years',
    DELETE_ACADEMIC_YEARS: 'delete_academic_years',

    CHANGE_PERMISSIONS: 'change_permissions',
    DEFINE_COURSE_COORDINATOR: 'define_course_coordinator',
    DEFINE_COURSE_UNIT_RESPONSIBLE: 'define_course_unit_responsible',
    DEFINE_COURSE_UNIT_TEACHERS: 'define_course_unit_teachers',

    VIEW_COURSES: 'view_courses',
    CREATE_COURSES: 'create_courses',
    EDIT_COURSES: 'edit_courses',
    DELETE_COURSES: 'delete_courses',

    ADD_COMMENTS: 'add_comments',
    IGNORE_COMMENTS: 'ignore_comments',
    VIEW_CALENDAR: 'view_calendar',
    CHANGE_CALENDAR_PHASE: 'change_calendar_phase',
    ADD_EXAMS: 'add_exams',
    EDIT_EXAMS: 'edit_exams',
    REMOVE_EXAMS: 'remove_exams',
    ADD_INTERRUPTION: 'add_interruption',
    EDIT_INTERRUPTION: 'edit_interruption',
    REMOVE_INTERRUPTION: 'remove_interruption',
};

export const COURSE_UNIT_SCOPES = [
    SCOPES.VIEW_COURSE_UNITS,
    SCOPES.CREATE_COURSE_UNITS,
    SCOPES.EDIT_COURSE_UNITS,
    SCOPES.DELETE_COURSE_UNITS,
];

export const UC_GROUPS_SCOPES = [
    SCOPES.VIEW_UC_GROUPS,
    SCOPES.CREATE_UC_GROUPS,
    SCOPES.EDIT_UC_GROUPS,
    SCOPES.DELETE_UC_GROUPS,
];

export const COURSE_SCOPES = [
    SCOPES.VIEW_COURSES,
    SCOPES.CREATE_COURSES,
    SCOPES.EDIT_COURSES,
    SCOPES.DELETE_COURSES,
];

export const ACADEMIC_YEAR_SCOPES = [
    SCOPES.CREATE_ACADEMIC_YEARS,
    SCOPES.EDIT_ACADEMIC_YEARS,
    SCOPES.DELETE_ACADEMIC_YEARS,
];

export const SCHOOLS_SCOPES = [
    SCOPES.CREATE_SCHOOLS,
    SCOPES.EDIT_SCHOOLS,
];

export const USER_GROUPS_SCOPES = [
    SCOPES.EDIT_USER_GROUPS,
    SCOPES.CREATE_USER_GROUPS,
    SCOPES.DELETE_USER_GROUPS,
];

export const CALENDAR_PHASES_SCOPES = [
    SCOPES.CREATE_CALENDAR_PHASES,
    SCOPES.EDIT_CALENDAR_PHASES,
    SCOPES.DELETE_CALENDAR_PHASES,
];

export const INTERRUPTION_TYPES_SCOPES = [
    SCOPES.CREATE_INTERRUPTION_TYPES,
    SCOPES.EDIT_INTERRUPTION_TYPES,
    SCOPES.DELETE_INTERRUPTION_TYPES,
];

export const EVALUATION_TYPE_SCOPES = [
    SCOPES.CREATE_EVALUATION_TYPES,
    SCOPES.EDIT_EVALUATION_TYPES,
    SCOPES.DELETE_EVALUATION_TYPES,
];

export const USER_SCOPES = [
    SCOPES.EDIT_USERS,
    SCOPES.LOCK_USERS,
];

export const CONFIG_SCOPES = [
    ...ACADEMIC_YEAR_SCOPES,
    ...SCHOOLS_SCOPES,
    ...CALENDAR_PHASES_SCOPES,
    ...INTERRUPTION_TYPES_SCOPES,
    ...EVALUATION_TYPE_SCOPES,
    ...USER_GROUPS_SCOPES,
    ...USER_SCOPES,
];

export default SCOPES;
