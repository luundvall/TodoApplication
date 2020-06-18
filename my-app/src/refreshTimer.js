export default function ({appStateModel, axios, url, cookieHandler}) {

    function start() {
        setTimeout(function () {
            appStateModel.swap(function (state) {
                state.shouldDisplayRefreshSessionMessage = true;
                return state;
            });
        }, 100000); // 16.5 minutes  == 1000000
    }

    return {
        start: start,
        refreshSession: function () {
            axios.post(url + 'refresh', {
                empty: ''
            },{
                withCredentials: true, // Don't forget to specify this if you need cookies
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': url
                }
            }).then(function () {
                if (appStateModel.deref().loggedInUser.length > 0) {
                    cookieHandler.setUsernameCookie(appStateModel.deref().loggedInUser)
                }
            }, function (error) {

            }).finally(function () {
                appStateModel.swap(function (state) {
                    state.shouldDisplayRefreshSessionMessage = false;
                    return state;
                });
                start();
            });
        }
    };
}
