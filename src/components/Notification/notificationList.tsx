import React, { useEffect, useState } from "react";
import NotificationCard from "./notificationCard";
import axiosInstance from "../../services/Utils/apiUtils";
import './Notification.scss';
import { formatToDDMMYYYY } from "../../components/Utils/dateUtils";
import Loader from "../loader/loader"; 
import AlertDialog from "../alert/AlertDialog"; // Import the AlertDialog component
import { toast, ToastContainer } from "react-toastify";

interface Notification {
  id: string;
  description: string;
  cato: string;
  className: string[];
  startDate: string;
  endDate: string;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("https://s-m-s-keyw.onrender.com/notification/getAllNotification")
      .then((res) => {
        setNotifications(res.data);
        setFilteredNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [searchTerm, category, classFilter]);

  const filterNotifications = () => {
    let filtered = notifications.filter((note) => {
      return (
        (category === "All" || note.cato === category.toLowerCase()) &&
        (classFilter === "All" || note.className.includes(classFilter)) &&
        note.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredNotifications(filtered);
  };

  const confirmDelete = (notification: Notification) => {
    setSelectedNotification(notification);
    setAlertOpen(true);
  };

  const handleDelete = () => {
    if (!selectedNotification) return;

    axiosInstance
      .post(`https://s-m-s-keyw.onrender.com/notification/delete?id=${selectedNotification.id}`)
      .then(() => {
        const updatedNotifications = notifications.filter((note) => note.id !== selectedNotification.id);
        setNotifications(updatedNotifications);
        setFilteredNotifications(updatedNotifications);
        toast.success("Notification Delete Successfully")
      })
      .catch((err) => toast.error("Error deleting notification"))
      .finally(() => {
        setAlertOpen(false);
        setSelectedNotification(null);
      });
  };

  return (
    <div className="container my-4">
                <ToastContainer position="top-right" autoClose={3000} />

      {/* Filters */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search Notifications..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="form-select w-25 mx-2" onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Staff">Staff</option>
          <option value="Holiday">Holiday</option>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
        </select>

        <select className="form-select w-25" onChange={(e) => setClassFilter(e.target.value)}>
          <option value="All">All Classes</option>
          <option value="1">Class Nursery</option>
          <option value="2">Class LKG</option>
          <option value="3">Class UKG</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
          <option value="4">Class 4</option>
          <option value="1">Class 5</option>
          <option value="2">Class 6</option>
          <option value="3">Class 7</option>
          <option value="4">Class 8</option>
          <option value="4">Class 9</option>
          <option value="1">Class 10</option>
          <option value="2">Class 11</option>
          <option value="3">Class 12</option>
        </select>
      </div>

      {/* Loader Component */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Loader />
        </div>
      ) : (
        <div>
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="mb-2">
              <div className="sticky-header">
                {formatToDDMMYYYY(notification.startDate)} <span className="mx-2">to</span>{" "}
                {formatToDDMMYYYY(notification.endDate)}
              </div>
              <NotificationCard
                category={notification.cato}
                description={notification.description}
                className={notification.className}
              />
              {/* Delete Button */}
              <button
                className="bi bi-x-circle text-red-600"
                onClick={() => confirmDelete(notification)}
              ></button>
            </div>
          ))}
        </div>
      )}
               <ToastContainer position="top-right" autoClose={3000} />

      {/* Alert Dialog for Deletion */}
      {alertOpen && selectedNotification && (
        <AlertDialog
          title="Confirm Delete"
          message={`Are you sure you want to delete this notification: "${selectedNotification.description}"?`}
          isOpen={alertOpen}
          onConfirm={handleDelete}
          onCancel={() => setAlertOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationList;
