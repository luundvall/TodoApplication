import React from "react";
import loginMaker from "./login/component";
import registerMaker from "./register/component";

export default function ({elq}) {

    const LoginComponent = loginMaker({elq});
    const RegisterComponent = registerMaker({elq});

    return function (props) {
        return props.state.registerSelected ? <RegisterComponent {...props}/> :
            <LoginComponent {...props}/>;
    }
}
