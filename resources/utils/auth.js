export const hasValidAuthToken = () => {
  const authTokenExpiry = localStorage.getItem("access_token_expiry");
  const authToken = localStorage.getItem("accessToken");
  if (!authTokenExpiry || !authToken) return false;
  const currentTimestamp = Math.floor(new Date() / 1000);
  return authTokenExpiry > currentTimestamp;
};

export const hasValidRefreshToken = () => {
  const refreshTokenExpiry = localStorage.getItem("refresh_token_expiry");
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshTokenExpiry || !refreshToken) return false;
  const currentTimestamp = Math.floor(new Date() / 1000);
  return refreshTokenExpiry > currentTimestamp;
};

export const hasGroupPermission = (group) => {
    let groups = localStorage.getItem("groups").toLowerCase();
    groups = groups.split(",");
    if( groups && Array.isArray(groups) ){
        return groups.includes(group.toLowerCase());
    }
    return false;
}

export const getCalendarPhasePermissions = (calendarPhase) => {
    // filter permissions by phase of calendar
    const localPermissions = JSON.parse(localStorage.getItem('calendarPermissions'));
    let permissions = [];
    if( localPermissions && Array.isArray(localPermissions) ){
        permissions = localPermissions?.filter((item) => item.phases?.includes(calendarPhase)) || [];
    }
    return permissions;
}
