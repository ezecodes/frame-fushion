import LandingHeader from "../components/LandingHeader"
import { Link, useNavigate } from "react-router-dom"
import {useState, useEffect, useRef} from "react"
import { FaCheck } from "react-icons/fa6";
import { useStore } from "../store";

const screens = [
  {
    question: "What is the purpose of using this tool?",
    id: "q_1",
    path: "/undraw_goals_re_lu76.svg",
    options: [
      "Physical threats (e.g., unauthorized access, theft)",
      "Behavioral threats (e.g., suspicious activity, loitering)",
      "Environmental threats (e.g., fire, flood)",
    ]
  },
  {
    question: "Layout of Surveillance Area?",
    id: "q_2",
    path: "/undraw_environmental_study_re_q4q8.svg",
    options: [
      "Indoor",
      "Outdoor",
      "Mixed (indoor and outdoor)",
    ]
  },
  {
    question: "Use Case for Insights and Data",
    id: "q_3",
    path: "/undraw_real_time_analytics_re_yliv.svg",
    options: [
      "Security planning and strategy",
      "Incident response and investigation",
      "Compliance and regulatory requirements"
    ]
  }
]

function Onboard() {
  const [currentScreen, setScreen] = useState<
    {
      question: string;
      id: string;
      path: string;
      options: string[]
    } | null
  >(null)
  const [curIndex, setIndex] = useState(0)
  const setOnboardChoice = useStore(state => state.setOnboardChoice)
  const navigate = useNavigate()

  useEffect(() => {
    if (curIndex < screens.length) {
    } 
  }, [currentScreen])

  return (
    <section className="bg-raisinBlack poppins main animate__animated animate__fadeInLeft">
      <div className='auto_w'>
        <LandingHeader />
      </div>

      <div className="mt-[100px] px-5 relative">
        {
          currentScreen ?
          <div className="flex flex-col-reverse items-center md:flex-row gap-y-[50px] justify-center gap-x-[70px] animate__animated animate__fadeInUp">
            <div className="flex flex-col">
              <h3 className="text-[1.3rem] font-[400] mb-5"> {currentScreen.question} </h3>
              <div className="mt-[10px] flex flex-col">
                {
                  currentScreen.options.map((option, idx) => 
                    <Item
                      idx={idx}
                      setSelected={() => setOnboardChoice({option, question: currentScreen.question})}
                      option={option}
                      key={idx}
                      id={currentScreen.id}
                    />
                  )
                }
              </div>
              <div className="relative lg:fixed my-[20px] bottom-0 flex">
                <button className="choice_bt mr-5 bg-prussianBlue" onClick={() => {
                  setScreen(screens[curIndex])
                  setIndex(curIndex + 1)

                  if (curIndex === screens.length -1) {
                    navigate("/app")
                  }
                 
                }}> Continue </button>
                <button className="choice_bt bg-[#333c47]"> Skip </button>
              </div>
            </div>
            <div className="">
              <img src={currentScreen.path} className="h-[auto] w-[350px]" />
            </div>
          </div>
          : <div className='auto_w animate__animated animate__fadeInUp animate__delay-1s'>
            <h1 className='text-[1rem] w-full leading-6 md:w-[600px] text-center mx-[auto]'> <span className="block mb-5 font-[400] text-[2rem]">Welcome to German Guard!</span> <span className="text-[#ffca4c]">Ready to start?</span> Customize your experience now or jump right in. Your choice!</h1>
            <div className="flex gap-x-[15px] justify-center mt-[25px]">
              <button className="choice_bt bg-prussianBlue" onClick={() => setScreen(screens[0])}> 
                Let's begin 
              </button>
              <button className="choice_bt bg-[#333c47]"><Link to="/app"> Maybe later </Link> </button>
            </div>
          </div>
        }
      </div>

        
    </section>
    
  )
}

function Item({idx, option, setSelected, id}) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    inputRef.current.addEventListener("change", e => {
      setSelected()
    })
  }, [])

  return (
    <div className="text-[.9rem] onb_ relative mb-3 pl-[30px] flex">
      <input 
        ref={inputRef}
        className="mb-5 hidden" 
        type="radio" 
        id={`option_${id}_${idx}`} 
        name={`options_${id}`}
      /> 
      <label className="cursor-pointer " htmlFor={`option_${id}_${idx}`} key={idx}> {option} </label>
    </div>
  )
}
export default Onboard