import { alertConstants } from '../constants';

export const alertActions = {
    success,
    error,
    clear,
};

function success(alert) {
    return {
        type: alertConstants.SUCCESS,
        header: alert.header,
        content: alert.content,
    };
}

function error(alert) {
    return {
        type: alertConstants.ERROR,
        header: alert.header,
        content: alert.content,
    };
}

function clear() {
    return { type: alertConstants.CLEAR };
}
