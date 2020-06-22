import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import * as validators from './validators';
import responsiveBlockMaker from '../../../../../util/responsiveBlock';

export default function ({elq}) {

    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    function RegisterComponent({size, goToLogin}) {
        const isSmall = size === 'small';
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [passwordRepeat, setPasswordRepeat] = useState('');
        const [emailErrors, setEmailErrors] = useState('');
        const [passwordErrors, setPasswordErrors] = useState('');
        const [passwordRepeatErrors, setPasswordRepeatErrors] = useState('');
        const [validated, setValidated] = useState(false);
        const refs = [];

        function getField(fieldName) {
            return _.find(refs, (field) => field.name === fieldName);
        }

        function validate() {
            const emailField = getField('emailField');
            const emailError = _.find(validators.emailValidators(),  (validator) => Boolean(!validator.validate(emailField.value)));
            setEmailErrors(emailError ? emailError.errorText : false);

            const passwordField = getField('passwordField');
            const passwordError = _.find(validators.passwordValidators(), (validator) => Boolean(!validator.validate(passwordField.value)));
            setPasswordErrors(passwordError ? passwordError.errorText : false);

            const passwordRepeatField = getField('passwordRepeatField');
            const passwordRepeatError = _.find(validators.passwordRepeatValidators(passwordField.value), (validator) => Boolean(!validator.validate(passwordRepeatField.value)));
            setPasswordRepeatErrors(passwordRepeatError ? passwordRepeatError.errorText : false);
            setValidated(true);
            return !emailError && !passwordError && !passwordRepeatError;
        }

        useEffect(function () {
            if (validated) {
                validate();
            }
        });

        function handleSubmit() {
            if (validate()) {
                history.push('/about');
            }
        }

        const inputStyle = {
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid black',
            display: 'inline-block'
        };

        return (
            <form onSubmit={function () {
                handleSubmit();
            }} className="needs-validation" noValidate>
                <div className={isSmall ? 'col-12' : 'col-8'} style={{
                    margin: 'auto',
                }}>
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">Register</h1>
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
                                       type="password"
                                       style={inputStyle}
                                       placeholder="Password"
                                       ref={(ref) => refs.push(ref)}/>
                                {passwordErrors ?
                                    <div>
                                        <p style={{color: 'red'}}>{passwordErrors}</p>
                                    </div> : null}

                            </div>
                            <div className="form-group">
                                <label>Repeat password</label>
                                <input value={passwordRepeat}
                                       name='passwordRepeatField'
                                       onChange={function (event) {
                                           setPasswordRepeat(event.target.value);
                                       }}
                                       type="password"
                                       style={inputStyle}
                                       placeholder="Password"
                                       ref={(ref) => refs.push(ref)}/>
                                {passwordRepeatErrors ?
                                    <div>
                                        <p style={{color: 'red'}}>{passwordRepeatErrors}</p>
                                    </div> : null}

                            </div>
                            <div style={{flex:'auto', display: 'flex'}}>
                                <div>
                                    <button type="submit"
                                            className="btn btn-primary"
                                            onClick={function (event) {
                                                event.preventDefault();
                                                handleSubmit();
                                            }}>Submit</button>
                                </div>
                                <div style={{marginLeft: 'auto'}}>
                                    <div>
                                        <a onClick={function (e) {
                                            e.preventDefault();
                                            goToLogin();
                                        }}>Login</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    return function (props) {
        const sizeBreakpoints = {
            small: 0,
            large: 700
        };

        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <RegisterComponent {...props}/>
            </ResponsiveBlock>
        )
    }
}
