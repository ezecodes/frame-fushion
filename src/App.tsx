import { Outlet } from "react-router-dom"
import AppHeader from "./components/AppHeader"
import Sidebar from "./components/Sidebar"

function App() {

  return (
    <section className='min-h-[100vh] flex flex-col'>
      <AppHeader />
      <section className="bg-raisinBlack flex-1 flex">
        <Sidebar />
        <Outlet />
      </section>
    </section>
  )
}

export default App
