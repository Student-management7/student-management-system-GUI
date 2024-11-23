// import React, { useState } from "react";
// import Select from "react-select";
// import '../main/main.scss'
// import axios from "axios";
// import { formatToDDMMYYYY } from "../Utils/dateUtils"; // Adjust the path as needed
// interface HolidayPayload {
//     className: (string | number)[] | "All";
//     date: {
//         startDate: string;
//         endDate: string;
//         description: string;
//     };
// }

// const HolidayForm: React.FC = () => {

//     const classes = [
//         { value: "Nursery", label: "Nursery" },
//         { value: "LKG", label: "LKG" },
//         { value: "UKG", label: "UKG" },
//         ...Array.from({ length: 12 }, (_, i) => ({
//             value: i + 1,
//             label: `Class ${i + 1}`,
//         })),
//     ];


//     const [selectedClasses, setSelectedClasses] = useState<(string | number)[] | "All">([]);
//     const [holidayDate, setHolidayDate] = useState({
//         startDate: "",
//         endDate: "",
//         description: "",
//     });

//     //  class selection
//     const handleClassSelection = (selectedOptions: any) => {
//         // If "All" classes is selected, set all classes
//         if (selectedOptions.some((opt: any) => opt.value === "All")) {
//             setSelectedClasses("All");
//         } else {
//             setSelectedClasses(selectedOptions.map((opt: any) => opt.value));
//         }
//     };

//     //  holiday date change
//     const handleHolidayDateChange = (
//         field: "startDate" | "endDate" | "description",
//         value: string
//     ) => {
//         setHolidayDate({
//             ...holidayDate,
//             [field]: value,
//         });
//     };

//     //  form submission

//     const handleSubmit = async () => {
//         if (
//           holidayDate.startDate === "" ||
//           holidayDate.endDate === "" ||
//           (selectedClasses.length === 0 && selectedClasses !== "All")
//         ) {
//           alert("Please fill in all fields.");
//           return;
//         }
      
//         // Prepare the payload with date as an array
//         const payload = {
//           className:
//             selectedClasses === "All"
//               ? classes.map((cls) => cls.value) // Include all classes
//               : selectedClasses,
//           date: [
//             {
//               id: "", // Generate or assign an ID if needed
//               startDate: formatToDDMMYYYY(holidayDate.startDate),
//               endDate: formatToDDMMYYYY(holidayDate.endDate),
//               description: holidayDate.description,
//             },
//           ],
//         };
      
//         try {
//           const response = await axios.post("https://s-m-s-keyw.onrender.com/holiday/save", payload);
      
//           if (response.status === 200) {
//             alert("Holiday Created Successfully!");
//           }
//         } catch (error) {
//           console.error("Error submitting holiday:", error);
//           alert("Failed to create holiday. Please try again.");
//         }
//       };
//     const options = [{ value: "All", label: "All Classes" }, ...classes];

//     return (
//         <div >
//             <div className="box">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Create Holiday</h2>

//                 {/* Class Selection */}
//                 <div className="mb-4">
//                     <h3 className="font-semibold mb-2">Select Classes:</h3>
//                     <Select
//                         isMulti
//                         options={options}
//                         onChange={handleClassSelection}
//                         className="basic-multi-select"
//                         classNamePrefix="select"
//                         placeholder="Select Classes..."
//                     />
//                 </div>

//                 {/* Holiday Date Fields */}
//                 <div className="mb-4">
//                     <label className="block mb-2 font-semibold">Start Date:</label>
//                     <input
//                         type="date"
//                         className="w-full border px-3 py-2 mb-4 rounded-md"
//                         value={holidayDate.startDate}
//                         onChange={(e) =>
//                             handleHolidayDateChange("startDate", e.target.value)
//                         }
//                     />

//                     <label className="block mb-2 font-semibold">End Date:</label>
//                     <input
//                         type="date"
//                         className="w-full border px-3 py-2 rounded-md"
//                         value={holidayDate.endDate}
//                         onChange={(e) =>
//                             handleHolidayDateChange("endDate", e.target.value)
//                         }
//                     />
//                 </div>

//                 {/* Description Field */}
//                 <div className="mb-4">
//                     <label className="block mb-2 font-semibold">Description:</label>
//                     <input
//                         type="text"
//                         placeholder="Optional holiday description"
//                         className="w-full border px-3 py-2 rounded-md"
//                         value={holidayDate.description}
//                         onChange={(e) =>
//                             handleHolidayDateChange("description", e.target.value)
//                         }
//                     />
//                 </div>


//                 {/* Submit Button */}

//                 <span className="flex justify-center">
//                     <button
//                         type="button"
//                         className="w-1/8 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex justify-center "
//                         onClick={handleSubmit}
//                     >
//                         Submit
//                     </button>
//                 </span>
//             </div>

//         </div>

//     );
// };

// export default HolidayForm;









// import React, { useState, useEffect } from "react";
// import GridView from "./gridView"; // Assuming GridView is in the same directory

// export interface Holiday {
//   id: string;
//   startDate: string;
//   endDate: string;
//   description: string;
//   className: (number | string)[];
// }

// interface HolidayGridViewProps {
//   apiUrl: string; // API URL to fetch holiday data
// }

// const HolidayGridView: React.FC<HolidayGridViewProps> = ({ apiUrl }) => {
//   const [holidayData, setHolidayData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchHolidayData = async () => {
//       try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         const formattedData = data.map((holiday: any) => ({
//           id: holiday.id,
//           startDate: holiday.date.startDate,
//           endDate: holiday.date.endDate,
//           description: holiday.date.description || "No description",
//           className: holiday.className
//             .map((cls: number | string) =>
//               typeof cls === "number" ? `Class ${cls}` : cls
//             )
//             .join(", "), // Show class names
//         }));

//         setHolidayData(formattedData);
//       } catch (error) {
//         console.error("Error fetching holiday data:", error);
//       }
//     };

//     fetchHolidayData();
//   }, [apiUrl]);

//   const columnDefs = [
//     { headerName: "ID", field: "id", sortable: true, filter: true },
//     { headerName: "Class", field: "className", sortable: true, filter: true },
//     { headerName: "Start Date", field: "startDate", sortable: true, filter: true },
//     { headerName: "End Date", field: "endDate", sortable: true, filter: true },
//     { headerName: "Description", field: "description", sortable: true, filter: true },
//   ];

//   return (
//     <div className="box">
//       <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Holiday </h2>
//       <GridView
//         rowData={holidayData}
//         columnDefs={columnDefs}
//         showAddButton={false}
//       />
//     </div>
//   );
// };

// export default HolidayGridView;
