import { Link } from "react-router-dom"
import { CgArrowsExpandUpLeft } from "react-icons/cg";
import { MdEngineering } from "react-icons/md";
import LandingHeader from "../components/LandingHeader"

function Landing() {
  return (
    <section className="main bg-raisinBlack poppins" style={{}}>
      <div className=" ">
        <LandingHeader />
        <div className="mt-[60px] w-[100%] md:w-[600px] mx-[auto] text-center ">
          <h1 className="text-[2.5rem] font-[400] mb-[20px]">Empowering Security <br />with <span className="text-[#ffca4c]">AI Insights</span></h1>
          <p className="text-[.9rem] text-[#d3d3d3] font-[300]">Experience peace of mind with our AI-powered surveillance.<br /> Detect and respond to threats quickly and effectively. </p>
          <Link to="/onboard" className="font-[300] px-4 py-2 block w-[150px] mx-[auto] mt-5 text-[.95rem] rounded-md bg-prussianBlue">Get started</Link>
          
        </div>
        <div title="Powered by cloudflare" className="my-[90px] flex gap-x-[70px] mx-[auto] py-[25px] px-5 bg-[#242b33] shadow-2xl rounded-md relative">
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
      
      <button className=" bg-[#242b33] px-4 py-2 text-[.9rem] rounded-md fixed bottom-[30px] flex gap-x-[10px] right-[30px]">
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
    <div className="flex flex-col md:flex-row gap-x-[20px] gap-y-[20px]">
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