import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import App from './App'

import './index.css'
import './theme/tokens.css'
import './theme/reset.css'
import './theme/typography.css'
import './theme/stage.css'
import './theme/masthead.css'
import './theme/cards.css'
import './theme/card-speed.css'
import './theme/card-context.css'
import './theme/card-connections.css'
import './theme/controls.css'
import './theme/grain.css'
import './theme/animations.css'
import './theme/responsive.css'
import './theme/accessibility.css'
import './App.css'

// Configure Axios: use VITE_API_URL in production or fallback to live Render backend
const backendUrl = import.meta.env.VITE_API_URL || 'https://shiftbase.onrender.com';
axios.defaults.baseURL = backendUrl.replace(/\/$/, '');
axios.defaults.withCredentials = true;

console.log('Shiftbase API connected to:', axios.defaults.baseURL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
