import React, { useState } from "react";
import NotificationList from "./notificationList";
import NotificationCreate from "./CreateNotification";
import Loader from "../loader/loader";

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
            
              <NotificationCreate onClose={() => setShowForm(false)} />
              
            
          )}
        </div>
      )}
    </>
  );
};

export default NotificationController;
