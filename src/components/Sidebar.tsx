import { IoMdEye } from "react-icons/io";
import {Link, useLocation,} from "react-router-dom"
import { MdOutlineDataExploration } from "react-icons/md";
import PsuedoLogo from "./PsuedoLogo";

const links = [
  {
    name: "Analysis",
    href: "/app/analysis",
    icon: <IoMdEye className="text-[1.2rem]" />
  },
  {
    name: "Logs",
    href: "/app/logs",
    icon: <MdOutlineDataExploration className="text-[1.2rem]" />
  }
]

function Sidebar() {
  const router = useLocation()
  return (
    <>
    <aside className="relative animate__animated animate__fadeInLeft poppins left-0 z-[10] sidebars shadow-2xl " style={{width: '200px'}}>
      <div className="">
        <div className="mb-[20px] pl-[15px]"><PsuedoLogo path={"/"} /></div>
        <div>
          {
            links.map((link, idx) => (
              <Link to={link.href} key={idx} className={`mb-3 hover:text-[white] pl-[15px] gap-x-[10px] text-[.90rem] py-[15px] flex uppercase font-[400] items-center text-[white] ${router.pathname === link.href ? "bg-raisinBlack" : ""} `}>
                {link.icon}
                {link.name}
              </Link>
            ))
          }
        </div>
      </div>
    </aside>
     {/* <div className="fixed bottom-[0] left-0 w-[200px] z-[10]">
     <button onClick={() => navigate("/app/customize")} className="sidebar_btn mb-2">
       <IoSettingsOutline /> Customize
     </button>
     <button onClick={() => navigate("/")} className="sidebar_btn">
       <BiLogOut /> Home
     </button>
   </div> */}
   </>
  )
}

export default Sidebar