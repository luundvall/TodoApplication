export default function ({axios, url, appStateModel}) {

    const fetchLists = function () {
        return axios.post(url + 'getlists', {
            username: appStateModel.deref().loggedInUser
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        }).then(function ({data}) {
            appStateModel.swap(function (state) {
                state.todoLists = data;
                return state;
            })
        });

    };

    const callUpdateList = function (updatedList, listId) {
        axios.post(url + 'updatelist', {
            listId: listId,
            username: appStateModel.deref().loggedInUser,
            list: updatedList
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        }).then(function () {
            appStateModel.swap(function(state) {
                state.todoLists = state.todoLists.map(function (list) {
                    if (list.listId === listId) {
                        list.list.list = updatedList;
                        return list;
                    }
                    return list;
                });
                return state;
            })
        });
    };

    const updateListName = function (listId, name) {
        axios.post(url + 'updatelistname', {
            listId: listId,
            name: name
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        }).then(function ({data}) {
            appStateModel.swap(function(state) {
                state.todoLists = state.todoLists.map(function (list) {
                    if (list.listId === listId) {
                        list.name = data;
                        return list;
                    }
                    return list;
                });
                return state;
            });

        }).then(fetchLists());
    };

    const createNewList = function () {
        return axios.post(url + 'createlist', {
            username: appStateModel.deref().loggedInUser
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        }).then(fetchLists);
    };

    const deleteList = function (listId) {
        return axios.post(url + 'deletelist', {
            listId: listId
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': url
            }
        }).then(function () {
            appStateModel.swap(function(state) {
                state.todoLists = state.todoLists.filter(function (list) {
                    return list.listId !== listId;
                });
                return state;
            })
        });
    };

    return {
        createNewList,
        updateListName,
        deleteList,
        fetchLists,
        callUpdateList
    }
}
