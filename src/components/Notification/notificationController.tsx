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
    
    setTimeout(() => {
      setLoading(false); 
      setShowForm(false); 
    }, 2000); 
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
           
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Notification Page</h1>
          </div>
              <div className="text-right">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn button"
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
                className="btn button"
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
