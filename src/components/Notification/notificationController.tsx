import React, { useState } from "react";
import NotificationList from "./notificationList";
import NotificationCreate from "./CreateNotification";
import Loader from "../loader/loader";
import BackButton from "../Navigation/backButton";

const NotificationController = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateNotification = () => {
    setLoading(true);
    // Assuming the create notification API call is handled here
    // After the API call, set loading to false
    setTimeout(() => {
      setLoading(false); // Set loading to false after creating notification
      setShowForm(false); // Close the form after creation
    }, 2000); // Simulating an API delay, adjust as needed
  };

  return (
    <>
      {loading ? (
        <Loader /> 
      ) : (
        <div className="box">
          {!showForm ? (
            <>
             <div className="flex items-center space-x-4 mb-4 ">
            <span >
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Notification Page</h1>
          </div>
              <div className="text-right">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-default"
                >
                  Create Notification
                </button>
              </div>
              <NotificationList />
            </>
          ) : (
            <div className="box">
              <NotificationCreate onClose={() => setShowForm(false)} />
              <button
                onClick={handleCreateNotification}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationController;
