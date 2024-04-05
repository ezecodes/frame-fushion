type Alert = {
  id: string;
  type: "person detection" | "emergency" | "security" | "motion detection";
  message: string;
  read: boolean;
  date: Date
}

type Camera = {
  id: string;
  name: string;
  location: string;
  resolution: string;
  snapshot: string;
}

export type {
  Alert,
  Camera
}