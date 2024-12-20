// import React, { useEffect, useState } from "react";
// import NotificationCard from "./notificationCard";
// import axiosInstance from "../../services/Utils/apiUtils";
// import './Notification.scss';

// interface Notification {
//   id: string;
//   startDate: string;
//   description: string;
//   cato: string;
//   className: string[];
// }

// const NotificationList: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [category, setCategory] = useState("All");
//   const [classFilter, setClassFilter] = useState("All");

//   useEffect(() => {
//     // Fetch notifications using Axios
//     axiosInstance
//       .get("https://s-m-s-keyw.onrender.com/notification/getAllNotification") // Replace with real API
//       .then((res) => {
//         setNotifications(res.data);
//         setFilteredNotifications(res.data);
//       })
//       .catch((err) => console.error("Error fetching notifications", err));
//   }, []);

//   useEffect(() => {
//     filterNotifications();
//   }, [searchTerm, category, classFilter]);

//   const filterNotifications = () => {
//     let filtered = notifications.filter((note) => {
//       return (
//         (category === "All" || note.cato === category.toLowerCase()) &&
//         (classFilter === "All" || note.className.includes(classFilter)) &&
//         (note.description.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     });
//     setFilteredNotifications(filtered);
//   };

//   return (
//     <div className="container my-4">
//       {/* Filters */}
//       <div className="d-flex justify-content-between mb-3">
//         <input
//           type="text"
//           className="form-control w-25"
//           placeholder="Search Notifications..."
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <select
//           className="form-select w-25 mx-2"
//           onChange={(e) => setCategory(e.target.value)}
//         >
//           <option value="All">All Categories</option>
//           <option value="Holiday">Student</option>
//           <option value="Holiday">Teacher</option>
//           <option value="Holiday">staff</option>
//           <option value="Holiday">Holiday</option>
//           <option value="Exam">Exam</option>
//           <option value="Event">Event</option>
//         </select>

//         <select
//           className="form-select w-25"
//           onChange={(e) => setClassFilter(e.target.value)}
//         >
//           <option value="All">All Classes</option>
//           <option value="1">Class 1</option>
//           <option value="2">Class 2</option>
//         </select>
//       </div>

//       {/* Notification List */}
//       <div>
//         {filteredNotifications.map((notification) => (
//           <div key={notification.id} className="mb-2">
//             <div className="sticky-header">
//               {new Date(notification.startDate).toLocaleDateString()}
//             </div>
//             <NotificationCard
//               category={notification.cato}
//               description={notification.description}
//               className={notification.className}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationList;
