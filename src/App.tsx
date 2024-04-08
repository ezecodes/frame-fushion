import { Outlet } from "react-router-dom"
import AppHeader from "./components/AppHeader"
import Sidebar from "./components/Sidebar"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from "./store";
import { useEffect } from "react";

function App() {
  const appAlert = useStore(state => state.appAlert)
  const setAppAlert = useStore(state => state.setAppAlert)

  function onClose() {
    setAppAlert(null)
  }

  useEffect(() => {
    if (appAlert) {
      if (appAlert.type === "info") {
        toast.info(appAlert.message, {onClose})
      }
      if (appAlert.type === "warn") {
        toast.warn(appAlert.message, {onClose})
      }
      if (appAlert.type === "error") {
        toast.error(appAlert.message, {onClose})
      }
    }
  }, [appAlert])
  
  return (
    <>
    <section className='min-h-[100vh] flex flex-col'>
      <AppHeader />
      <section className="bg-raisinBlack flex-1 flex">
        <Sidebar />
        <Outlet />
      </section>
    </section>
    
    <ToastContainer />

    </>
  )
}

export default App
