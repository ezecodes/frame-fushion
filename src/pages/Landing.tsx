import { Link } from "react-router-dom"
import { CgArrowsExpandUpLeft } from "react-icons/cg";
import { FaCircleCheck } from "react-icons/fa6";
import { MdEngineering } from "react-icons/md";

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

function Landing() {
  return (
    <section className="bg-[#1a2027] pb-5 poppins text-[white] min-h-[100vh] " style={{}}>
      <div className="md:w-[640px] mx-[auto]  lg:w-[1024px] ">
        <header className="py-5 flex justify-between" style={{borderBottom: "1px solid #242a31"}} >
          <span className="font-[400] text-[white] text-[1.5rem]">GG</span>
          <NavManager />
          
        </header>
        <div className="mt-[60px] w-[100%] md:w-[600px] mx-[auto] text-center ">
          <h1 className="text-[2.5rem] font-[400] mb-[20px]">Empowering Security <br />with <span className="text-[#ffca4c]">AI Insights</span></h1>
          <p className="text-[.9rem] text-[#d3d3d3] font-[300]">Experience peace of mind with our AI-powered surveillance.<br /> Detect and respond to threats quickly and effectively. </p>
          <Link to="/onboard" className="font-[300] px-4 py-2 block w-[150px] mx-[auto] mt-5 text-[.95rem] rounded-md bg-prussianBlue">Get started</Link>
          
        </div>
        <div className="my-[90px] flex gap-x-[70px] mx-[auto] py-[25px] px-5 bg-[#191e25] rounded-md relative">
          <div className="w-[100px] h-[auto]">
            <a href="https://cloudflare.com"><img src="/cloudflare.svg" className="w-full h-full" /></a>
            {/* <span>Cloudflare</span> */}
          </div>
          <div className="w-[200px]">
            <h2 className="mb-3 flex items-center color-change-2x text-[.9rem] font-[300]">
              <MdEngineering className="mr-2 text-[2rem]" />
              Models
            </h2>
            <ModelsList />
          </div>
        </div>
        
      </div>
      
      <button className="heartbeat bg-raisinBlack px-4 py-2 rounded-md absolute bottom-[50px] flex gap-x-[10px] right-[50px]">
        <CgArrowsExpandUpLeft className="text-[1.2rem]" />
        Sponsor
      </button>
    </section>
    
  )
}

const models = [
  {
    name: "@cf/microsoft/resnet-50",
    task: "image classification"
  },
  {
    name: "@cf/unum/uform-gen2-qwen-500m",
    task: "Image-to-Text"
  },
  {
    name: "@cf/facebook/detr-resnet-50",
    task: "Object Detection"
  },
  {
    name: "@cf/huggingface/distilbert-sst-2-int8",
    task: "Text Classification"
  },
  {
    name: "@cf/meta/m2m100-1.2b",
    task: "Translation"
  }
]

function ModelsList() {

  return (
    <div className="m_list">
      {
        models.map((model, idx) => {
          return (
            <div key={idx}>
              <span className="text-[.8rem] text-[#d3d3d3]"> {model.name} </span>
            </div>
          )
        })
      }
    </div>
  )
}

export default Landing