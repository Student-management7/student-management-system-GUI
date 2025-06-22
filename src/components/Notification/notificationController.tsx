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
             <div className="flex head1 items-center space-x-4 my-3">
           
            <h1 className="" >Notification Page</h1>
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
