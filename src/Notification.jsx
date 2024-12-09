// src/Notification.js
import { useEffect } from "react";
import { messaging } from "./firebase";

const Notification = () => {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        messaging.getToken().then((token) => {
          console.log("FCM Token:", token);
        });
      }
    });
  }, []);

  return <div>Notification setup complete!</div>;
};

export default Notification;
