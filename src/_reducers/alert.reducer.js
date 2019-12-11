import { alertConstants } from '../_constants';
  
export function alert(state = {}, action) {
    switch (action.type) {
    case alertConstants.SUCCESS:
        return {
            type: 'success',
            message: action.message
        };
    case alertConstants.ERROR:
        return {
            type: 'error',
            message: action.message
        };
    case alertConstants.INFO:
        return {
            type: 'info',
            message: action.message
        };
    default:
        return {}
    }
}

