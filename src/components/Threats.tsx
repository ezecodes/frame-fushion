import { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useStore } from "../store";

function Threats() {
  const selectedCamera = useStore(state => state.selectedCamera)
  const [snapshotDescription, setSnapshotDescription] = useState<null | {
    threat_level: string; 
    summary: string | undefined, 
    timeCaptured: Date
  }>(null)
  useEffect(() => {
    const timeCaptured = selectedCamera?.snapshots?.at(-1)?.timeCaptured
    const lastDescription = selectedCamera?.snapshots?.at(-1)?.description
    if (!lastDescription) return
    const positiveLabel: any = lastDescription.classified.find(i => i.label === "POSITIVE") 
    const negativeLabel: any = lastDescription.classified.find(i => i.label === "NEGATIVE")
    let threat_level = ""
    if (positiveLabel.score > negativeLabel.score) {
      threat_level = "low"
    } else {
      const diff = negativeLabel.score - positiveLabel.score
      if (diff > 0.05) {
        threat_level = "critical"
      } else {
        threat_level = "low"
      }
    } 
    setSnapshotDescription({timeCaptured: new Date(timeCaptured), threat_level, summary: selectedCamera.snapshots?.at(-1).description.summary})
  }, [selectedCamera?.snapshots?.at(-1)])

  
  if (!snapshotDescription) return <></>
  return (
    <aside className="text-[white] sidebars raleway right-0 z-[10] bg-[#32363b]  shadow-2xl">
      <div className="">
        <div className="flex items-center pb-3">
          <span className="mx-3"> <IoInformationCircleOutline /> </span>
          <span className="text-[.85rem]">  {selectedCamera.location} </span>
        </div>
        <div className="threats_info">
          <div className="bg-raisinBlack">
            <span> Detected </span>
            <span> 
              {snapshotDescription?.timeCaptured.toLocaleTimeString()} 
            </span>
          </div>
          <div className={snapshotDescription?.threat_level === "critical" ? "t_animate" : "bg-raisinBlack"}>
            <span> Threat level </span>
            <span
              
            > 
              {snapshotDescription?.threat_level} 
            </span>
          </div>
          {/* <div className="bg-raisinBlack">
            <span> People present </span>
            <span> {snapshotDescription?.threat_level} </span>
          </div> */}
        </div>
        <div className="px-2 text-[.9rem] py-4">
          <p className=""> {snapshotDescription?.summary}</p>
          
        </div>
      </div>
      
    </aside>
  )
}

export default Threats