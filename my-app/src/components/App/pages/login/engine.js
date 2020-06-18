import Events from '../../../../util/events';
import _ from 'lodash';

export default function ({model}) {

    const engine = {};
    _.assignIn(engine, Events);

    function gameLoop() {

    }

    return {
        start: function () {
            engine.listenTo(model, 'change', gameLoop);
        }
    };
}
