import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
    token: null,
    localId: null,
    error: null,
    authenticating: false,
    authRedirectPath: '/'
}

const authStart = (state, action) => {
    return updateObject(state, {
        authenticating: true,
        error: null,
        token: null,
        localId: null,
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        localId: action.localId,
        authenticating: false,
        error: null
    });
}

const authFailure = (state, action) => {
    return updateObject(state, {
        error: action.error,
        authenticating: false,
        token: null,
        localId: null,
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        localId: null
    });
}

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, {
        authRedirectPath: action.path
    });
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case (actionTypes.AUTH_START):
            return authStart(state, action);

        case (actionTypes.AUTH_SUCCESS):
            return authSuccess(state, action);

        case (actionTypes.AUTH_FAILURE):
            return authFailure(state, action);

        case (actionTypes.AUTH_LOGOUT):
            return authLogout(state, action);

        case (actionTypes.SET_AUTH_REDIRECT_PATH):
            return setAuthRedirectPath(state, action);

        default:
            return state;
    }
}

export default reducer;