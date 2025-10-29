// import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Product from './pages/ProductPage'
import Services from './pages/Services'
import Outlet from './pages/Outlet'
import Contact from './pages/Contact'

export const router = createBrowserRouter([
  {
    path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'products', element: <Product /> },
        { path: 'services', element: <Services /> },
        { path: 'outlet', element: <Outlet /> },
        { path: 'contact', element: <Contact /> }
    ]
  }
])