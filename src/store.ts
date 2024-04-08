import {create} from "zustand"
import { Alert, Camera, DetectedImage, AppAlert } from "./types";

type Store = {
  alerts: Alert[] | null;
  cameraList: Camera[] | null;
  setAlert: (alert: Alert) => void;
  setSelectedCamera: (camera: Camera) => void;
  selectedCamera: Camera | null;
  detectedImages: DetectedImage[] | null;
  setDetectedImage: (detectedImage: DetectedImage) => void;
  setCameraControl: (data: {cameraId: string; control: {audio: boolean} | {recording: boolean}}) => void;
  appendSnapshot: (data: {cameraId: string; text: string; classified: [], summary: string, timeCaptured: Date}) => void;
  appAlert: AppAlert | null;
  setAppAlert: (data: AppAlert) => void
};

const useStore = create<Store>((set, get) => ({
  appAlert: null,
  setAppAlert({type, message}) {
    set({appAlert: {type, message}})
  },
  alerts: null,
  cameraList: [
    {
      id: "camId1",
      name: "nvidia rays",
      location: "Video feed",
      resolution: "360-34 PS",
      videoFeed: "https://res.cloudinary.com/duqny6afm/video/upload/v1712368523/beyonglense/Action_Short_Film_-_EXTREME_VENGEANCE_zvbxaz.mp4",
      snapshots: null,
      control: {
        recording: false,
        audio: false
      }
    },
    
  ],
  selectedCamera: null,
  setSelectedCamera(camera) {
    set({selectedCamera: camera})
  },
  setAlert(alert) {
    const alerts = get().alerts
    alerts?.push(alert)
    set({alerts})
  },
  detectedImages: null,
  setDetectedImage(detectedImage) {
    const all = get().detectedImages
    if (!all) {
      set({detectedImages: [detectedImage]})
      return
    }
    const findDetected = all.findIndex(i => i.cameraId == detectedImage.cameraId)
    if (findDetected !== -1) {
      all[findDetected] = detectedImage
    } else {
      all.push(detectedImage)
    }
    set({detectedImages: all})
  },
  setCameraControl({cameraId, control}) {
    const all = get().cameraList
    if (!all) return
    const findCamera = all.findIndex(i => i.id === cameraId)
    all[findCamera].control = {...all[findCamera].control, ...control}
    set({cameraList: all})
  },
  appendSnapshot({cameraId, text, classified, summary, timeCaptured}) {
    const cameraList = get().cameraList
    if (!cameraList) return
    const findCamera = cameraList.findIndex(i => i.id === cameraId)
    const newSnapshot = {
      timeCaptured,
      description: {
        text,
        classified,
        summary
      }
    }
    if (!cameraList[findCamera].snapshots) {
      cameraList[findCamera].snapshots = [newSnapshot]
    } else {
      cameraList[findCamera].snapshots.push(newSnapshot)
    }
    console.log(cameraList)
    set({cameraList})
  }
}))

export {
  useStore
}