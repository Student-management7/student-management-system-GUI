import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/Utils/apiUtils';
import { formatDate } from '../Utils/dateUtils';
import { getDateRange } from '../Utils/dateUtils';
import Loader from '../loader/loader';
import BackButton from '../Navigation/backButton';
import ReusableTable from '../MUI Table/ReusableTable';





interface Faculty {
  factId: string;
  attendance: 'Present' | 'Absent';
  name: string;
}

interface AttendanceEntry {
  date: string;
  factList: Faculty[];
}

const FacultyAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  
  const [columns, setColumns] = useState<any[]>([
    // { field: 'factId', headerName: 'Faculty ID' },
    { field: 'name', headerName: 'Faculty Name' },
    { field: 'date', headerName: 'Attendance' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (fromDate && toDate) {
      
    }
  }, [fromDate, toDate]);

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

      const rows = mapAttendanceToRows(response.data, dateRange);

      setColumns([
        { field: 'name', headerName: 'Faculty Name' },
        // { field: 'factId', headerName: 'Faculty ID' },
        ...dynamicColumns,
      ]);
      setData(rows);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      setData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const mapAttendanceToRows = (data: AttendanceEntry[], dates: string[]): any[] => {
    const facultyMap: { [id: string]: any } = {};

    data.forEach((entry) => {
      const date = entry.date.split("T")[0]; // Extract YYYY-MM-DD
      entry.factList.forEach((faculty) => {
        if (!facultyMap[faculty.factId]) {
          facultyMap[faculty.factId] = {
            name: faculty.name,
            factId: faculty.factId,
            ...dates.reduce((acc, d) => ({ ...acc, [d]: '' }), {})
          };
        }
        facultyMap[faculty.factId][formatDate(date)] = faculty.attendance;
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
      <div className="flex items-center space-x-4 mb-4">
           
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Faculty Attendance </h1>
          </div>

      <div className="filters space-y-4 md:flex md:space-y-0 md:space-x-4 md:items-center mb-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={fetchAttendance}
          disabled={loading}
          className="button bg-blue-500 text-white rounded px-3 py-1.75 mt-2 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch Attendance'}
        </button>

          
        <button
          onClick={handleEditRedirect}
          className="bi bi-pencil-square red-button mt-2 ml-2"
        >
        </button>

      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
      )}

      <div className="box">
        <ReusableTable rows={data} columns={columns}  />
      </div>
    </div>
    )}
    </>
  );
};

export default FacultyAttendance;
