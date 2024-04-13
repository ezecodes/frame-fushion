type Alert = {
  id: string;
  type: "person detection" | "emergency" | "security" | "motion detection";
  message: string;
  read: boolean;
  date: Date
}

type AppAlert = {
  type: "info" | "warn" | "error"; 
  message: string
}

type OnboardChoice = {
  question: string;
  option: string;
}


type Snapshot = {
  path: string;
  timeCaptured: Date;
  playbackTime: number;
}

type ActivityLog = {
  threatLevel: "critical" | "low";
  id: string;
  thumbnail: string;
  title: string;
  lastTimeCaptured: string | Date
}

type Chat = {
  prompt: string;
  id: string;
  timeStamp: Date;
  response?: string;
}

type StoredVideo = {
  id: string;
  path: string;
  name: string;
  type: string;
  size: number;
  lastControlledPlaybackTime?: number;
  analysing: boolean;
  summary?: string;
  chats?: Chat[],
  controls: {
    playing: boolean
  },
  duration: number;
}

export type {
  Alert,
  AppAlert,
  Snapshot,
  ActivityLog,
  StoredVideo,
  OnboardChoice
}