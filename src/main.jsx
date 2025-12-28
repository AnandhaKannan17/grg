import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import client from './shops-query/utils/client'
import { ShopQueryProvider } from './shops-query/context/ShopContext'
import './index.css'
import App from './App.jsx'

console.log('Rendering main.jsx');
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ShopQueryProvider>
        <App />
      </ShopQueryProvider>
    </ApolloProvider>
  </StrictMode>,
)
