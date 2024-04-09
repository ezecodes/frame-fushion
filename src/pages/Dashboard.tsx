import { useState } from "react";
import DashHeader from "../components/DashHeader"
import Popup from 'reactjs-popup';

function Dashboard() {
  const [showCamManager, setCam] = useState(false)
  return (
    <>
    <section className="px-[40px] py-[25px] text-[white] poppins">
      <DashHeader text={"dashboard"} />

      <div className="my-[50px]">
        <h2 className="subtext">Camera List</h2>
        <button className="app_button" onClick={() => setCam(true)}>Add Camera</button>
      </div>
    </section>
    {
      showCamManager ?
      <AddCamera />
      : <></>
    }
    </>
  )
}

function AddCamera() {
  return (
    <Popup trigger={<button> Trigger</button>} position="right center">
      <div>Popup content here !!</div>
    </Popup>
  )
}

export default Dashboard