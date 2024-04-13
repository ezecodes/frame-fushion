import {create} from "zustand"
import { Alert, AppAlert, ActivityLog, OnboardChoice, StoredVideo } from "./types";

type Store = {
  alerts: Alert[] | null;
  setAlert: (alert: Alert) => void;

  activityLogs: ActivityLog[] | null;

  appAlert: AppAlert | null;
  setAppAlert: (data: AppAlert | null) => void;

  onboardingChoices: OnboardChoice[] | null;
  setOnboardChoice: (data: OnboardChoice) => void;
  
  storeVideo: (data: StoredVideo) => void;
  storedVideos: StoredVideo[] | null;

  selectedVideo: StoredVideo | null;
  setSelectedVideo: (video: StoredVideo) => void;

  updateVideoProperty: (videoId: string, property: any) => void;
  updateChatResponse: (videoId: string, chatId: string, response: string) => void;
  appendChat: (videoId: string, chatId: string, prompt: string) => void;

  apiBase: "http://localhost:3000" | "https://socs.onrenderer.com";

  shouldSignIn: boolean;
  setAuthState: (state: boolean) => void;

  fetchFunction: (api: string, body: any, type: "post" | "get" | "put" | "delete", withAuth: boolean) => Promise<{
    success: boolean;
    message: string;
    data?: any
  }>;
};

const useStore = create<Store>((set, get) => ({
  appAlert: null,
  onboardingChoices: null,
  storedVideos: null,
  selectedVideo: null,
 
  shouldSignIn: false,

  apiBase: process.env.NODE_ENV === "development" ? "http://localhost:3000" :  "https://socs.onrenderer.com",
  async fetchFunction(api, body, type, withAuth) {
    let authToken = localStorage.getItem('authToken') || ""
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: withAuth ? `Bearer ${authToken}` : "",
    }
    const f = await fetch(get().apiBase + api, {
      body: body ? JSON.stringify(body) : null,
      headers,
      method: type
    })
    const jSon = await f.json()
    if (f.status === 401) {
      set({appAlert: {message: jSon.message, type: "error"}})
      set({shouldSignIn: true})
    } else {
      set({shouldSignIn: false})
      
      if (f.status !== 200 && f.status !== 201) {
        set({appAlert: {message: jSon.message, type: "error"}})
      }
    }
    return jSon
  },
  setAuthState(state) {set({shouldSignIn: state})},
  storeVideo(data) {
    let videos = get().storedVideos
    if (!videos) {
      set({storedVideos: [data]})
    } else {
      set({storedVideos: [...videos, data]})
    }
  },
  updateVideoProperty(videoId, property) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    videos[idx] = {
      ...videos[idx],
      ...property
    }
    set({
      storedVideos: [...videos]
    })
  },
  appendChat(videoId, chatId, prompt) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    const chats = videos[idx].chats
    const newChat = {id: chatId, prompt, timeStamp: new Date()}
    if (!chats) videos[idx].chats = [newChat]
    else {
      videos[idx].chats.push({...newChat})
    }
    set({
      storedVideos: [...videos]
    })
  },
  updateChatResponse(videoId, chatId, response) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    const chatIdx = videos[idx].chats.findIndex(i => i.id === chatId)
    videos[idx].chats[chatIdx] = {
      ...videos[idx].chats[chatIdx],
      response
    }
    set({
      storedVideos: [...videos]
    })
  },
  setSelectedVideo(video) {
    set({selectedVideo: video})
  },
  setVideoSummary(summary, videoId) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    videos[idx].summary = summary
    set({
      storedVideos: [...videos]
    })
  },
  setControlledPlaybackTime(videoId, playbackTime) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    videos[idx].lastControlledPlaybackTime = playbackTime
    set({
      storedVideos: [...videos]
    })
  },
  updateVideoControls(videoId, controls) {
    const videos = get().storedVideos
    if (!videos) return
    const idx = videos.findIndex(i => i.id === videoId)
    videos[idx].controls = {...videos[idx].controls, ...controls}
    set({
      storedVideos: [...videos]
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
  setAlert(alert) {
    const alerts = get().alerts
    alerts?.push(alert)
    set({alerts})
  },
  
}))

export {
  useStore
}