import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import * as validators from './validators';
import responsiveBlockMaker from '../../../../../util/responsiveBlock';

export default function ({elq}) {

    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    function LoginComponent({size, state, authenticate, controller, registerSelected, hasError}) {
        const isSmall = size === 'small';
        const [isFetching, setIsFetching] = useState(false);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [emailErrors, setEmailErrors] = useState('');
        const [passwordErrors, setPasswordErrors] = useState('');
        const [validated, setValidated] = useState(false);
        const [serviceError, setServiceError] = useState(hasError);
        const refs = [];

        function validate() {
            const emailField = _.find(refs, (field) => field.name === 'emailField');
            const emailError = _.find(validators.emailValidators(),  (validator) => Boolean(!validator.validate(emailField.value)));
            setEmailErrors(emailError ? emailError.errorText : false);
            const passwordField = _.find(refs, (field) => field.name === 'passwordField');
            const passwordError = _.find(validators.passwordValidators(), (validator) => Boolean(!validator.validate(passwordField.value)));
            setPasswordErrors(passwordError ? passwordError.errorText : false);
            setValidated(true);
            return !emailError && !passwordError;
        }

        useEffect(function () {
            if (validated) {
                validate();
            }
        });

        function handleSubmit() {
            if (validate()) {
                setIsFetching(true);
                authenticate({
                    email,
                    password,
                    controller
                })
                    .finally(function () {
                        if (state.error) {
                            setServiceError(state.error);
                        }
                    });
            }
        }

        const inputStyle = {
            width: '100%',
            border: 'none',
            borderBottom: '1px solid black',
            display: 'inline-block',
            backgroundColor: 'transparent'

        };

        function ErrorPanel({serviceError}) {
            return (<div className="mt-3">
                {serviceError ? <div className="alert alert-danger mb-0" role="alert">
                    <strong>{'(' +serviceError.code + ') your request failed'}</strong>
                </div> : null}
            </div>);
        }

        return (
            <form className="needs-validation" noValidate>
                <div className={isSmall ? 'col-12' : 'col-8'} style={{margin: 'auto'}}>
                    <div className="card" style={{margin: 'auto'}}>
                        <div className="card-header">
                            <h1 className="card-title">Login</h1>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Email</label>
                                <input value={email}
                                       name='emailField'
                                       onChange={function (event) {
                                           setEmail(event.target.value);
                                       }}
                                       style={inputStyle}
                                       placeholder="Enter email"
                                       ref={(ref) => refs.push(ref)}/>
                                {emailErrors ?
                                    <div>
                                        <p style={{color: 'red'}}>{emailErrors}</p>
                                    </div> : null}
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input value={password}
                                       name='passwordField'
                                       onChange={function (event) {
                                           setPassword(event.target.value);
                                       }}
                                       style={inputStyle}
                                       type="password"
                                       placeholder="Password"
                                       autoComplete="on"
                                       ref={(ref) => refs.push(ref)}/>
                                {passwordErrors ?
                                    <div>
                                        <p style={{color: 'red'}}>{passwordErrors}</p>
                                    </div> : null}

                            </div>
                            <div style={{
                                flex: 'auto',
                                display: 'flex'
                            }}>
                                <button type="submit"
                                        className="btn btn-primary"
                                        onClick={function (event) {
                                            event.preventDefault();
                                            handleSubmit();
                                        }}>
                                    <span>
                                        Submit
                                        {isFetching ? '...' : null}
                                    </span>
                                </button>
                                <div style={{marginLeft: 'auto'}}>
                                    <div>
                                        <a onClick={function (e) {
                                            e.preventDefault();
                                            registerSelected();
                                        }}>Register</a>
                                    </div>
                                </div>
                            </div>
                            {serviceError ? <ErrorPanel serviceError={serviceError.code ? serviceError : {code: '500'}}/> : null}
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    return function (props) {
        const sizeBreakpoints = {
            small: 0,
            large: 700
        };

        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <LoginComponent {...props}/>
            </ResponsiveBlock>
        )
    }
}
