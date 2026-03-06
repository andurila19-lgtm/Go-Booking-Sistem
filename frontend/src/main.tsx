import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId="778170173108-qadrdiugpl35smeick8qv2bqg9el2m22.apps.googleusercontent.com">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </GoogleOAuthProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
