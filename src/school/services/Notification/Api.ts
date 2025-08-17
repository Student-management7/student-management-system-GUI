import axiosInstance from "../../services/Utils/apiUtils";
import { Notification, NotificationPayload } from "./Type";

const BASE_URL = "https://s-m-s-keyw.onrender.com/notification";

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get(`${BASE_URL}/getAllNotification`);
  return response.data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/delete?id=${id}`);
};

export const saveNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/save`, payload, {
    headers: { "Content-Type": "application/json" },
  });
};
