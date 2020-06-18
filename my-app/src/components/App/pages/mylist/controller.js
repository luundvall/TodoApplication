import mylistMaker from './mylist/component';
import _ from 'lodash';
import Events from "../../../../util/events";
import componentRendererMaker from '../../../../util/componentRenderer';
import serviceCallerMaker from './mylist/service/serviceCaller';

export default function ({appStateModel, elq, url, axios}) {
    const controller = _.assignIn({}, Events);
    const serviceCaller = serviceCallerMaker({axios, url, appStateModel});

    // Wait 1 sec before autosave..
    const debouncedUpdateListCall =_.debounce(serviceCaller.callUpdateList, 1000);
    const debouncedUpdateListNameCall =_.debounce(serviceCaller.updateListName, 1000);

    controller.view = {
        render: function (target) {
            const Component = mylistMaker({elq});
            const componentRenderer = componentRendererMaker({
                target,
                Component: Component,
                getProps: function () {
                    return {
                        lists: appStateModel.deref().todoLists,
                        setList: function (updatedList, listId) {
                            if (appStateModel.deref().list !== updatedList) {
                                debouncedUpdateListCall(updatedList, listId);
                            }
                        },
                        createNewList: serviceCaller.createNewList,
                        deleteList: serviceCaller.deleteList,
                        updateListName: function(listId, name) {
                            debouncedUpdateListNameCall(listId, name);

                        },
                        setChosenList: function (list) {
                            appStateModel.swap(function (state) {
                                state.chosenList = list && list.listId;
                                return state;
                            })
                        },
                        chosenList: _.head(appStateModel.deref().todoLists.filter(function (todoList) {
                            return todoList.listId === appStateModel.deref().chosenList;
                        }))
                    }
                }
            });

            componentRenderer.render();
            const viewInstance = _.extend({}, Events);

            viewInstance.listenTo(appStateModel, 'change', function () {
                componentRenderer.unmountComponent();
                componentRenderer.render();
            });
        }
    };

    return controller;
}
