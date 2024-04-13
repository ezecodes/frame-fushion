import { useNavigate } from "react-router-dom"
import { CgArrowsExpandUpLeft } from "react-icons/cg";
import { MdEngineering } from "react-icons/md";
import LandingHeader from "../components/LandingHeader"
import { useStore } from "../store";
import { useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

function Landing() {
  const fetchFunction = useStore(state => state.fetchFunction)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const navigate = useNavigate()

  const [loading, setBtn] = useState(false)

  async function handleFetch(e) {
    e.preventDefault()
    setBtn(true)
    
    const signin = await fetchFunction(
      "/signin",
      {email: emailRef.current.value, password: passwordRef.current.value},
      "post",
      false
    )
    console.log(signin)
    if (signin.success) {
      toast.info(signin.message)
      localStorage.setItem("authToken", signin.data.authToken)
      navigate("/app")
    } else {
      toast.error(signin.message)
    }
    setBtn(false)
  }
  return (
    <>
    <section className="main bg-raisinBlack poppins animate__animated animate__fadeIn" style={{}}>
      <div className="auto_w ">
        <LandingHeader />

        <form className="mx-[auto] mt-[100px] w-[300px]" onSubmit={handleFetch}>
          <h1 className="text-[1.3rem] mb-5 text-center">Sign in to continue</h1>
          <fieldset className="flex flex-col mb-5 gap-y-[30px]">
            <input ref={emailRef} type="email" autoFocus autoComplete="email" className="w-full px-3 py-2 rounded-md bg-[transparent] border-[1px] border-outerSpace border-[solid]" placeholder="Email" />
            <input ref={passwordRef} type="password" className="w-full px-3 py-2 rounded-md bg-[transparent] border-[1px] border-outerSpace border-[solid]" placeholder="Password" />
          </fieldset>
          <fieldset>
            <button type="submit" className="font-[300] px-4 py-2 block w-[150px] mx-[auto] mt-5 text-[.95rem] rounded-md bg-prussianBlue">Send {loading ? "..." : "" } </button>
          </fieldset>
        </form>
      </div>
    </section>
    <ToastContainer />
    </>
    
  )
}
export default Landing