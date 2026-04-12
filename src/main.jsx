import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductProvider } from './context/ProductsContext.jsx'
import { GalleryProvider } from './context/GalleryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <AuthProvider>
       <ProductProvider>
        <GalleryProvider>
         <CartProvider>
        <App />
      </CartProvider>
        </GalleryProvider>
       </ProductProvider>
     </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
