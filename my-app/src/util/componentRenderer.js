import React from 'react';
import ReactDOM from 'react-dom';
export default function ({
                             target,
                             Component,
                             getProps
                         }) {
    var rendered = false;
    var targetDiv = target || document.createElement('div');

    return {
        unmountComponent: function () {
            if (rendered) {
                ReactDOM.unmountComponentAtNode(targetDiv);
            }
        },
        render: function () {
            var props = null;

            if (getProps) {
                props = getProps();
            }

            var reactElement = React.createElement(Component, props);

            ReactDOM.render(reactElement, targetDiv);

            rendered = true;

            return null;
        }
    };
}
