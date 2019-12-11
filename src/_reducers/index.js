import { combineReducers } from 'redux';

import {alert} from './alert.reducer';
import {acts} from './acts.reducer';
import {subdivisions} from './subdivisions.reducer';
import {modalIsOpen} from './modalForm.reducer';



export const rootReducer = combineReducers({
    alert: alert,
    acts: acts,
    subdivisions: subdivisions,
    modalIsOpen: modalIsOpen
});
export default rootReducer;