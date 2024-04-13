import React from 'react'
import ReactDOM from 'react-dom/client'
import Analysis from './pages/Analysis.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Signin from './pages/Signin.tsx'
import Landing from './pages/Landing.tsx'
import Onboard from './pages/Onboard.tsx'
import Notfound from './pages/Notfound.tsx'

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <Notfound />
  },
  {
    path: "/onboard",
    element: <Onboard />
  },
  {
    path: "/app",
    element: <Analysis />,
  },
  {
    path: "/signin",
    element: <Signin />
  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>,
)
