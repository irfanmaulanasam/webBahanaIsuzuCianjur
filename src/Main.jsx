import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/global.css'
import { router } from './router'

function Main() {
  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')).render(<Main />)
