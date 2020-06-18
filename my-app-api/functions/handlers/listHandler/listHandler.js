const _ = require('lodash');

function listHandler({db}) {

    const getLists = function (req, res) {
        const { username } = req.body;
        let citiesRef = db.collection('lists');
        citiesRef.where('username', '==', username).get()
            .then(snapshot => {
                var result = [];
                snapshot.forEach(doc => {
                    result.push({
                        listId: doc.ref.id,
                        list: doc.data()
                    });
                });
                res.send(JSON.stringify(result));
            })
    };

    const updatelist = function (req, res) {
        const {listId, list } = req.body;
        db.collection('lists').doc(listId).update({
            list: list
        })
            .then(function () {
                res.status(200).end();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const updateListName = function (req, res) {
        const {listId, name } = req.body;
        db.collection('lists').doc(listId).update({
            name: name
        })
            .then(function () {
                res.status(200).end();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const createList = function (req, res) {
        const { username } = req.body;
        db.collection('lists').add({
            list: [{
                id: _.uniqueId(new Date()),
                name: '',
                isDone: false,
            }],
            name: '',
            username: username
        })
            .then(function () {
                res.status(200).end();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const deletelist = function (req, res) {
        const {listId} = req.body;
        db.collection('lists').doc(listId).delete();
        res.status(200).end();
    };

    return {
        getLists,
        updatelist,
        createList,
        deletelist,
        updateListName
    };
}

module.exports = listHandler;
