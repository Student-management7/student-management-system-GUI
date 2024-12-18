import React, { useEffect, useState } from "react";
import './Notification.scss';
import axiosInstance from "../../services/Utils/apiUtils";

interface Notification {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  cato: string;
  className: string[];
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get<Notification[]>(
          "https://s-m-s-keyw.onrender.com/notification/getAllNotification" // Replace with actual API endpoint
        );
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="box">
      <h3 className="mb-4 text-center fw-bold">Notifications</h3>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && notifications.length === 0 && (
        <div className="alert alert-info text-center">No notifications available.</div>
      )}
      <div className="list-group">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="list-group-item list-group-item-action mb-2 shadow-sm"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {/* Badge for User Category */}
                <span
                  className={`badge ${
                    notif.cato === "student" ? "bg-success" : "bg-primary"
                  } me-2`}
                >
                  {notif.cato.charAt(0).toUpperCase() + notif.cato.slice(1)}
                </span>
                {/* Notification Description */}
                <strong className="text-dark">{notif.description}</strong>
                <p className="text-muted mb-1 small">
                  Classes: {notif.className.join(", ")}
                </p>
              </div>
              {/* Notification Date */}
              <div className="text-muted small text-end">
                {formatDate(notif.startDate)} - {formatDate(notif.endDate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
