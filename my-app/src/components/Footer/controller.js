import footerMaker from './Footer/component';
import componentRendererMaker from "../../util/componentRenderer";

export default function ({elq}) {

    const controller = {};
    controller.view = {
        render: function (target) {
            var Footer = footerMaker({elq});

            var componentRenderer = componentRendererMaker({
                target: target,
                Component: Footer,
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
