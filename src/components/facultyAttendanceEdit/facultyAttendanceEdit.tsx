


import React, { useState, useEffect, useCallback } from "react";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import Loader from "../loader/loader";
import BackButton from "../Navigation/backButton";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../services/Utils/apiUtils";

interface Faculty {
  factId: string;
  name: string;
  attendance: string;
}

interface AttendanceEntry {
  date: string;
  id: string;
  factList: Faculty[];
}

interface CurrentFaculty {
  fact_id: string;
  fact_Name: string;
}

// Include validation function in the same file
const validateAttendanceForm = (date: string): boolean => {
  if (!date || date.trim() === "") {
    return false;
  }
  return true;
};

// Include API functions in the same file
const fetchAttendance = async (selectedDate: string): Promise<AttendanceEntry[]> => {
  try {
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const parts = selectedDate.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const url = `https://s-m-s-keyw.onrender.com/faculty/getAttendance?fromDate=${formattedDate}&toDate=${formattedDate}`;
    const response = await axiosInstance.get(url);

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const FacultyAttendanceEdit: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [editedFacultyList, setEditedFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentFaculty, setCurrentFaculty] = useState<CurrentFaculty[]>([]);
  const [attendanceId, setAttendanceId] = useState<string>("");

  // Fetch current faculty members
  useEffect(() => {
    const fetchCurrentFaculty = async () => {
      try {
        const response = await axiosInstance.get("https://s-m-s-keyw.onrender.com/faculty/findAllFaculty");
        setCurrentFaculty(response.data);
      } catch (err) {
        toast.error("Failed to fetch current faculty.");
      }
    };

    fetchCurrentFaculty();
  }, []);

  // Format date from YYYY-MM-DD to DD/MM/YYYY for API payload
  const formatDateForPayload = (dateString: string): string => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Handle fetch attendance button click
  const handleFetchAttendance = useCallback(async () => {
    const isFormValid = validateAttendanceForm(selectedDate);

    if (!isFormValid) {
      toast.warning("Please select a valid date.");
      return;
    }

    setAttendanceData([]);
    setEditedFacultyList([]);
    setAttendanceId("");

    setLoading(true);
    try {
      const data = await fetchAttendance(selectedDate);

      if (!data || data.length === 0) {
        toast.warning("No attendance records found for the selected date.");
        setAttendanceData([]);
        setEditedFacultyList([]);
        return;
      }

      // Filter attendance data to include only current faculty
      const currentFacultyIds = new Set(currentFaculty.map(faculty => faculty.fact_id));

      const filteredData = data.map((record) => {
        return {
          id: record.id,
          date: record.date,
          factList: record.factList.filter((faculty) =>
            currentFacultyIds.has(faculty.factId)
          )
        };
      });

      setAttendanceData(filteredData);
      setEditedFacultyList(filteredData[0]?.factList || []);
      setAttendanceId(filteredData[0]?.id || "");
      toast.success("Faculty attendance data fetched successfully.");
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      toast.error("No data found for this date.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, currentFaculty]);

  // Handle cell value changes
  const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
    setEditedFacultyList((prevFaculty) => {
      if (rowIndex >= 0 && rowIndex < prevFaculty.length) {
        const newFaculty = [...prevFaculty];
        newFaculty[rowIndex] = {
          ...newFaculty[rowIndex],
          [field]: value,
        };
        return newFaculty;
      }
      return prevFaculty;
    });
  };

  // Save edited attendance
  const saveEditedAttendance = async () => {
    if (editedFacultyList.length === 0 || attendanceData.length === 0) {
      toast.warning("No attendance data to save.");
      return;
    }

    try {
      setLoading(true);

      // Format date for the payload
      const formattedDate = formatDateForPayload(selectedDate);

      const payload = {
        id: attendanceId,
        date: formattedDate,
        factList: editedFacultyList.map((faculty) => ({
          factId: faculty.factId,
          name: faculty.name,
          attendance: faculty.attendance,
        })),
      };

      await axiosInstance.post("https://s-m-s-keyw.onrender.com/faculty/attendanceEdit", payload);
      toast.success('Faculty attendance updated successfully!');
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Column definitions for the table
  const columnDefs = [
    { headerName: 'Faculty Name', field: 'name', editable: false },
    {
      headerName: 'Attendance',
      field: 'attendance',
      editable: true,
      cellRenderer: (params: any) => {
        const factId = params.data.factId;
        const faculty = editedFacultyList.find((faculty: Faculty) => faculty.factId === factId);
        const currentValue = faculty ? faculty.attendance : "Present";

        return (
          <div className="flex gap-2" key={`${factId}-${refreshKey}`}>
            {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`attendance-${factId}`}
                  value={option}
                  checked={currentValue === option}
                  onChange={() => {
                    setEditedFacultyList((prevList: Faculty[]) =>
                      prevList.map((faculty: Faculty) =>
                        faculty.factId === factId
                          ? { ...faculty, attendance: option }
                          : faculty
                      )
                    );
                    setRefreshKey((prev) => prev + 1);
                    if (typeof params.setValue === "function") {
                      params.setValue(option);
                    }
                  }}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      },
    },
  ];

  const rowData = editedFacultyList.map((faculty, index) => ({
    ...faculty,
    rowIndex: index,
  }));

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Loader />}
      {!loading && (
        <div className="box">
          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="head1">Faculty Attendance Update</h1>
          </div>

          <div className="">
            {/* Date Selection and Fetch Button in the same line */}
            <div className="row form-group d-flex align-items-end">
              <div className="col-6 col-md-3 mb-2 mb-md-0">
                <label className="form-label">Select Date:</label>
                <input
                  type="date"
                  id="selectedDate"
                  className="form-control me-md-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-6 col-md-3 d-flex align-items-end mt-3 mt-md-0 mb-1"> {/* Added mt-3 for mobile gap */}
                <button
                  className="button btn w-100 w-md-auto"
                  onClick={handleFetchAttendance}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Fetch Attendance"}
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          {!loading && editedFacultyList.length > 0 && (
            <div className="mt-4">

              <ReusableTable
                rows={rowData}
                columns={columnDefs}
                onCellValueChange={handleCellValueChange}
              />
            </div>
          )}

          {/* Save Button */}
          {!loading && editedFacultyList.length > 0 && (
            <div className='flex justify-center mt-4 mb-4'>
              <button
                onClick={saveEditedAttendance}
                className="button btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

      )}
    </>
  );
};

export default FacultyAttendanceEdit;




