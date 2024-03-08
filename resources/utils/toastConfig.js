const commonConfig = {
    pauseOnHover: false,
    autoClose: 3000,
    pauseOnFocusLoss: false,
};

export const successConfig = {
    ...commonConfig,
    type: 'success',
};

export const infoConfig = {
    ...commonConfig,
    type: 'info',
};

export const errorConfig = {
    ...commonConfig,
    type: 'error',
};
