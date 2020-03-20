import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe ('auth reducer', () => {
    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            localId: null,
            error: null,
            authenticating: false,
            authRedirectPath: '/'
        });
    });

    it('should store token on login', () => {
        expect(reducer({
            token: null,
            localId: null,
            error: null,
            authenticating: false,
            authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            token: 'some-token',
            localId: 'some-id'
        })).toEqual({
            token: 'some-token',
            localId: 'some-id',
            error: null,
            authenticating: false,
            authRedirectPath: '/'
        });
    });
});