import PropTypes from 'prop-types';

export const useComponentIfAuthorized = (permission, returnIndividual = false) => {
    const userScopes = JSON.parse(localStorage.getItem('scopes'));
    if(userScopes){
        if (Array.isArray(permission)) {
            if (returnIndividual) {
                return permission.reduce((acc, curr) => {
                    acc[curr.toUpperCase()] = userScopes.includes(curr);
                    return acc;
                }, {});
            }
            if (permission.some((per) => userScopes.includes(per))) {
                return true;
            }
        } else {
            return userScopes.includes(permission);
        }
    }
    return false;
};

const ShowComponentIfAuthorized = ({ permission, children, renderIfNotAllowed, toDebug, forceRender }) => {
    let isAuthorized = false;
    if (toDebug) {
        debugger;
    }
    isAuthorized = useComponentIfAuthorized(permission);

    if (forceRender || isAuthorized) {
        return children;
    }
    if(typeof renderIfNotAllowed === 'function') {
        return renderIfNotAllowed();
    }
    if (typeof renderIfNotAllowed === 'object') {
        return renderIfNotAllowed;
    }
    return null;
};

ShowComponentIfAuthorized.defaultProps = {
    permission: undefined,
};

ShowComponentIfAuthorized.propTypes = {
    permission: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
};

export default ShowComponentIfAuthorized;
