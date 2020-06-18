import _ from 'lodash';
import modelMaker from '../../../../util/model/model';
import engineMaker from './engine';
import Events from '../../../../util/events';
import componentRendererMaker from '../../../../util/componentRenderer';
import serviceCallerMaker from "./service/serviceCaller";
import componentMaker from './component';

export default function ({
                             elq,
                             appStateModel,
                             axios,
                             url
                         }) {

    const controller = {};
    _.assignIn(controller, Events);

    const initialState = {
        authenticateResponse: null,
        isRegisterSelected: false
    };
    const model = modelMaker(initialState);

    const engine = engineMaker({
        model,
        controller,
        axios
    });
    engine.start();

    const serviceCaller = serviceCallerMaker({axios, url, controller, model, appStateModel});

    controller.view = {
        render: function (target) {
            const Component = componentMaker({elq});
            const componentRenderer = componentRendererMaker({
                target,
                Component: Component,
                getProps: function () {
                    return {
                        hasError: appStateModel.deref().error,
                        state: model.deref(),
                        authenticate: serviceCaller.signIn,
                        registerSelected: () => {
                            model.swap(function (state) {
                                state.registerSelected = true;
                                return state;
                            });
                        },
                        goToLogin: () => {
                          model.swap(function (state) {
                              state.registerSelected = false;
                              return state;
                          });
                        }
                    }
                }
            });

            componentRenderer.render();

            const viewInstance = _.extend({}, Events);
            viewInstance.listenTo(model, 'change', componentRenderer.render);

            if (appStateModel.deref().isLoggedIn) {
                viewInstance.remove();
            }
        }
    };

    return controller;

}
