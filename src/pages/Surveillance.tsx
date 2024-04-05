import { useState } from "react";
import { useStore } from "../store"
import { FaSearch } from "react-icons/fa";
import { Camera } from "../types";
import { MdOutlineDataExploration } from "react-icons/md";
import { BiSolidVideoRecording } from "react-icons/bi";
import { TbLayoutList } from "react-icons/tb";
import { BsColumnsGap } from "react-icons/bs";
import Threats from "../components/Threats"

function ControlButton({control}: {control: {text?: string; icon?: any; click: () => void}}) {
  return (
    <button className="h-[35px] text-[white] flex justify-center items-center text-[1.3rem] w-[35px] bg-[rgba(0,0,0,.5)] rounded-[40px]">
      {
        control.text ? control.text
        : control.icon
      }
    </button>
  )
}

function Surveillance() {
  const cameraList = useStore(state => state.cameraList)
  const [selectedCamera, setSelected] = useState({})
  const [layout, setLayout] = useState<"column" | "row">("row")

  return (
    <>
    <div className="flex px-[40px] w-[68%] justify-between mx-[auto] py-5 poppins text-[white] ">
      <div className="">
        <div className="flex gap-x-[10px] mb-[50px] mt-[10px]">
          
          <div className="flex items-center text-[#8b8b8b]">
            <FaSearch  />
            <input className="bg-[transparent] outline-none ml-3" placeholder="Search" />
          </div>
          <button className="text-[#8b8b8b] text-[1.5rem] flex gap-x-[10px]">
            <TbLayoutList onClick={() => setLayout("column")} className={`${layout === "column" ? "text-[white]" : ""}`} />
            <BsColumnsGap onClick={() => setLayout("row")} className={`${layout === "row" ? "text-[white]" : ""}`} />
          </button>
          <div>

          </div>
          <div className="">

          </div>
        </div>
        <div className={`cam_res_wrap  ${layout === "column" ? "column" : "row"} `}>
          {
            cameraList.map((camera, idx) => 
              <CameraResult 
                key={idx} 
                camera={camera} 
              />
            )
          }
        </div>
      </div>
    </div>
    <Threats />
    </>
  )
}

function CameraResult({camera}: {camera: Camera}) {
  const setSelectedCamera = useStore(state => state.setSelectedCamera)
  const selectedCamera = useStore(state => state.selectedCamera)
  return (
    <>
    <div className={`cam_res ${selectedCamera.id === camera.id ? "active" : ""} relative poppins mb-[20px]`} onClick={() => {
      setSelectedCamera({...camera})
    }}>
      <div className="font-[400] text-[.9rem]">
        {camera.location} <br />
        <span className="text-[#b9d2ff]">{camera.resolution}</span> 
      </div>
      <div className="w-full">
        <img src={camera.snapshot} className=" h-[inherit] w-[inherit]" /> 
      </div>
      <div className="absolute flex gap-x-[10px] left-[10px] bottom-[20px]">
        <ControlButton
          control={{
            icon: <BiSolidVideoRecording />,
            click: () => {}
          }}
        />
        <ControlButton
          control={{
            icon: <MdOutlineDataExploration />,
            click: () => {}
          }}
        />
      </div>
    </div>
    
    </>
  )
}

function CameraList({location}: {location: string}) {
  return (
    <div className="">

    </div>
  )
}

export default Surveillance