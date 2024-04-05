import { IoMdEye } from "react-icons/io";
import {Link, useLocation,} from "react-router-dom"
import { MdOutlineDataExploration } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";

const links = [
  
]

function Threats() {
  return (
    <aside className="text-[white] sidebars raleway right-0 z-[10] bg-[#32363b]  shadow-2xl">
      <div className="">
        <div className="flex items-center pb-3">
          <span className="mx-3"> <IoInformationCircleOutline /> </span>
          <span className="text-[.85rem]"> Assailiants with weapons </span>
        </div>
        <div className="threats_info">
          <div className="bg-raisinBlack">
            <span> Detected </span>
            <span> 6:43 <span className="text-[.6rem] font-[300]"> 6 min ago </span> </span>
          </div>
          <div className="bg-raisinBlack">
            <span> Threat level </span>
            <span> Deadly </span>
          </div>
          <div className="bg-raisinBlack">
            <span> People at risk </span>
            <span> 10 </span>
          </div>
        </div>
      </div>
      
    </aside>
  )
}

export default Threats