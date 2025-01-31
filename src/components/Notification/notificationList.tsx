import React, { useEffect, useState } from "react";
import NotificationCard from "./notificationCard";
import axiosInstance from "../../services/Utils/apiUtils";
import './Notification.scss';
import { formatToDDMMYYYY } from "../../components/Utils/dateUtils";
import Loader from "../loader/loader"; 

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

  useEffect(() => {
    // Set loading to true when the data is being fetched
    setLoading(true);

    // Fetch notifications using Axios
    axiosInstance
      .get("https://s-m-s-keyw.onrender.com/notification/getAllNotification") // Replace with real API
      .then((res) => {
        setNotifications(res.data);
        setFilteredNotifications(res.data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((err) => {
        console.error("Error fetching notifications", err);
        setLoading(false); // Set loading to false if there's an error
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

  const handleDelete = (id: string) => {
    // Make DELETE API 
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }
    axiosInstance
      .post(`https://s-m-s-keyw.onrender.com/notification/delete?id=${id}`)
      .then(() => {
        // Remove deleted notification from state
        const updatedNotifications = notifications.filter((note) => note.id !== id);
        setNotifications(updatedNotifications);
        setFilteredNotifications(updatedNotifications);
      })
      .catch((err) => console.error("Error deleting notification", err));
  };

  function handleEdit(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container my-4">
      {/* Filters */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search Notifications..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select w-25 mx-2"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Staff">Staff</option>
          <option value="Holiday">Holiday</option>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
        </select>

        <select
          className="form-select w-25"
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="All">All Classes</option>
          <option value="1">Class Nursury</option>
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
          <Loader /> {/* Assuming Loader is a component you have for loading */}
        </div>
      ) : (
        // Notification List
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
                onClick={() => handleDelete(notification.id)}
              ></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
