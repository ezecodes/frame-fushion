import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Dashboard from './pages/Dashboard.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Main from './pages/Main.tsx'
import Surveillance from './pages/Surveillance.tsx'
import ActivityLogs from './pages/ActivityLogs.tsx'

const route = createBrowserRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "/app",
        element: <Dashboard />
      },
      {
        path: "/app/surveillance",
        element: <Surveillance />
      },
      {
        path: "/app/logs",
        element: <ActivityLogs />
      }
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
