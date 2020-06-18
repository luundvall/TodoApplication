import _ from 'lodash';
import Events from '../../util/events';
import menuMaker from './Menu/component';
import componentRendererMaker from '../../util/componentRenderer';


export default function ({
                             elq,
                             appStateModel,
                             refreshTimer,
                             axios,
                             url
                         }) {

    const controller = _.assignIn({}, Events);

    controller.view = {
        name: 'menu',
        render: function (target) {
            const Menu = menuMaker({elq});

            const componentRenderer = componentRendererMaker({
                target,
                Component: Menu,
                getProps: function () {
                    return {
                        controller: controller,
                        isLoggedIn: appStateModel.deref().isLoggedIn,
                        shouldDisplayRefresh: appStateModel.deref().shouldDisplayRefreshSessionMessage,
                        logout: function () {
                            return axios.post(url + 'logout', {
                                empty: ''
                            },{
                                withCredentials: true, // Don't forget to specify this if you need cookies
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': url
                                }
                            }).then(function () {
                                appStateModel.swap(function (state) {
                                    state.shouldDisplayLogin = true;
                                    return state;
                                });
                            }).finally(function () {
                                controller.trigger('logout');
                            });
                        },
                        refreshSession: refreshTimer.refreshSession
                    };
                }
            });
            componentRenderer.render();
            const viewInstance = _.extend({}, Events);

            viewInstance.listenTo(appStateModel, 'change', componentRenderer.render);
        }
    };

    return controller;
};
