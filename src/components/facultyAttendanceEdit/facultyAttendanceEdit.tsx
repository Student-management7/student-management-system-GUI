import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAttendance } from '../../services/Faculty/facultyAttendanceEdit/Api/api';
import { Faculty, AttendanceEntry } from '../../services/Faculty/facultyAttendanceEdit/Type/type';
import { Pencil } from 'lucide-react';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import Loader from '../loader/loader';
import BackButton from '../Navigation/backButton';
import { toast, ToastContainer } from 'react-toastify';
const FacultyAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedDate) {

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
        // { field: 'factId', headerName: 'Faculty ID' },
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
              className=""
              onClick={() =>
                handleEditButtonClick(params.data.factId, selectedDate, params.data.factList)
              }
            >
              <Pencil size={20} color='orange' />
            </button>
          ),
        },
      ]);
      setRowData(rows);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error('Error  Please select correct Date '); 
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

    <>
      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && (
        <div className="box">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="head1 items-center " >Faculty Attendance Edit </h1>
          </div>


          <div className="row form-group d-flex align-items-end">
            <span className="col-md-3 ">
              <label className="form-label ">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="form-control "
              />
            </span>
            <span className="col-md-6 d-flex align-items-end mb-1">

              <button
                onClick={fetchAttendanceData}
                disabled={loading}
                className="button btn mt-4  "
              >
                {loading ? 'Fetching...' : 'Fetch Attendance'}
              </button>
            </span>
          </div>


          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
          )}
          
            <ReusableTable rows={rowData} columns={columnDefs} rowsPerPageOptions={[5, 10, 20]} />
         
        </div>
      )}
    </>
  );
};

export default FacultyAttendance;
