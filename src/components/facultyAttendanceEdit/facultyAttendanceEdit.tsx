import React, { useState, useEffect } from 'react';
import { fetchAttendance, saveAttendanceEdit } from '../../services/Faculty/facultyAttendanceEdit/Api/api';
import { Faculty, AttendanceEntry } from '../../services/Faculty/facultyAttendanceEdit/Type/type';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import Loader from '../loader/loader';
import BackButton from '../Navigation/backButton';
import { toast, ToastContainer } from 'react-toastify';
import { formatToDDMMYYYY } from '../Utils/dateUtils';
import axiosInstance from '../../services/Utils/apiUtils';

interface Facultys {
  id: string;
  name: string;
  attendance: AttendanceEntry[];
}

const FacultyAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentFaculties, setCurrentFaculties] = useState<Faculty[]>([]);
  const [editedFactList, setEditedFactList] = useState<Faculty[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
  
  const [attendanceData, setAttendanceData] = useState<{
    id: string;
    date: string;
    factList: Faculty[];
  }>({
    id: '',
    date: '',
    factList: []
  });

  useEffect(() => {
    fetchCurrentFaculties();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceData();
    }
  }, [selectedDate]);

  const fetchCurrentFaculties = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Faculty[]>('https://s-m-s-keyw.onrender.com/faculty/findAllFaculty');
      setCurrentFaculties(response.data);
    } catch (err) {
      console.error('Error fetching current faculties:', err);
      toast.error('Error fetching current faculties');
    }
  };

  const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
    const factId = rowData[rowIndex].factId;
    // Update editedFactList
    setEditedFactList((prevList) =>
      prevList.map((faculty) =>
        faculty.factId === factId ? { ...faculty, [field]: value } : faculty
      )
    );
    // Update rowData
    setRowData((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const fetchAttendanceData = async (): Promise<void> => {
    if (!selectedDate) return;

    setLoading(true);
    setError('');

    try {
      const data = await fetchAttendance(selectedDate);

      if (!data || data.length === 0) {
        setError('No attendance data found for the selected date');
        toast.info('No attendance data found for the selected date');
        setRowData([]);
        setColumnDefs([]);
        setEditedFactList([]);
        return;
      }

      setAttendanceData({ id: data[0].id.toString(), date: data[0].date, factList: data[0].factList });
      setEditedFactList(data[0].factList);

      const rows = mapAttendanceToRows(data, selectedDate, currentFaculties);

      setColumnDefs([
        { field: 'name', headerName: 'Faculty Name' },
        {
          headerName: "Attendance",
          field: "attendance",
          editable: true,
          cellRenderer: (params: any) => {
            // Initialize with params.data.attendance instead of params.value
            // This ensures we're getting the current value from rowData
            const [selectedValue, setSelectedValue] = useState(params.data.attendance || "Present");
            
            // Update local state when row data changes
            useEffect(() => {
              setSelectedValue(params.data.attendance || "Present");
            }, [params.data.attendance, refreshKey]); // Add refreshKey dependency
            
            return (
              <div className="flex gap-2">
                {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
                  <label key={`${option}-${refreshKey}-${params.data.factId}`} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`attendance-${params.data.factId}`}
                      value={option}
                      checked={selectedValue === option}
                      onChange={() => {
                        // Update local state
                        setSelectedValue(option);
                        
                        // Update parent component state
                        const factId = params.data.factId;
                        
                        // Update editedFactList directly
                        setEditedFactList(prevList =>
                          prevList.map(faculty =>
                            faculty.factId === factId
                              ? { ...faculty, attendance: option }
                              : faculty 
                          )
                        );
                        
                        // Update rowData directly
                        setRowData(prevRows =>
                          prevRows.map(row =>
                            row.factId === factId
                              ? { ...row, attendance: option }
                              : row
                          )
                        );
                        
                        // Force re-render
                        setRefreshKey(prev => prev + 1);
                      }}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            );
          }
        },
      ]);

      setRowData(rows);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Error: Please select a correct date.');
      toast.error('Error: Please select a correct date.');
      setRowData([]);
      setColumnDefs([]);
      setEditedFactList([]);
    } finally {
      setLoading(false);
    }
  };

  const mapAttendanceToRows = (data: AttendanceEntry[], date: string, currentFaculties: Faculty[]): any[] => {
    if (!data || data.length === 0 || !data[0].factList) {
      return [];
    }

    const facultyMap: { [id: string]: any } = {};
    const currentFacultyIds = currentFaculties.map((faculty) => faculty.fact_id);

    data.forEach((entry) => {
      entry.factList.forEach((faculty) => {
        if (currentFacultyIds.includes(faculty.factId)) {
          if (!facultyMap[faculty.factId]) {
            facultyMap[faculty.factId] = {
              name: faculty.name,
              factId: faculty.factId,
              attendance: faculty.attendance,
            };
          }
        }
      });
    });

    return Object.values(facultyMap);
  };

  const handleSaveAttendance = async () => {
    if (editedFactList.length === 0) {
      toast.warning('No data to save.');
      return;
    }

    const hasUnmarkedAttendance = editedFactList.some(faculty => !faculty.attendance);
    if (hasUnmarkedAttendance) {
      toast.warning('Please mark attendance for all faculty members.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: attendanceData.id,
        date: formatToDDMMYYYY(attendanceData.date),
        factList: editedFactList,
      };
      await saveAttendanceEdit(payload);
      toast.success('Attendance updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="box">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex items-center space-x-4 mb-4">
          <span>
            <BackButton />
          </span>
          <h1 className="head1 items-center">Faculty Attendance Edit</h1>
        </div>

        <div className="row form-group d-flex align-items-end">
          <span className="col-md-3">
            <label className="form-label">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-control"
            />
          </span>
          <span className="col-md-6 d-flex align-items-end mb-1">
            <button
              onClick={fetchAttendanceData}
              disabled={loading}
              className="button btn mt-4"
            >
              {loading ? 'Fetching...' : 'Fetch Attendance'}
            </button>
          </span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded my-3">{error}</div>
        )}

        {rowData.length > 0 && (
          <>
            <ReusableTable
              rows={rowData}
              columns={columnDefs}
              rowsPerPageOptions={[5, 10, 20]}
              onCellValueChange={handleCellValueChange} // Pass the handler
              page={currentPage}
              onPageChange={(newPage: React.SetStateAction<number>) => setCurrentPage(newPage)}
              
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSaveAttendance}
                className="button btn head1 text-white"
                disabled={loading || editedFactList.length === 0}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FacultyAttendance;