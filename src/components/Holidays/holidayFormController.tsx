import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { deleteHolidayApi, fetchHolidayData, saveHoliday } from '../../services/holiday/Api/api';
import { formatToDDMMYYYY } from '../../components/Utils/dateUtils';
import { Holiday, HolidayPayload } from '../../services/holiday/Type/type';
import Loader from '../loader/loader';
import AlertDialog from '../alert/AlertDialog';
import ReusableTable from '../MUI Table/ReusableTable';
import { Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const HolidayComponent: React.FC = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [rowData, setRowData] = useState<Holiday[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<(string | number)[] | 'All'>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [holidayDate, setHolidayDate] = useState({
    startDate: '',
    endDate: '',
    description: '',
  });

  const classes = [
    { value: 'Nursery', label: 'Nursery' },
    { value: 'LKG', label: 'LKG' },
    { value: 'UKG', label: 'UKG' },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: `Class ${i + 1}`,
      label: `Class ${i + 1}`,
    })),
  ];

  const options = [{ value: 'All', label: 'All Classes' }, ...classes];

  useEffect(() => {
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
      }finally{
        setLoading(false);
      }
    };

    loadHolidays();
  }, []);
  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteHolidayApi(deleteId);
        setRowData((prevData) => prevData.filter((row) => row.id !== deleteId));
        toast.success("holiday deleted successfully")
      } catch (error) {
        toast.error('Error deleting holiday');
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

  const formik = useFormik({
    initialValues: {
      selectedClasses: [],
      startDate: '',
      endDate: '',
      description: '',
    },
    validationSchema: Yup.object({
      selectedClasses: Yup.array().min(1, 'Please select at least one class.'),
      startDate: Yup.date().required('Start Date is required'),
      endDate: Yup.date()
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End Date cannot be before Start Date'),
      description: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
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
        toast.success('Holiday Created Successfully!');
        setShowForm(false);
      } catch (error) {
        console.error('Error creating holiday:', error);
        toast.error('Failed to create holiday. Please try again.');
      }
    },
  });

  const handleClassSelection = (selectedOptions: any) => {
    if (selectedOptions.some((opt: any) => opt.value === 'All')) {
      formik.setFieldValue('selectedClasses', ['All']);
    } else {
      formik.setFieldValue('selectedClasses', selectedOptions.map((opt: any) => opt.value));
    }
  };

  const columnDefs = [
    // { headerName: 'ID', field: 'id', sortable: true, filter: true },
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
          <Trash2 size={20} color='red' />
        </button>
      ),
    },
  ];

  return (

    <>
              <ToastContainer position="top-right" autoClose={3000} />

    {loading ? (
      <Loader /> // Show loader while data is being fetched
    ) : (
    <div className="box ">
      <AlertDialog
            title="Confirm Deletion"
            message={`Are you sure you want to delete the holiday: ${deleteName}?`}
            isOpen={isDialogOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsDialogOpen(false)}
          />
      {!showForm ? (
        <>
        
         
        <div className="flex items-center space-x-4 mb-4 ">
          
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Holiday Page</h1>
          </div>
          <div className="text-right">
            <button onClick={() => setShowForm(true)} className="btn btn-default">
              Add Holiday
            </button>
          </div>
          <ReusableTable rows={rowData} columns={columnDefs} />
        </>
      ) : (
        <div className="box">
          <h2 className="head1 mb-10 text-center"><i onClick={() => setShowForm(false)} className="bi bi-arrow-left-circle m-2" />Holiday</h2>
          <div className="flex flex-row items-center justify-center space-x-10">
            <div className="mb-4 w-1/2">
              <h3 className="font-semibold mb-2">Select Classes:</h3>
              <Select
                isMulti
                options={options}
                onChange={handleClassSelection}
                className="basic-multi-select mb-4"
                classNamePrefix="select"
                placeholder="Select Classes..."
                value={formik.values.selectedClasses.includes('All')
                  ? [{ value: 'All', label: 'All Classes' }]
                  : formik.values.selectedClasses.map((value: string) => ({
                      value,
                      label: classes.find((cls) => cls.value === value)?.label || value,
                    }))
                }
              />
              {formik.errors.selectedClasses && formik.touched.selectedClasses && (
                <div className="text-red-600">{formik.errors.selectedClasses}</div>
              )}

              <label className="block mb-2 font-semibold">Description:</label>
              <input
                type="text"
                placeholder="Optional holiday description"
                className="w-full border px-3 py-2 rounded-md"
                value={formik.values.description}
                onChange={(e) => formik.setFieldValue('description', e.target.value)}
              />
              {formik.errors.description && formik.touched.description && (
                <div className="text-red-600">{formik.errors.description}</div>
              )}
            </div>

            <div className="mb-4 w-1/2">
              <label className="block mb-2 font-semibold">Start Date:</label>
              <input
                type="date"
                className="w-full border px-3 py-2 mb-4 rounded-md"
                value={formik.values.startDate}
                onChange={(e) => formik.setFieldValue('startDate', e.target.value)}
              />
              {formik.errors.startDate && formik.touched.startDate && (
                <div className="text-red-600">{formik.errors.startDate}</div>
              )}

              <label className="block mb-2 font-semibold">End Date:</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded-md"
                value={formik.values.endDate}
                onChange={(e) => formik.setFieldValue('endDate', e.target.value)}
              />
              {formik.errors.endDate && formik.touched.endDate && (
                <div className="text-red-600">{formik.errors.endDate}</div>
              )}
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />

          <div className="text-center mt-10">
            <button
              type="button"
              className="w-1/8 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 button"
              onClick={() => formik.handleSubmit()}
            >
              Submit
            </button>
            <button
              type="button"
              className="w-1/8 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 ml-4 btn-danger"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    )}
    </>
  );
};

export default HolidayComponent;
