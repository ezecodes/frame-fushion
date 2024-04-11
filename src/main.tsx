import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Dashboard from './pages/Dashboard.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Landing from './pages/Landing.tsx'
import Analysis from './pages/Analysis.tsx'
import ActivityLogs from './pages/ActivityLogs.tsx'
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
    path: "/simulation/app",
    element: <App />,
    children: [
      {
        path: "/simulation/app/Analysis",
        element: <Analysis />
      },
      {
        path: "/simulation/app/logs",
        element: <ActivityLogs />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Signup />
  },
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>,
)
