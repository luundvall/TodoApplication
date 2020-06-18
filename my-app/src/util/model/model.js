import Events from '../events';
import _ from 'lodash';

export default function (initialData) {

    var model = _.extend({}, Events);

    var data = initialData;

    function deref() {
        return data;
    }

    function swap(f) {
        var args = Array.prototype.slice.call(arguments, 1);
        var newData = f.apply(null, [data].concat(args));
        data = newData;
        model.trigger('change', data);
        return data;
    }

    model.deref = deref;
    model.swap = swap;

    return model;
}
