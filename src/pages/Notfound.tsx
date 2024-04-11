import { Link } from "react-router-dom"
import LandingHeader from "../components/LandingHeader"

function Notfound() {
  return (
    <section className="main bg-raisinBlack poppins animate__animated animate__fadeIn" style={{}}>
      <div className="auto_w ">
        <LandingHeader />
        <div className="mx-[auto] mt-[60px] flex flex-col gap-y-[30px] items-center">
          <img src="/undraw_page_not_found_re_e9o6.svg" className="w-[300px] h-[auto]" />
          <h2 className="text-[1.5rem] mt-[20px]">Seems like you lost your way</h2>
        </div>

      </div>
    </section>
    
  )
}

export default Notfound