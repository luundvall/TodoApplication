import loadingMaker from './Loading/component';
import componentRendererMaker from '../../../util/componentRenderer';
import _ from "lodash";
import Events from "../../../util/events";

export default function ({elq, appStateModel}) {

    const controller = {};
    controller.view = {
        render: function (target) {
            const LoadingComponent = loadingMaker({elq});

            const componentRenderer = componentRendererMaker({
                target: target,
                Component: LoadingComponent,
                getProps: function () {
                    return {
                        shouldShowLoading: appStateModel.deref().isLoading
                    };
                }
            });
            componentRenderer.render();

            const viewInstance = _.extend({}, Events);
            viewInstance.listenTo(appStateModel, 'change', componentRenderer.render);

            if (!appStateModel.deref().isLoading) {
                viewInstance.remove();
                componentRenderer.unmountComponent();
            }
        }
    };

    return controller;
};
