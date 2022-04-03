import 'react-app-polyfill/ie11'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// import * as Sentry from '@sentry/browser'
import { createRoot } from 'react-dom/client';
import App from './App'
import './assets/styles/reset.css'
import * as serviceWorker from './serviceWorker'
import api from './utils/api'

api.init()
// Sentry.init({
//   dsn: 'https://071f5a5ca4ad42749cdac7147954effe@sentry.io/1375275',
// })

const container = document.getElementById('root');
const root = createRoot(container as any);
root.render(<App />);
if (process.env.NODE_ENV === 'production') {
  // serviceWorker.register() I decided that they should always have the most up to date version of the CMS
  serviceWorker.unregister()
} else {
  serviceWorker.unregister()
}
