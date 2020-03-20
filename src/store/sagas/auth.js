import {delay} from 'redux-saga/effects';
import {put, call} from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

export function* logoutSaga (action) {
    yield call([localStorage, "removeItem"], "token");  // call helps in unit testing
    yield call([localStorage, "removeItem"], "expirationTime");
    yield call([localStorage, "removeItem"], "localId");
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.authLogout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.pwd,
        returnSecureToken: true
    };
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAHh-3mabBiFxF75vCfvIXXRF5j1dxBei8';
    if(!action.isSignUp) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAHh-3mabBiFxF75vCfvIXXRF5j1dxBei8';
    }

    try {
        const response = yield axios.post( url, authData);
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('localId', response.data.localId);
        const expirationTime = new Date(new Date().getTime() + (response.data.expiresIn*1000));
        yield localStorage.setItem('expirationTime', expirationTime);
        yield put(actions.authSuccess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch(error) {
        yield put(actions.authFailure(error.response.data.error));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if(!token) {
        yield put(actions.authLogout());
    } else {
        const expiration = yield localStorage.getItem('expirationTime');
        const expirationTime = new Date(expiration);
        const currentTime = new Date();
        if(currentTime.getTime() >= expirationTime.getTime()) {
            yield put(actions.authLogout());
        } else {
            const id = yield localStorage.getItem('localId');
            yield put(actions.authSuccess(token, id));
            yield put(actions.checkAuthTimeout((expirationTime.getTime() - currentTime.getTime()) / 1000));
        }
    }
}