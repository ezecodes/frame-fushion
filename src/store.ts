import {create} from "zustand"
import { Alert, Camera, DetectedImage, AppAlert, ActivityLog, OnboardChoice, StoredVideo, OngoingAnalysis, Snapshot } from "./types";

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
  appAlert: AppAlert | null;
  setAppAlert: (data: AppAlert | null) => void;
  onboardingChoices: OnboardChoice[] | null;
  setOnboardChoice: (data: OnboardChoice) => void;
  storeVideo: (data: StoredVideo) => void;
  updateVideo: (videoId: string, update: any) => void;
  storedVideos: StoredVideo[] | null;
  ongoingAnalysis: OngoingAnalysis | null;
  setOngoingAnalysis: (data: OngoingAnalysis) => void;
  updateAnalysisSingleSnapshot: ({snapshotId, videoId}, snapshot: Snapshot) => void;
  setAnalysisSnapshots: (snapshots: Snapshot[]) => void;
  updateSnapshots: (snapshot: Snapshot) => void;
  setSelectedSnapshot: (snapshot: Snapshot) => void;
  selectedSnapshot: snapshot | null;
};

const useStore = create<Store>((set, get) => ({
  appAlert: null,
  onboardingChoices: null,
  storedVideos: null,
  ongoingAnalysis: null,
  selectedSnapshot: null,
  setSelectedSnapshot(snapshot) {
    set({selectedSnapshot: snapshot})
  },
  updateAnalysisSingleSnapshot({snapshotId, videoId}, snapshot) {
    const item = get().ongoingAnalysis
    if (!item || item.videoId !== videoId) return
    const findIdx = item.snapshots.findIndex(i => i.id === snapshotId)
    item.snapshots[findIdx] = {...snapshot}
    set({ongoingAnalysis: item})
  },
  updateSnapshots(snapshot) {
    const snapshots = get().ongoingAnalysis?.snapshots || []
    set({
      ongoingAnalysis: {
        ...get()?.ongoingAnalysis,
        snapshots: [...snapshots, snapshot]
      }
    })
  },
  setAnalysisSnapshots(snapshots) {
    const item = get().ongoingAnalysis
    if (!item) return
    item.snapshots = snapshots
    set({
      ongoingAnalysis: item
    })
  },
  setOngoingAnalysis(data) {
    set({
      ongoingAnalysis: data
    })
  },
  storeVideo(data) {
    let videos = get().storedVideos
    if (!videos) {
      set({storedVideos: [data]})
    } else {
      set({storedVideos: [...videos, data]})
    }
  },
  updateVideo(videoId, update) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    videos[idx] = {...videos[idx], ...update}
    set({
      storedVideos: videos
    })
  },
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
  setAppAlert(data) {
    set({appAlert: data})
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
}))

export {
  useStore
}