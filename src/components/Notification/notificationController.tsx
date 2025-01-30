import React, { useState } from "react";
import NotificationList from "./notificationList";
import NotificationCreate from "./CreateNotification";

const NotificationController = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-default button text-white"
            >
              Create Notification
            </button>
          </div>
          <NotificationList />
        </>
      ) : (
        <div className="box">
          <NotificationCreate onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationController;
