import { useEffect, useState, useRef } from "react";
import { useStore } from "../store"
import { Camera, DetectedImageResponseArray } from "../types";
import { BiSolidVideoRecording } from "react-icons/bi";
import { TbLayoutList } from "react-icons/tb";
import { BsColumnsGap } from "react-icons/bs";
import Threats from "../components/Threats"
import Loader from "../components/Loader";
import { Audio, Puff } from "react-loader-spinner";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import Searchbar from "../components/Searchbar"

function ControlButton({control}: {control: {text?: string; icon?: any; click: () => void}}) {
  return (
    <button onClick={control.click} className="h-[35px] text-[white] flex justify-center items-center text-[1.3rem] w-[35px] bg-[rgba(0,0,0,.5)] rounded-[40px]">
      {
        control.text ? control.text
        : control.icon
      }
    </button>
  )
}

function Surveillance() {
  const cameraList = useStore(state => state.cameraList)
  const [layout, setLayout] = useState<"column" | "row">("row")
  const selectedCamera = useStore(state => state.selectedCamera)
  
  return (
    <>
    <div className="flex px-[40px] w-[68%] justify-between mx-[auto] py-5 poppins text-[white] ">
      <div className="">
        <div className="flex gap-x-[10px] mb-[50px] mt-[10px]">
          <Searchbar />
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
          { cameraList &&
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
    {
      selectedCamera && 
      <Threats />
    }
    </>
  )
}

function CameraResult({camera}: {camera: Camera}) {
  const setSelectedCamera = useStore(state => state.setSelectedCamera)
  const selectedCamera = useStore(state => state.selectedCamera)
  const detected = useStore(state => state.detectedImages?.find(i => i.cameraId === camera.id))
  const setDetectedImage = useStore(state => state.setDetectedImage)
  const appendSnapshot = useStore(state => state.appendSnapshot)
  const [detecting, setDetecting] = useState(false)
  const intervalRef = useRef(null)
  const setCameraControl = useStore(state => state.setCameraControl)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoSrcRef = useRef<HTMLSourceElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const getSnapshot = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext('2d');

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const imageDataURL = canvasElement.toDataURL('image/png');
    imgRef.current.src = imageDataURL
    return {imageDataURL, playbackTime: videoElement.currentTime}

  };
  useEffect(() => {
    if (!videoRef.current) return
    if (camera.control.recording) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()

    }
  }, [camera.control.recording])

  useEffect(() => {
    if (!videoRef.current) return
    if (camera.control.audio) {
      videoRef.current.muted = false
    } else {
      videoRef.current.muted = true

    }
  }, [camera.control.audio])

  useEffect(() => {

    intervalRef.current = setInterval(() => {
      if (!camera.control.recording) return
      const {imageDataURL, playbackTime} = getSnapshot()
      fetch('http://127.0.0.1:8787/api/secured/describe', {
        method: 'POST',
        body: JSON.stringify({imageDataURL, playbackTime}),
        headers: {
          'Content-Type': 'text/plain'
        }
      })
      .then(response => response.json())
      .then((data: {text: string; classified: [], summary: string, timeCaptured: Date}) => {
        appendSnapshot({
          text: data.text,
          cameraId: camera.id,
          classified: data.classified,
          summary: data.summary,
          timeCaptured: data.timeCaptured
        })
        setSelectedCamera({...camera})
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [])
  

  return (
    <>
    <div className={`cam_res ${selectedCamera && selectedCamera.id === camera.id ? "active" : ""} relative poppins mb-[20px]`} onClick={() => {
      setSelectedCamera({...camera})
    }}>
      <div className="flex justify-between z-[11]">
        <div className="font-[400] text-[.9rem] flex flex-col">
          {camera.location} <br />
          <span className="text-[#b9d2ff]">{camera.resolution}</span>  
        </div>
       <div className="flex items-center gap-x-[20px]">
        {
          camera.control.recording ?
          <Puff
            visible={true}
            height="15"
            width="15"
            color="red"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
          /> :
          <></>
        }
        {
          camera.control.audio ?
          <Audio
            height="15"
            width="15"
            color="#4fa94d"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          /> : <></>
        }
        
          
        </div> 
        
      </div>
      <div className="w-full h-full">
         <video crossOrigin="anonymous" className="h-[inherit] w-[inherit]" ref={videoRef} autoPlay={true} loop controlsList={"nodownload, nofullscreen"}>
          <source src={camera.videoFeed} ref={videoSrcRef} /> 
         </video>
        {/* <img src={camera.snapshots.at(-1)?.path} className="z-[9] h-[inherit] w-[inherit]" />  */}
       
      </div>
      <div className="absolute z-[11] flex gap-x-[10px] left-[10px] bottom-[20px]">
        <ControlButton
          control={{
            icon: <BiSolidVideoRecording />,
            click: () => {
              setCameraControl({
                control: {recording: !camera.control.recording},
                cameraId: camera.id
              })
            }
          }}
        />
        <ControlButton
          control={{
            icon: camera.control.audio ? <AiOutlineAudio  /> : <AiOutlineAudioMuted />,
            click: () => {
              setCameraControl({
                control: {audio: !camera.control.audio},
                cameraId: camera.id
              })
            }
          }}
        />
      </div>
    </div>
    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    {/* <img ref={imgRef} width="500px"  height="400px" /> */}

    </>
  )
}

export default Surveillance