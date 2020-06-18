import headerMaker from './Header/component';
import componentRendererMaker from '../../util/componentRenderer';

export default function ({elq}) {

    const controller = {};
    controller.view = {
        render: function (target) {
            const Header = headerMaker({elq});

            const componentRenderer = componentRendererMaker({
                target: target,
                Component: Header,
                getProps: function () {
                    return {
                    };
                }
            });
            componentRenderer.render();
        }
    };

    return controller;
};
