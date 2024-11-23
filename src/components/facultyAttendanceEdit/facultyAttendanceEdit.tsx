import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GridView from './gridView';
import { fetchAttendance } from '../../services/facultyAttendanceEdit/Api/api';
import { Faculty, AttendanceEntry } from '../../services/facultyAttendanceEdit/Type/type';

const FacultyAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('2024-11-14');
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceData();
    }
  }, [selectedDate]);

  const fetchAttendanceData = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAttendance(selectedDate);
      const rows = mapAttendanceToRows(data, selectedDate);
      setColumnDefs([
        { field: 'name', headerName: 'Faculty Name' },
        { field: 'factId', headerName: 'Faculty ID' },
        {
          field: selectedDate,
          headerName: selectedDate,
          cellStyle: (params: { value: string }) => ({
            backgroundColor: params.value === 'Present' ? '#FFFFFF' : '#FFFFFF',
            color: params.value === 'Present' ? '#3C763D' : '#A94442',
          }),
        },
        {
          field: 'edit',
          headerName: 'Actions',
          cellRenderer: (params: any) => (
            <button
              className="bi bi-pencil-square red-button"
              onClick={() =>
                handleEditButtonClick(params.data.factId, selectedDate, params.data.factList)
              }
            >
              Edit
            </button>
          ),
        },
      ]);
      setRowData(rows);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      setRowData([]);
      setColumnDefs([]);
    } finally {
      setLoading(false);
    }
  };

  const mapAttendanceToRows = (data: AttendanceEntry[], date: string): any[] => {
    const facultyMap: { [id: string]: any } = {};
  
    data.forEach((entry) => {
      entry.factList.forEach((faculty) => {
        if (!facultyMap[faculty.factId]) {
          facultyMap[faculty.factId] = {
            name: faculty.name,
            factId: faculty.factId,
            factList: entry.factList,
            [date]: faculty.attendance,
          };
        }
      });
    });
  
    return Object.values(facultyMap);
  };

  const handleEditButtonClick = (id: string, date: string, factList: Faculty[]) => {
    if (!date || !factList) {
      console.error('Error: Missing date or factList', { id, date, factList });
      return;
    }
    
    navigate('/facultyAttendanceEditSave', {
      state: { id, date, factList },
    });
  };

  return (
    <div className="box">
      <div className="filters space-y-4 md:flex md:space-y-0 md:space-x-4 md:items-center mb-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={fetchAttendanceData}
          disabled={loading}
          className="bg-blue-500 text-white rounded px-3 py-1.75 mt-2 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch Attendance'}
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
      )}
      <div className="box">
        <GridView rowData={rowData} columnDefs={columnDefs} showAddButton={false} />
      </div>
    </div>
  );
};

export default FacultyAttendance;