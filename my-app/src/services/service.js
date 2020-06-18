export default function ({axios, url, cookieHandler, appStateModel}) {

    async function fetchList(email) {
        return await axios.post(url + 'getlists', {
            username: email || cookieHandler.getUsernameCookie(),
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        }).then(function ({data}) {
            appStateModel.swap(function (state) {
                state.todoLists = data;
                state.shouldDisplayLogin = false;
                return state;
            });
        });
    }

    async function verifyJwt() {
        return await axios.get(url + 'verifyjwt', {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        });
    }

    return {
        fetchList: (email) => fetchList(email),
        verifyJwt: () => verifyJwt()
    }
}
