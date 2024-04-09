import { useStore } from "../store"
import { FaWalking } from "react-icons/fa";
import { GrEmergency } from "react-icons/gr";
import { FaPerson } from "react-icons/fa6";
import { MdSecurity } from "react-icons/md";

function AlertManager() {
  const alerts = useStore(state => state.alerts)
  return (
    <div className="absolute alert_mgr max-h-[350px] shadow-lg overflow-x-hidden overflow-y-scroll rounded-md right-0 top-[45px] bg-black w-[300px]">
      {
        alerts &&
        alerts.map(alert => {
          return (
            <li key={alert.id} className=" alert_li flex gap-x-[15px] relative items-center border-bottom px-3 py-5 h-[80px]">
                <span className="alert_ico ">
                  {alert.type === "motion detection" ? <FaWalking /> : <></>}
                  {alert.type === "emergency" ? <GrEmergency /> : <></>}
                  {alert.type === "person detection" ? <FaPerson /> : <></>}
                  {alert.type === "security" ? <MdSecurity /> : <></>}
                  
                </span>
                <span className="absolute w-full left-[70px] alert_content flex flex-col items-start">
                  <span className="text-[white] text-[.95rem] font-[500] capitalize">{alert.type}</span>
                  <span className="nowrap_text text-[.9rem] text-[#8b8b8b]"> {alert.message} </span>
                </span>
            </li>
          )
        })
      }
      <li className=""></li>
    </div>
  )
}

export default AlertManager