import { IoMdEye } from "react-icons/io";
import {Link, useLocation,} from "react-router-dom"
import { MdOutlineDataExploration } from "react-icons/md";

const links = [
  {
    name: "Surveillance",
    href: "/app/surveillance",
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
    <aside className="poppins left-0 z-[10] sidebars shadow-2xl " style={{width: '200px'}}>
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
    </aside>
  )
}

export default Sidebar