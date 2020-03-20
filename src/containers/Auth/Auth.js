import React, {Component} from 'react';
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

class Auth extends Component {
    state = {
        controls: {
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
        },
        isSignUp: true
    }

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onResetAuthRedirectPath();
        }
    }

    loginHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isSignUp: !prevState.isSignUp
            }
        })
    }

    inputChangedHandler = (event, inputIdentifier) => {
        let updatedFormElement = updateObject(this.state.controls[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.controls[inputIdentifier].validation),
            touched: true
        });

        const updatedControls = updateObject(this.state.controls, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for(let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }

        this.setState({
            controls: updatedControls,
            formIsValid: formIsValid
        });
    }

    render() {
        let formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = (
            <form onSubmit={this.loginHandler}>
                {formElementsArray.map(formElement => {
                    return <Input 
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                invalid={!formElement.config.valid}
                                shouldValidate={formElement.config.validation}
                                touched={formElement.config.touched}
                                changed={(event) => {this.inputChangedHandler(event, formElement.id)}} />;
                })}
                <Button buttonType="Success">{this.state.isSignUp ? 'Sign Up' : 'Login'}</Button>
            </form>
        );

        if(this.props.authenticating) {
            form = <Spinner />
        }

        let errorMessage = null;
        if(this.props.error) {
            errorMessage = <p style={{color: 'red'}}>{this.props.error.message}</p>
        }

        let authRedirect = null;
        if(this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <h4>Login Credentials</h4>
                {form}
                <Button buttonType="Danger" clicked={this.switchAuthModeHandler}>Switch Mode</Button>
            </div>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Auth, axios));