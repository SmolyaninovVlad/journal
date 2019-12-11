import 'react-app-polyfill/ie11';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import 'core-js/stable'
import React from 'react';
// import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import {App} from './App';
// import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './_helpers';
//Алерты
import { AlertComp } from './srcTable/AlertsComp'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

// optional cofiguration
const options = {
  position: 'top right',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}

const Root = () => (
    <Provider store={store}>        
        <AlertProvider template={AlertTemplate} {...options}>
            <AlertComp/>        
            <App />
        </AlertProvider>
    </Provider>
  )



render(<Root/>, document.getElementById('root') );

