import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initFirebase } from './services/firebase'
import { initGlobalErrorHandlers } from './services/errorLogger'

initFirebase()
initGlobalErrorHandlers()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
