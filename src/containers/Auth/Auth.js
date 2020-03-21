import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import axios from '../../axios-orders';
import {connect} from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionCreators from '../../store/actions/index';
import {updateObject, checkValidity} from '../../shared/utility';

import classes from './Auth.css';

const auth = props => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });

    const {onResetAuthRedirectPath, buildingBurger, authRedirectPath} = props;

    useEffect(() => {
        if(!buildingBurger && authRedirectPath !== '/') {
            onResetAuthRedirectPath();
        }
    }, [onResetAuthRedirectPath, buildingBurger, authRedirectPath]);

    const loginHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value, controls.password.value, isSignUp);
    }

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    }

    const inputChangedHandler = (event, inputIdentifier) => {
        let updatedFormElement = updateObject(controls[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, controls[inputIdentifier].validation),
            touched: true
        });

        const updatedControls = updateObject(controls, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for(let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }

        setControls(updatedControls);
    }

    let formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        });
    }

    let form = (
        <form onSubmit={loginHandler}>
            {formElementsArray.map(formElement => {
                return <Input 
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => {inputChangedHandler(event, formElement.id)}} />;
            })}
            <Button buttonType="Success">{isSignUp ? 'Sign Up' : 'Login'}</Button>
        </form>
    );

    if(props.authenticating) {
        form = <Spinner />
    }

    let errorMessage = null;
    if(props.error) {
        errorMessage = <p style={{color: 'red'}}>{props.error.message}</p>
    }

    let authRedirect = null;
    if(props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <h4>Login Credentials</h4>
            {form}
            <Button buttonType="Danger" clicked={switchAuthModeHandler}>Switch Mode</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        authenticating: state.auth.authenticating,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, pwd, isSignUp) => dispatch(actionCreators.auth(email, pwd, isSignUp)),
        onResetAuthRedirectPath: () => dispatch(actionCreators.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(auth, axios));