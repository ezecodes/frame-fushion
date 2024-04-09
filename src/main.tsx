import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Dashboard from './pages/Dashboard.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Landing from './pages/Landing.tsx'
import Surveillance from './pages/Surveillance.tsx'
import ActivityLogs from './pages/ActivityLogs.tsx'
import Onboard from './pages/Onboard.tsx'

const route = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
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
        path: "/simulation/app/surveillance",
        element: <Surveillance />
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
  }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>,
)
