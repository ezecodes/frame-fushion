import {create} from "zustand"
import { Alert, Camera, DetectedImage, AppAlert, ActivityLog, OnboardChoice } from "./types";

type Store = {
  alerts: Alert[] | null;
  activityLogs: ActivityLog[] | null;
  cameraList: Camera[] | null;
  setAlert: (alert: Alert) => void;
  setSelectedCamera: (camera: Camera) => void;
  selectedCamera: Camera | null;
  detectedImages: DetectedImage[] | null;
  setDetectedImage: (detectedImage: DetectedImage) => void;
  setCameraControl: (data: {cameraId: string; control: {audio: boolean} | {recording: boolean}}) => void;
  appendSnapshot: (data: {cameraId: string; text: string; classified: [], summary: string, timeCaptured: Date}) => void;
  appAlert: AppAlert | null;
  setAppAlert: (data: AppAlert) => void;
  onboardingChoices: OnboardChoice[] | null;
  setOnboardChoice: (data: OnboardChoice) => void
};

const useStore = create<Store>((set, get) => ({
  appAlert: null,
  onboardingChoices: null,
  setOnboardChoice(data) {
    const find = get().onboardingChoices
    if (!find) {
      set({onboardingChoices: [data]})
    } else {
      const idx = find.findIndex(i => i.question === data.question)
      if (idx === -1) {
        set({onboardingChoices: [...get().onboardingChoices, data]})
      } else {
        find[idx].option = data.option
        set({
          onboardingChoices: find
        })
      }
    }
    console.log(get().onboardingChoices)
  },
  setAppAlert({type, message}) {
    set({appAlert: {type, message}})
  },
  alerts: null,
  activityLogs: null,
  cameraList: null,
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