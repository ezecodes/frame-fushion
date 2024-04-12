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
import { GoAlertFill } from "react-icons/go";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlinePauseCircleOutline } from "react-icons/md";
import { io } from "socket.io-client";
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://socs.onrenderer.com",
  {
    autoConnect: false
  }
)

function SelectedOngoingAnalysis() {
  const ongoingAnalysis = useStore(state => state.ongoingAnalysis)
  const setSelectedSnapshot = useStore(state => state.setSelectedSnapshot)
  const selectedSnapshot = useStore(state => state.selectedSnapshot)

  return (
    <aside className="fixed z-[20] left-[200px] px-5 w-[85vw]  animate__animated animate__slideInUp bottom-0 h-[90px] bg-[#252d37]">
      <div className="w-[95%]  overflow-x-scroll  gap-x-[20px] grid-flow-col grid items-center h-full">
        {
          ongoingAnalysis.snapshots?.length > 0 &&
          ongoingAnalysis.snapshots.map(item => {
            const positiveLabel = item.description.classified.find(i => i.label === "POSITIVE")
            const negativeLabel = item.description.classified.find(i => i.label === "NEGATIVE")

            const posDiff = positiveLabel.score - negativeLabel.score
            const negDiff = negativeLabel.score - positiveLabel.score
            

            return (
              <div  key={item.id} onClick={() => setSelectedSnapshot({snapshot: item, videoId: ongoingAnalysis.videoId})} className={`w-[100px] cursor-pointer relative h-[80px] animate__animated animate__slideInLeft ${selectedSnapshot && selectedSnapshot.snapshot && selectedSnapshot.snapshot.id === item.id ? "active" : ""} `}>
                <img key={item.id} src={item.path} className="w-full h-full " />
                { negDiff > posDiff ?
                  <GoAlertFill className="absolute red top-[30px] left-[40px]" />
                  : <></>
                }
              </div>
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

function SnapshotDetail({ closeModal, snapshot, videoId}: {closeModal: () => void, snapshot: Snapshot, videoId: string}) {
  const setControlledPlaybackTime = useStore(state => state.setControlledPlaybackTime)

  return (
    <div className="fixed modal_overlay ">
      <div className="modal px-4 py-4 animate__animated animate__zoomIn rounded-sm">
        <div className="flex justify-between mb-[30px]">
          <h2>Selected snapshot</h2>
          <IoMdCloseCircleOutline onClick={closeModal} className="text-[1.3rem] cursor-pointer" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-x-[30px]"> 
            <div className="">
              <img src={snapshot.path} className="w-[250px] h-full" />
            </div>
            <div className="my-5 text-[2rem]">
              <MdOutlineSlowMotionVideo 
                className="cursor-pointer" 
                onClick={() => {
                  setControlledPlaybackTime(videoId, snapshot.playbackTime)
                }}
              />
            </div>
          </div>
            
          <div className="text-[.8rem] my-5">
            <span> {snapshot.description.summary} </span>
          </div>
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSrcRef = useRef(null)
  const setOngoingAnalysis = useStore(state => state.setOngoingAnalysis)
  const ongoingAnalysis = useStore(state => state.ongoingAnalysis)
  const setAppAlert = useStore(state => state.setAppAlert)
  const setAnalysisSnapshots = useStore(state => state.setAnalysisSnapshots)
  const updateSnapshots = useStore(state => state.updateSnapshots)
  const updateVideoControls = useStore(state => state.updateVideoControls)
  const intervalRef = useRef(null)
  const nextTick = useRef(0)
  const snapshotRef = useRef([])
  const totalFrames = useRef(25)
  const stepsCount = useRef(0)
  
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

  async function* fetchAnalysis() {
    let currentPos = 0
    while (currentPos < snapshotRef.current.length) {
      try {
        const result = await fetch("http://127.0.0.1:8787/api/secured/describe", {
          method: 'POST',
          body: JSON.stringify({imageDataURL: snapshotRef.current[currentPos].path, snapshotId: snapshotRef.current[currentPos].id}),
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        currentPos += 1
        const jsonBody = await result.json()
        yield jsonBody
      } catch (err) {
        console.error(err)
      }
      
    }
  }

  async function analyseSnapshots() {
    for await (let result of fetchAnalysis()) {
      if (result.success) {
        const findSnapshot = snapshotRef.current.find(i => i.id === result.data.snapshotId)
        if (findSnapshot) {
          findSnapshot.description = {
            text: result.data.summary,
            summary: result.data.summary,
            classified: result.data.classified
          }
          updateSnapshots(findSnapshot)
        }
      }
    }
  }
  function sendSnapshots() {
    
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
    videoRef.current.pause()
    stepsCount.current = Math.floor(videoRef.current.duration / totalFrames.current)
    setOngoingAnalysis({videoId: video.id, timeStarted: new Date()})
    intervalRef.current = setInterval(() => {
      videoRef.current.currentTime = nextTick.current
      const snapshot = {
        path: getDataUrl(),
        id: uuid(),
        playbackTime: videoRef.current.currentTime,
        timeCaptured: new Date(),
      }
      snapshotRef.current.push(snapshot)
      if (nextTick.current > videoRef.current.duration) {
        clearInterval(intervalRef.current)
        // analyseSnapshots()
        sendSnapshots()
        return
      }
      nextTick.current += stepsCount.current
      
    }, 200)
    
  }


  function handeControls(controls: {playing: boolean}) {
    if (ongoingAnalysis && ongoingAnalysis.videoId === video.id && !ongoingAnalysis.timeEnded) {
      setAppAlert({type: "warn", message: "Current analysis is still in progress"})
      return 
    }
    updateVideoControls(video.id, controls)
  }

  useEffect(() => {
    if (video.controls.playing) videoRef.current.play()
    else videoRef.current.pause()
  }, [video.controls.playing])

  useEffect(() => {
    if (typeof video.lastControlledPlaybackTime === "number") {
      videoRef.current.currentTime = video.lastControlledPlaybackTime
    }
  }, [video.lastControlledPlaybackTime])

  return (
    <div className={`cam_res ${isClicked ? "active" : ""} rounded-md relative poppins mb-[20px]`} onClick={() => {
      click(video.id)
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
      <div className="absolute z-[11] flex gap-x-[10px] left-[10px] bottom-[20px]">
        <button onClick={analyseVideo} className="control_btn">
          <BiAnalyse title="Analyse video" className={ongoingAnalysis?.videoId === video.id ? "rotate-center" : ""} />
        </button>
        <button className="control_btn">
          {
            video.controls.playing ? 
            <MdOutlinePauseCircleOutline onClick={() => handeControls({playing: false})} />
            : <FaRegCirclePlay onClick={() => handeControls({playing: true})} />
          }
        </button>
          
        {/*<button onClick={() => {}} className="control_btn">
          <AiOutlineAudio title="Include audio in analysis" />
        </button>*/}
      </div>
      { ongoingAnalysis && ongoingAnalysis.videoId === video.id ?
        <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full bg-[rgba(255,255,255,.4)]">
          
        </div> :
        <></>
      }
    </div>
  )
}

function Analysis() {
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
  const selectedSnapshot = useStore(state => state.selectedSnapshot)
  const setSelectedSnapshot = useStore(state => state.setSelectedSnapshot)
  const socketState = useRef({connected: false})

  function onSocketConnect() {
    socketState.current.connected = true
    console.log("hello")
  }
  function onSocketDisconnect() {
    socketState.current.connected = false

  }
  function analysisEvent() {

  }
  useEffect(() => {
    socket.connect()
    socket.on("connect", onSocketConnect)
    socket.on("disconnect", onSocketDisconnect)
    socket.on("analysis", analysisEvent)
    
    socket.emit("analysis", "hi")

    return () => {
      socket.off('connect', onSocketConnect);
      socket.off('disconnect', onSocketDisconnect);
      socket.off('analysis', analysisEvent);
    }
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
        controls: {
          playing: false
        }
      })
    }
    
    
  }
  useEffect(() => {

  }, [ongoingAnalysis?.videoId])
  
  return (
    <>
    <div className="px-[40px] py-[30px] animate__animated animate__fadeIn flex-1 justify-between mx-[auto] poppins text-[white] ">
      <div className="">
        {/* <DashHeader text={"Analysis"} /> */}
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
      
    {
      ongoingAnalysis && ongoingAnalysis.snapshots && ongoingAnalysis.snapshots.length > 0 ?
        <SelectedOngoingAnalysis />
      : <></>
    }
    </div>
    {
      selectedCamera && 
      <Threats />
    }
    {
      selectedSnapshot ? 
      <SnapshotDetail 
        closeModal={() => setSelectedSnapshot(null)} 
        snapshot={selectedSnapshot.snapshot}
        videoId={selectedSnapshot.videoId} 
      /> 
      : <></> 
    }
    </>
  )
}

export default Analysis