import React, { useState, useEffect } from 'react';
import { fetchHolidayData, saveHoliday, deleteHolidayApi } from '../../services/holiday/Api/api';
import { formatToDDMMYYYY } from '../../components/Utils/dateUtils';
import { Holiday, HolidayPayload } from '../../services/holiday/Type/type';
import Loader from '../loader/loader';
import AlertDialog from '../alert/AlertDialog';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import { Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import HolidayForm from './HolidayForm';
const HolidayComponent: React.FC = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [rowData, setRowData] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteName, setDeleteName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const classes = [
    { value: 'Nursery', label: 'Nursery' },
    { value: 'LKG', label: 'LKG' },
    { value: 'UKG', label: 'UKG' },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: `Class ${i + 1}`,
      label: `Class ${i + 1}`,
    })),
  ];

  const loadHolidays = async () => {
    try {
      setLoading(true);
      const holidays = await fetchHolidayData();
      const formattedData = holidays.flatMap((holiday) =>
        holiday.date.map((dateEntry: any) => ({
          id: dateEntry.id || 'N/A',
          startDate: formatToDDMMYYYY(dateEntry.startDate),
          endDate: formatToDDMMYYYY(dateEntry.endDate),
          description: dateEntry.description || 'No description',
          className: holiday.className.join(', '),
        }))
      );
      setRowData(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteHolidayApi(deleteId);
        await loadHolidays();
        toast.success('Holiday deleted successfully'); // Ensure this is called
      } catch (error) {
        toast.error('Error deleting holiday'); // Ensure this is called
      }
    }
    setIsDialogOpen(false);
    setDeleteId(null);
  };

  const handleDeleteButtonClick = (holidayId: string, holidayName: string) => {
    setDeleteId(holidayId);
    setDeleteName(holidayName);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (values: {
    selectedClasses: (string | number)[];
    startDate: string;
    endDate: string;
    description: string;
  }) => {
    const { selectedClasses, startDate, endDate, description } = values;

    const payload: HolidayPayload = {
      className: selectedClasses.includes('All') ? classes.map((cls) => cls.value) : selectedClasses,
      date: [
        {
          id: '',
          startDate: formatToDDMMYYYY(startDate),
          endDate: formatToDDMMYYYY(endDate),
          description: description || 'No description provided',
        },
      ],
    };

    try {
      await saveHoliday(payload);
      toast.success('Holiday Created Successfully.'); // Ensure this is called
      await loadHolidays();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating holiday:', error);
      toast.error('Failed to create holiday. Please try again.'); // Ensure this is called
    }
  };

  const columnDefs = [
    { headerName: 'Class', field: 'className', sortable: true, filter: true },
    { headerName: 'Start Date', field: 'startDate', sortable: true, filter: true },
    { headerName: 'End Date', field: 'endDate', sortable: true, filter: true },
    { headerName: 'Description', field: 'description', sortable: true, filter: true },
    {
      field: 'delete',
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <button
          className="Trsh"
          onClick={() => handleDeleteButtonClick(params.data.id, params.data.description)}
        >
          <Trash2 size={20} color="red" />
        </button>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="box">
          <ToastContainer position="top-right" autoClose={3000} />
          <AlertDialog
            title="Confirm Deletion"
            message={`Are you sure you want to delete the holiday: ${deleteName}?`}
            isOpen={isDialogOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsDialogOpen(false)}
          />
          {!showForm ? (
            <>
              <div className="flex  space-x-4 mb-4">
                <h1 className="text-xl  font-bold text-[#27727A]">Holiday Page</h1>
              </div>
              <div className="text-right">
                <span onClick={() => setShowForm(true)} className="btn button float-right">
                  Add Holiday
                </span>
              </div>
              <ReusableTable rows={rowData} columns={columnDefs} />
            </>
          ) : (
            <HolidayForm
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              classes={classes}
            />
          )}
        </div>
      )}
    </>
  );
};

export default HolidayComponent;