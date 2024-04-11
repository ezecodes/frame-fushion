import { Link } from "react-router-dom"
import { CgArrowsExpandUpLeft } from "react-icons/cg";
import { MdEngineering } from "react-icons/md";
import LandingHeader from "../components/LandingHeader"

function Landing() {
  return (
    <section className="main bg-raisinBlack poppins animate__animated animate__fadeInLeft" style={{}}>
      <div className="auto_w ">
        <LandingHeader />
        <div className="mt-[60px] w-[100%] md:w-[600px] mx-[auto] text-center animate__animated animate__fadeInUp animate__delay-1s">
          <h1 className="text-[2.5rem] font-[400] mb-[20px]"><span className="text-[#ffca4c]">Synthesizes information</span><br /> from video frames </h1>
          <p className="subtext">It's your tool for advanced video analysis, <br /> offering a deeper understanding of your content's visual data </p>
          <Link to="/simulation/app/analysis" className="font-[300] px-4 py-2 block w-[150px] mx-[auto] mt-5 text-[.95rem] rounded-md bg-prussianBlue">Get started
          </Link>
          <span className="text-[#d3d3d3] text-[.7rem]">No Sign up required </span>
          
        </div>
        <div title="Powered by cloudflare" className="animate__fadeInUp animate__animated animate__delay-2s my-[90px] flex gap-x-[70px] mx-[auto] py-[30px] px-5 bg-[#242b33] shadow-2xl rounded-md relative">
          <div className="w-[100px] h-[auto]">
            <span className="text-[.9rem] font-[200] mb-3 block color-change-2x">Powered By</span> 
            <a href="https://cloudflare.com" className="relative mb-5 block">
              <img src="/cloudflare.svg" className="w-full" />
              <span className="text-[.8rem] absolute top-[55px] text-[#d3d3d3]"> Cloudflare </span>
            </a>
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