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

type SnapshotDescriptionClassification = {
  label: string; 
  score: number
}

type Snapshot = {
  path?: string;
  timeCaptured: Date,
  description: {
    text: string;
    classified: SnapshotDescriptionClassification[],
    summary: string
  };
}

type ActivityLog = {
  threatLevel: "critical" | "low";
  id: string;
  thumbnail: string;
  title: string;
  lastTimeCaptured: string | Date
}

type Camera = {
  id: string;
  name: string;
  location: string;
  resolution: string;
  videoFeed: string;
  snapshots: Snapshot[];
  control: {
    recording: boolean,
    audio: boolean
  }
}

type DetectedImageResponse = {
  score: number;
  label: string;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }
}

type DetectedImageResponseArray = DetectedImageResponse[]

type DetectedImage = {
  cameraId: string;
  response: DetectedImageResponseArray
}
export type {
  Alert,
  Camera,
  DetectedImageResponseArray,
  DetectedImage,
  AppAlert,
  ActivityLog
}