// import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Product'
import Services from './pages/Services'
import Outlet from './pages/Outlet'
import SearchPage from './pages/SearchPage'
import Contact from './pages/Contact'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'products', element: <Products /> },
      { path: 'services', element: <Services /> },
      { path: 'outlet', element: <Outlet /> },
      // { path: 'search', element: <SearchPage /> },
      { path: 'contact', element: <Contact /> }
    ]
  }
])