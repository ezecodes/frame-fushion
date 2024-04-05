import {create} from "zustand"
import { Alert, Camera } from "./types";

type Store = {
  alerts: Alert[];
  cameraList: Camera[];
  setAlert: (alert: Alert) => void;
  setSelectedCamera: (camera: Camera) => void;
  selectedCamera: Camera | {};
};

const useStore = create<Store>((set, get) => ({
  alerts: [
    {
      id: "id1",
      message: "Motion was detected",
      read: false,
      type: "motion detection",
      date: new Date()
    },
    {
      id: "id2",
      message: "Someone was found in your property",
      read: false,
      type: "person detection",
      date: new Date()
    },
    {
      id: "id3",
      message: "Breach of security on privat property",
      read: false,
      type: "security",
      date: new Date()
    },
    {
      id: "id4",
      message: "Attention needed!",
      read: false,
      type: "emergency",
      date: new Date()
    }
  ],
  cameraList: [
    {
      id: "camId1",
      name: "nvidia rays",
      location: "Office workspace",
      resolution: "360-34 PS",
      snapshot: "https://res.cloudinary.com/duqny6afm/image/upload/v1712279524/beyonglense/Default_a_rear_view_of_the_street_2_cttmc5.jpg"
    },
    {
      id: "camId2",
      name: "supernova",
      location: "Private jet",
      resolution: "100-34 PB",
      snapshot: "https://res.cloudinary.com/duqny6afm/image/upload/v1712279523/beyonglense/Default_in_the_airplane_1_lxgn5b.jpg"
    },
    {
      id: "camId3",
      name: "high res",
      location: "Office lobby",
      resolution: "360-34 PS",
      snapshot: "https://res.cloudinary.com/duqny6afm/image/upload/v1712279525/beyonglense/Default_people_walking_by_3_1_rh1fyj.jpg"
    },
  ],
  selectedCamera: {},
  setSelectedCamera(camera) {
    set({selectedCamera: camera})
  },
  setAlert: (alert) => {
    const alerts = get().alerts
    alerts.push(alert)
    set({alerts})
  }
}))

export {
  useStore
}