import 'react-app-polyfill/ie11'

import 'babel-polyfill'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './assets/styles/reset.css'
import * as serviceWorker from './serviceWorker'
import api from './utils/api'

api.init()
ReactDOM.render(<App />, document.getElementById('root'))
if (process.env.NODE_ENV === 'production') {
  // serviceWorker.register() I decided that they should always have the most up to date version of the CMS
  serviceWorker.unregister()
} else {
  // serviceWorker.unregister()
}
