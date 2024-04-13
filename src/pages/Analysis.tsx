import { useEffect, useState, useRef } from "react";
import { useStore } from "../store"
import {  StoredVideo, Snapshot } from "../types";
import { TbLayoutList } from "react-icons/tb";
import { BsColumnsGap } from "react-icons/bs";
import Chat from "../components/Chat"
import Searchbar from "../components/Searchbar"
import {v4 as uuid} from "uuid"
import { BiAnalyse } from "react-icons/bi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlinePauseCircleOutline } from "react-icons/md";
import { MdSummarize } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

function UploadedVideo(
  {
    video,
    click, 
    isClicked,
  }: { 
    video: StoredVideo;
    isClicked: boolean; 
    click: (video: StoredVideo) => void,
  }
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSrcRef = useRef(null)
  const setAppAlert = useStore(state => state.setAppAlert)
  const fetchFunction = useStore(state => state.fetchFunction)
  const updateVideoProperty = useStore(state => state.updateVideoProperty)
  const apiBase = useStore(state => state.apiBase)
  const intervalRef = useRef(null)
  const nextTick = useRef(0)
  const snapshotRef = useRef([])
  const totalFrames = useRef(4)
  const stepsCount = useRef(0)
  const pollingIntervalRef = useRef(null)
  const [showSumm, setSummary] = useState(false)
  
  function getDataUrl() : string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const { videoWidth, videoHeight } = videoRef.current;

    canvas.width = videoWidth;
    canvas.height = videoHeight;
    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    const frameDataUrl = canvas.toDataURL('image/png');
    
    return frameDataUrl
  }


  async function sendSnapshot(snapshots: Snapshot[]) {
    const jSon = await fetchFunction(
      "/analysis/begin",
      {
        snapshots,
        video: {
          path: video.path,
          name: video.name,
          type: video.type,
          size: video.size,
          duration: video.duration,
        }
      },
      "post",
      true
    )
    
    if (jSon.success) {
      setAppAlert({message: "Analysis started", type: "info"})
      
      pollingIntervalRef.current = setInterval(async () => {
        const poolAnalysis = await fetchFunction(
          apiBase + `/analysis/status/${jSon.data.videoId}`,
          null,
          "get",
          true
        );
        if (poolAnalysis.success) {
          updateVideoProperty(video.id, {summary: poolAnalysis.data.summary})
          setSummary(true)
          setAppAlert({message: "Analysis completed", type: "info"})
          clearInterval(pollingIntervalRef.current)
        }
      }, 3000)
    } else {
      updateVideoProperty(video.id, {analysing: false})
    }
  }

  function analyseVideo() {
    if (video.summary) {
      setSummary(state => !state)
      return
    }
    if (video.analysing ) {
      setAppAlert({type: "error", message: "Current running analysis must be cancelled to begin a new one"})
      return 
    }
    videoRef.current.pause()
    stepsCount.current = Math.floor(videoRef.current.duration / totalFrames.current)

    updateVideoProperty(video.id, {analysing: true})

    intervalRef.current = setInterval(() => {
      videoRef.current.currentTime = nextTick.current
      const snapshot = {
        path: getDataUrl(),
        id: uuid(),
        playbackTime: videoRef.current.currentTime,
        timeCaptured: new Date(),
      }
      snapshotRef.current.push(snapshot)
      if (snapshotRef.current.length === totalFrames.current) {
        sendSnapshot(snapshotRef.current)
        clearInterval(intervalRef.current)
        return
      }
      nextTick.current += stepsCount.current
      
    }, 200)
    
  }


  function handeControls(controls: {playing: boolean}) {
    if (video.analysing) {
      setAppAlert({type: "warn", message: "Current analysis is still in progress"})
      return 
    }
    updateVideoProperty(video.id, controls)
  }

  useEffect(() => {
    if (video.controls.playing) videoRef.current.play()
    else videoRef.current.pause()
  }, [video.controls.playing])

  useEffect(() => {
    return () => clearInterval(pollingIntervalRef.current)
  }, [])

  useEffect(() => {
    if (typeof video.lastControlledPlaybackTime === "number") {
      videoRef.current.currentTime = video.lastControlledPlaybackTime
    }
  }, [video.lastControlledPlaybackTime])

  return (
    <div className={`cam_res ${isClicked ? "active" : ""} rounded-md relative poppins mb-[20px]`} onClick={() => {
      click(video)
    }}>
      <div className="flex justify-between z-[11]">
        <div className="font-[400] text-[.8rem] flex gap-y-[5px] flex-col">
          {video.name} <br />
          <span className="text-[#b9d2ff]">{video.type} &nbsp; {(video.size / (1024 * 1024)).toFixed(2)}mb</span>  
        </div>
        
      </div>
      <div className="w-full h-full">
         <video crossOrigin="anonymous" autoFocus className="h-[inherit] w-[inherit]" ref={videoRef} controlsList={"nodownload, nofullscreen"}>
            <source src={video.path} ref={videoSrcRef} /> 
         </video>
      </div>
      { video.summary && showSumm ?
        <div className="absolute w-full h-full bg-[rgba(0,0,0,.5)] animate__animated animate__flipInY">
          <p className="">{video.summary}</p>
        </div>
        : <></>
      }
      <div className="absolute z-[11] flex gap-x-[10px] w-full left-[10px] bottom-[13px]">
        <button className="control_btn absolute right-[20px] bottom-[0] text-[.9rem]">
          <BiAnalyse title="Analyse video" className={video.analysing ? "rotate-center" : ""} />
        </button>
        <button className="control_btn">
          {
            video.controls.playing ? 
            <MdOutlinePauseCircleOutline onClick={() => handeControls({playing: false})} />
            : <FaRegCirclePlay onClick={() => handeControls({playing: true})} />
          }
        </button>
        <button className="control_btn" onClick={analyseVideo} >
          <MdSummarize />
        </button>
        <button className="control_btn">
          <IoChatbubblesOutline />
        </button>
          
      </div>
    </div>
  )
}

function Analysis() {
  const [layout, setLayout] = useState<"column" | "row">("row")
  const storedVideos = useStore(state => state.storedVideos)
  const storeVideo = useStore(state => state.storeVideo)
  const setSelectedVideo = useStore(state => state.setSelectedVideo)
  const selectedVideo = useStore(state => state.selectedVideo)
  const setAppAlert = useStore(state => state.setAppAlert)
  const tempVidRef = useRef<HTMLVideoElement>(null)
  const fetchFunction = useStore(state => state.fetchFunction)
  
  const appAlert = useStore(state => state.appAlert)
  const shouldSignIn = useStore(state => state.shouldSignIn)
  const navigate = useNavigate()

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
        analysing: false,
        controls: {
          playing: false
        },
      })
    }
    
    
  }

  function onClose() {
    setAppAlert(null)
  }

  useEffect(() => {
    if (appAlert) {
      if (appAlert.type === "info") {
        toast.info(appAlert.message, {onClose})
      }
      if (appAlert.type === "warn") {
        toast.warn(appAlert.message, {onClose})
      }
      if (appAlert.type === "error") {
        toast.error(appAlert.message, {onClose})
      }
    }
  }, [appAlert])

  useEffect(() => {
    if (shouldSignIn) {
      navigate("/signin")
    }
  }, [shouldSignIn])
  
  useEffect(() => {
    async function getAnalysed() {
      const jSon = await fetchFunction(
        "/videos",
        null,
        "get",
        true
      );
      console.log(jSon)
    }
    // getAnalysed()
  }, [])
  
  
  return (
    <section className="min-h-[100vh] bg-raisinBlack animate__animated animate__fadeIn flex flex-col">
      <section className=" flex-1 flex">
    <div className="px-[40px] py-[30px] animate__animated animate__fadeIn flex-1 justify-between mx-[auto] poppins text-[white] ">
      <div className="">
        {/* <DashHeader text={"Analysis"} /> */}
        <div className="flex justify-between mb-[30px]">
          <div className="flex gap-x-[10px]">
            {/* <Searchbar /> */}
            <button className="text-[#8b8b8b] text-[1.2rem] flex items-center gap-x-[10px]">
              <TbLayoutList onClick={() => setLayout("column")} className={`${layout === "column" ? "text-[white]" : ""}`} />
              <BsColumnsGap onClick={() => setLayout("row")} className={`${layout === "row" ? "text-[white]" : ""}`} />
            </button>
          </div>
        </div>
        <div className={`cam_res_wrap ${layout === "column" ? "column" : "row"} `}>
          
          {
            storedVideos && storedVideos.length > 0 ?
            storedVideos.map((video) => {
              return (
                <UploadedVideo 
                  video={video}
                  click={selected => setSelectedVideo(selected)}
                  key={video.id}
                  isClicked={selectedVideo && selectedVideo.id === video.id}
                />
              )
            })
            : <></>
          }
          
        </div>
        <div>
          {
            !storedVideos || storedVideos.length === 0 ?
            <div className="subtext rounded-md flex justify-center mt-[50px] bg-[#161a1e] w-[400px] flex flex-col text-center items-center mx-[auto] py-5 px-4">
              <h2>Upload a video and watch Frame Fushion in action.</h2>

              <div className="flex items-center gap-x-[20px]">
                <label className="app_button mt-5" htmlFor="vidUpload">Upload video</label>
                <input type="file" accept="video/*" id="vidUpload" className="hidden" onChange={handleVideoUpload} />
              </div>
              
            </div>
            : <></>
          }
          
        </div>
      </div>
      <video ref={tempVidRef} style={{display: 'none'}}></video>
    </div>
    {
      <Chat />
    }
    <ToastContainer />

    </section>
    </section>
  )
}

export default Analysis