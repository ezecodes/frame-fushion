import { useEffect, useState, useRef } from "react";
import { useStore } from "../store"
import {  StoredVideo, Snapshot } from "../types";
import { TbLayoutList } from "react-icons/tb";
import { BsColumnsGap } from "react-icons/bs";
import Threats from "../components/Threats"
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import Searchbar from "../components/Searchbar"
import { IoMdCloseCircleOutline } from "react-icons/io";
import {v4 as uuid} from "uuid"
import { BiAnalyse, BiDotsVertical } from "react-icons/bi";

function SelectedOngoingAnalysis() {
  const ongoingAnalysis = useStore(state => state.ongoingAnalysis)
  
  return (
    <aside className="fixed z-[20] left-[200px] px-5 w-[85vw]  animate__animated animate__slideInUp bottom-0 h-[90px] bg-[#252d37]">
      <div className="w-[95%] overflow-x-scroll flex gap-x-[20px] items-center h-full">
        {
          ongoingAnalysis.snapshots?.length > 0 &&
          ongoingAnalysis.snapshots.map(item => {
            return (
              <img key={item.id} src={item.path} className="w-[100px] h-[80px]" />
            )
          })
        }
      </div>
      <button className="absolute right-[30px] px-1  py-1 bottom-[30px]">
        <BiDotsVertical />
        {/* <div className="">
          <span></span>
        </div> */}
      </button>
    </aside>
  )
}

function AnalysisPopup() {
  return (
    <div className="">

    </div>
  )
}

function CameraManager({ closeModal}) {
  return (
    <div className="fixed modal_overlay ">
      <div className="modal px-4 py-4 animate__animated animate__zoomIn rounded-sm">
        <div className="flex justify-between">
          <h2>Add Camera</h2>
          <IoMdCloseCircleOutline onClick={closeModal} className="text-[1.3rem] cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

function UploadedVideo(
  {
    video,
    click, 
    isClicked,
  }: { 
    video: StoredVideo;
    isClicked: boolean; 
    click: (id: string) => void,
  }
) {
  const videoRef = useRef(null)
  const videoSrcRef = useRef(null)
  const setOngoingAnalysis = useStore(state => state.setOngoingAnalysis)
  const ongoingAnalysis = useStore(state => state.ongoingAnalysis)
  const setAppAlert = useStore(state => state.setAppAlert)
  const setAnalysisSnapshots = useStore(state => state.setAnalysisSnapshots)
  const updateSnapshots = useStore(state => state.updateSnapshots)
  const intervalRef = useRef(null)
  const nextTick = useRef(0)
  
  function getDataUrl(tick: number) : string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { videoWidth, videoHeight } = videoRef.current;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    const frameDataUrl = canvas.toDataURL('image/png');
    
    return frameDataUrl
  }

  function analyseVideo() {
    if (ongoingAnalysis && !ongoingAnalysis.timeEnded) {
      setAppAlert({type: "error", message: "Current running analysis must be cancelled to begin a new one"})
      return 
    }
    if (ongoingAnalysis && ongoingAnalysis.timeEnded) {
      setAppAlert({type: "warn", message: "Please download previous analysis result to begin a new one."})
      return 
    }
    setOngoingAnalysis({videoId: video.id, timeStarted: new Date()})
    intervalRef.current = setInterval(() => {
      videoRef.current.currentTime = nextTick.current
      const snapshot = {
        path: getDataUrl(nextTick.current),
        id: uuid(),
        playbackTime: videoRef.current.currentTime,
        timeCaptured: new Date(),
      }
      updateSnapshots(snapshot)
      if (nextTick.current > videoRef.current.duration) {
        clearInterval(intervalRef.current)
        return
      }
      nextTick.current += 10
      
    }, 1000)
    
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className={`cam_res ${isClicked ? "active" : ""} rounded-md relative poppins mb-[20px]`} onClick={() => {
      click(video.id)
    }}>
      <div className="flex justify-between z-[11]">
        <div className="font-[400] text-[.9rem] flex flex-col">
          {video.name} <br />
          <span className="text-[#b9d2ff]">{video.type} &nbsp; {(video.size / (1024 * 1024)).toFixed(2)}mb</span>  
        </div>
        
      </div>
      <div className="w-full h-full">
         <video crossOrigin="anonymous" autoFocus className="h-[inherit] w-[inherit]" ref={videoRef} controlsList={"nodownload, nofullscreen"}>
            <source src={video.path} ref={videoSrcRef} /> 
         </video>
      </div>
      <div className="absolute z-[11] flex gap-x-[10px] left-[10px] bottom-[20px]">
        <button onClick={analyseVideo} className="control_btn">
          <BiAnalyse title="Analyse video" className={ongoingAnalysis?.videoId === video.id ? "rotate-center" : ""} />
        </button>
        <button onClick={() => {}} className="control_btn">
          <AiOutlineAudio title="Include audio in analysis" />
        </button>
      </div>
      {/* { ongoingAnalysis && ongoingAnalysis.videoId === video.id ?
        <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full bg-[rgba(255,255,255,.4)]">
          
        </div> :
        <></>
      } */}
    </div>
  )
}

function Surveillance() {
  const cameraList = useStore(state => state.cameraList)
  const [layout, setLayout] = useState<"column" | "row">("row")
  const selectedCamera = useStore(state => state.selectedCamera)
  const storedVideos = useStore(state => state.storedVideos)
  const storeVideo = useStore(state => state.storeVideo)
  const ongoingAnalysis = useStore(state => state.ongoingAnalysis)
  const [showModal, setModal] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const setAppAlert = useStore(state => state.setAppAlert)
  const tempVidRef = useRef<HTMLVideoElement>(null)
  // const workerRef = useRef(null)

  useEffect(() => {
    // const worker = new Worker("../worker.js");
    // workerRef.current = worker
  }, [])

  function isDuplicate(name: string) : boolean {
    if (!storedVideos) return false
    const findIdx = storedVideos.findIndex(i => i.name === name)
    if (findIdx !== -1) return true
    return false
  }

  function handleVideoUpload(event: any) {
    const file = event.target.files[0];
    if (isDuplicate(file.name)) {
      setAppAlert({type: "error", message: "This video has already been uploaded"})
    } else {
      const url = URL.createObjectURL(file);
      tempVidRef.current.src = url
      storeVideo({
        duration: tempVidRef.current.duration,
        id: uuid(),
        name: file.name,
        path: url,
        size: file.size,
        type: file.type,
      })
    }
    
    
  }
  useEffect(() => {

  }, [ongoingAnalysis?.videoId])
  
  return (
    <>
    <div className="px-[40px] py-[30px] animate__animated animate__fadeIn flex-1 justify-between mx-[auto] poppins text-[white] ">
      <div className="">
        {/* <DashHeader text={"surveillance"} /> */}
        <div className="flex justify-between mb-[30px]">
          <div className="flex gap-x-[10px]">
            <Searchbar />
            <button className="text-[#8b8b8b] text-[1.2rem] flex items-center gap-x-[10px]">
              <TbLayoutList onClick={() => setLayout("column")} className={`${layout === "column" ? "text-[white]" : ""}`} />
              <BsColumnsGap onClick={() => setLayout("row")} className={`${layout === "row" ? "text-[white]" : ""}`} />
            </button>
          </div>

          <div className="flex gap-x-[20px]">
            { (function() {
              if (!cameraList && !storedVideos) {
                return <></>
              }
              if (cameraList || storedVideos) {
                return (
                  <div className="flex items-center gap-x-[20px]">
                    <button className="app_button mt-5" onClick={() => setModal(true)}>Add Camera</button>
                    <label className="app_button mt-5" htmlFor="vidUpload">Upload video</label>
                    <input type="file" accept="video/*" id="vidUpload" className="hidden" onChange={handleVideoUpload} />
                  </div>
                )
              }
            }())}
          </div>
          
        </div>
        <div className={`cam_res_wrap ${layout === "column" ? "column" : "row"} `}>
          
          {
            storedVideos && storedVideos.length > 0 ?
            storedVideos.map((video) => {
              return (
                <UploadedVideo 
                  video={video}
                  click={id => setSelectedVideo(id)}
                  key={video.id}
                  isClicked={selectedVideo === video.id}
                />
              )
            })
            : <></>
          }
        </div>
        <div>
          {
            !cameraList && !storedVideos ?
            <div className="subtext rounded-md flex justify-center mt-[50px] bg-[#161a1e] w-[400px] flex flex-col text-center items-center mx-[auto] py-5 px-4">
              <h2>No camera? Upload a video and watch surveillance shield in action.</h2>

              <div className="flex items-center gap-x-[20px]">
                <button className="app_button mt-5" onClick={() => setModal(true)}>Add Camera</button>
                <label className="app_button mt-5" htmlFor="vidUpload">Upload video</label>
                <input type="file" accept="video/*" id="vidUpload" className="hidden" onChange={handleVideoUpload} />
              </div>
              
            </div>
            : <></>
          }
          
        </div>
      </div>
      <video ref={tempVidRef} style={{display: 'none'}}></video>
      
    {
      ongoingAnalysis && ongoingAnalysis.snapshots?.length > 0 ?
        <SelectedOngoingAnalysis />
      : <></>
    }
    </div>
    {
      selectedCamera && 
      <Threats />
    }
    {
      showModal ? 
      <CameraManager closeModal={() => setModal(false)} /> 
      : <></> 
    }
    </>
  )
}

export default Surveillance