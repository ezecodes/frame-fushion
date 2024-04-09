import { Link } from "react-router-dom"
function LandingHeader() {
	return (
		<header className="py-5 flex px-5 justify-between" style={{borderBottom: "1px solid #242a31"}} >
	      <Link to="/"><span className="font-[400] text-[white] text-[1.5rem]">GG</span></Link>
	      <NavManager />
	      
    </header>
	)
}

const navItems = [
  {
    href: '/features',
    link: "features",
    navItems: [
      
    ],
  },
  {
    href: '/support',
    link: "support"
  },
  {
    href: '/contact',
    link: "contact"
  }
]

function NavManager() {
  return (
    <nav className="flex items-center gap-x-[20px]" style={{}}>
      {
        navItems.map((item, idx) => {
          return (
            <Link to={item.href} className="hover:text-[white] capitalize font-[300] text-[.9rem] text-[white]">{item.link}</Link>
          )
        })
      }
    </nav>
  )
}

export default LandingHeader