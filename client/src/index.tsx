import 'babel-polyfill'
import 'react-app-polyfill/ie11'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './assets/styles/reset.css'
import * as serviceWorker from './serviceWorker'
import api from './utils/api'

api.init()
ReactDOM.render(<App />, document.getElementById('root'))
if (process.env.NODE_ENV === 'production') {
  serviceWorker.register()
} else {
  serviceWorker.unregister()
}
