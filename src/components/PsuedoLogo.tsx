import { Link } from "react-router-dom"

function PsuedoLogo({path}: {path: "/" | "/simulation/app"}) {
  return (
    <Link to={path}><span className="font-[400] text-[white] text-[1.5rem]">SSH</span></Link>
  )
}

export default PsuedoLogo