import { BiError } from "react-icons/bi";
import { format, formatDistanceToNow } from 'date-fns';
import { MdCrisisAlert } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";

import Searchbar from "../components/Searchbar"
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { ActivityLog } from "../types";
import DashHeader from "../components/DashHeader";

function LogManager({activityLogs, selectedLevels}: {
  activityLogs: ActivityLog[],
  selectedLevels: ActivityLog[]
}) {
  
  if (activityLogs) {
    return (
      <div>
        {
          activityLogs.map((log => {
            return (
              <Item 
                key={log.id}
                id={log.id}
                threatLevel={log.threatLevel}
                thumbnail={log.thumbnail}
                title={log.title}
                lastTimeCaptured={log.lastTimeCaptured}
              />
            )
          }))
        }
      </div>
    )
  }
  if (selectedLevels) {
    <div>
      {
        selectedLevels.map((log => {
          return (
            <Item 
              key={log.id}
              id={log.id}
              threatLevel={log.threatLevel}
              thumbnail={log.thumbnail}
              title={log.title}
              lastTimeCaptured={log.lastTimeCaptured}
            />
          )
        }))
      }
    </div>
  }
          
  
}

function ActivityLogs() {
  const activityLogs = useStore(state => state.activityLogs)
  const [selecetedLevel, setSelectedLevel] = useState<"low" | "critical" | null>(null)
  const [selectedLevels, setLogs] = useState<ActivityLog[] | null>(null)

  function handleLevel(level: "low" | "critical") : void {
    setSelectedLevel(level)
    if (!activityLogs || activityLogs.length === 0) return
    setLogs(activityLogs.filter(log => log.threatLevel === level))
    console.log(selectedLevels)
  }
  return (
    <section className="px-[40px] py-[30px] animate__animated animate__fadeIn">
      {/* <DashHeader text={"activity logs"} /> */}
      <div>
        <Searchbar />
      </div>

      {
        !activityLogs ?
        <div className="subtext my-[60px]"><h2>Your activity logs will show here</h2></div>
        : <div>
          <div className="mt-[50px] mb-[30px]">
            <button 
              className={`log_level ${selecetedLevel === "low" ? "bg-[#575a5f]" : "bg-[#32363b]"} `} 
              onClick={() => {handleLevel("low")}}
            >
              Low
            </button>
            <button 
              className={`log_level ${selecetedLevel === "critical" ? "bg-[#575a5f]" : "bg-[#32363b]"} `} 
              onClick={() => {handleLevel("critical")}}
            >
              Critical
            </button>
          </div>
          <div className="my-[30px]">
            {
              !activityLogs ? 
              "Activity Logs will show up here" :
              <LogManager 
                activityLogs={activityLogs}
                selectedLevels={selectedLevels}

              />
            }
          </div>
        </div>
      }

    </section>

  )
}

function Item({threatLevel, thumbnail, title, lastTimeCaptured}: ActivityLog) {
  const [retrospectTime, setRetrospectTime] = useState("")
  const [dateFormat, setDateFormat] = useState("")
  const [labelColor, setLabelColor] = useState<"green" | "red" | "#24272B">("#24272B")

  function formatDate(): string[] {
    const startDate: Date | any = new Date(lastTimeCaptured)
    const endDate: Date | any = new Date()
    const difference = endDate - startDate;
    const getFormatDate = format(startDate, "d MMM yyyy 'at' HH:mm")

    let formattedDifference: string;
    if (difference < 60000) { // Less than a minute
      formattedDifference = 'just now';
    } else if (difference < 3600000) { // Less than an hour
      formattedDifference = formatDistanceToNow(startDate, { addSuffix: true, includeSeconds: true });
    } else if (difference < 172800000) { // Less than 2 days
      formattedDifference = formatDistanceToNow(startDate, { addSuffix: true });
    } else {
      // If the difference is more than 2 days, you can format the start date in a custom way
      formattedDifference = format(startDate, "d MMM yyyy");
    }
    return [formattedDifference, getFormatDate]
  }

  useEffect(() => {
    setRetrospectTime(formatDate()[0])
    setDateFormat(formatDate()[1])
    if (threatLevel === "low") setLabelColor("green")
    if (threatLevel === "critical") setLabelColor("red")
  }, [])

  return (
    <div className="bg-[#303339] animate__animated animate__fadeInUp mb-2 flex justify-around items-center text-[white] rounded-sm gap-x-[10px] w-[550px] h-[75px]" style={{borderLeft: `5px solid ${labelColor} `}}>
      <div className="">
        <img src={thumbnail} className="w-[inherit] h-[inherit]" />
      </div>
      <div className="flex justify-center flex-col">
        <span className="font-[400] text-[.9rem] mb-1">{title}</span>
        <span className="text-[#e9e9e9] text-[.85rem] ">
          This event happened 
          <span className="underline ml-2 cursor-pointer">{retrospectTime}, {dateFormat}</span>
        </span>
      </div>
      <div>
        {
          threatLevel === "low" ? 
          <IoInformationCircleOutline className="text-[1.5rem]" style={{color: labelColor}} />
          : <BiError style={{color: labelColor}} className="text-[1.5rem]" />
        }
      </div>
      <div>
        <MdCrisisAlert className="text-[1.5rem]"  />
      </div>
       
    </div>
  )
}

export default ActivityLogs