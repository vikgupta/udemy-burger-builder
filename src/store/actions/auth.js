import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, localId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        localId: localId
    }
}

export const authFailure = (error) => {
    return {
        type: actionTypes.AUTH_FAILURE,
        error: error
    }
}

export const authLogout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    }
}

export const logoutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime: expirationTime
    }
}

export const auth = (email, pwd, isSignUp) => {
    return {
        type: actionTypes.AUTH_USER_INITIATE,
        email: email,
        pwd: pwd,
        isSignUp: isSignUp
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE
    }
}