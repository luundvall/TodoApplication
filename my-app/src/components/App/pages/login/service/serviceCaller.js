import _ from "lodash";

export default function ({url, axios, controller, model, appStateModel}) {

    function signIn({email, password}) {
        return axios.post((url + 'signin'), {
            username: email,
            password: password
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        })
            .then(function (response) {
                if (!response.data.error) {
                    controller.trigger('loginSuccess', {email});
                    appStateModel.swap(function (state) {
                        state.error = null;
                        return state;
                    })
                }
                model.swap(function (state) {
                    state.error = _.get(response, 'data.error', null);
                    return state;
                });
            });
    }

    return {
        signIn: ({email, password}) => signIn({email, password})
    }
}
