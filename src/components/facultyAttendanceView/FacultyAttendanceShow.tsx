import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/Utils/apiUtils';
import { formatDate } from '../Utils/dateUtils';
import { getDateRange } from '../Utils/dateUtils';
import Loader from '../loader/loader';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import { Pencil } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';

interface Faculty {
  fact_id: string;
  fact_Name: string;
  fact_email: string;
  fact_contact: string;
}

interface AttendanceFaculty {
  factId: string;
  attendance: 'Present' | 'Absent';
  name: string;
}

interface AttendanceEntry {
  date: string;
  factList: AttendanceFaculty[];
}

const FacultyAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([
    { field: 'name', headerName: 'Faculty Name' },
    { field: 'date', headerName: 'Attendance' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentFaculties, setCurrentFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    fetchCurrentFaculties();
  }, []);

  const fetchCurrentFaculties = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Faculty[]>('https://s-m-s-keyw.onrender.com/faculty/findAllFaculty');
      setCurrentFaculties(response.data);
    } catch (err) {
      console.error('Error fetching current faculties:', err);
      toast.error('Error fetching current faculties');
    }
  };

  const validateDates = (): boolean => {
    if (!fromDate || !toDate) {
      setError('Please select both dates');
      return false;
    }
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (start > end) {
      setError('From date cannot be later than to date');
      return false;
    }
    setError('');
    return true;
  };

  const fetchAttendance = async (): Promise<void> => {
    if (!validateDates()) return;

    setLoading(true);
    setError('');
    try {
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);

      const url = `https://s-m-s-keyw.onrender.com/faculty/getAttendance?fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
      const response = await axiosInstance.get<AttendanceEntry[]>(url);
      toast.success('Attendance fetched successfully');

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      const dateRange = getDateRange(fromDate, toDate);
      const dynamicColumns = dateRange.map(date => ({
        field: date,
        headerName: date,
        cellStyle: (params: { value: string }) => ({
          backgroundColor: params.value === 'Present' ? '	#FFFFFF' :
            params.value === 'Absent' ? '#	#FFFFFF' : '#FFFFFF',
          color: params.value === 'Present' ? '#3C763D' :
            params.value === 'Absent' ? '#A94442' : '#000000',
        }),
      }));

      const rows = mapAttendanceToRows(response.data, dateRange, currentFaculties);

      setColumns([
        { field: 'name', headerName: 'Faculty Name' },
        ...dynamicColumns,
      ]);
      setData(rows);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error('Error fetching attendance');
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      setData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const mapAttendanceToRows = (data: AttendanceEntry[], dates: string[], currentFaculties: Faculty[]): any[] => {
    const facultyMap: { [id: string]: any } = {};

    const currentFacultyIds = currentFaculties.map(faculty => faculty.fact_id);

    data.forEach((entry) => {
      const date = entry.date.split("T")[0]; // Extract YYYY-MM-DD
      entry.factList.forEach((faculty) => {
        if (currentFacultyIds.includes(faculty.factId)) {
          if (!facultyMap[faculty.factId]) {
            facultyMap[faculty.factId] = {
              name: faculty.name,
              factId: faculty.factId,
              ...dates.reduce((acc, d) => ({ ...acc, [d]: '' }), {})
            };
          }
          facultyMap[faculty.factId][formatDate(date)] = faculty.attendance;
        }
      });
    });

    return Object.values(facultyMap);
  };

  const handleEditRedirect = () => {
    navigate('/facultyAttendanceEdit'); // Redirect to the edit component route
  };

  return (
    <>
      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && (
        <div className="box">
          <ToastContainer position='top-right' autoClose={3000} />
          
            <h1 className="head1 mb-4" >Faculty Attendance </h1>
         <div className="container mx-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* From Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">From Date:</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="input input-bordered w-full border-0 focus:outline-none focus:ring-0"
                />
              </div>

              {/* To Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">To Date:</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="input input-bordered w-full border-0 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Edit Button */}
              <div className=" flex items-center justify-left md:justify-left">
                <button
                  onClick={handleEditRedirect}
                  className="btn button  "
                >
                  <Pencil size={20} color="white" />
                </button>
              </div>

              {/* Fetch Attendance Button */}
              <div className=" flex items-center justify-left md:justify-left ">
                <button
                  onClick={fetchAttendance}
                  disabled={loading}
                  className="button btn  "
                >
                  {loading ? 'Fetching...' : 'Fetch Attendance'}
                </button>
              </div>
            </div>

            </div>

            <ReusableTable rows={data} columns={columns} />

          </div>
        
      )}
        </>
  );
};

export default FacultyAttendance;