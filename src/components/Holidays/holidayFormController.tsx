import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import GridView from './gridView';
import { deleteHolidayApi, fetchHolidayData, saveHoliday } from '../../services/holiday/Api/api';
import { formatToDDMMYYYY } from '../../components/Utils/dateUtils';
import { Holiday, HolidayPayload } from '../../services/holiday/Type/type';


const HolidayComponent: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [rowData, setRowData] = useState<Holiday[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<(string | number)[] | 'All'>([]);
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
      value: i + 1,
      label: `Class ${i + 1}`,
    })),
  ];

  const options = [{ value: 'All', label: 'All Classes' }, ...classes];

  useEffect(() => {
    const loadHolidays = async () => {
      try {
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
      }
    };

    loadHolidays();
  }, []);


  //  handle Delete Button Click
  const handleDeleteButtonClick = async (holidayId: string) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        // Call the API to delete the holiday
        await deleteHolidayApi(holidayId);
  
        // Update the grid by removing the row
        setRowData((prevData) => prevData.filter((row) => row.id !== holidayId));
  
        alert('Holiday deleted successfully!');
      } catch (error) {
        console.error('Error deleting holiday:', error);
        alert('Failed to delete the holiday. Please try again.');
      }
    }
  };
  const handleClassSelection = (selectedOptions: any) => {
    if (selectedOptions.some((opt: any) => opt.value === 'All')) {
      setSelectedClasses('All');
    } else {
      setSelectedClasses(selectedOptions.map((opt: any) => opt.value));
    }
  };

  const handleHolidayDateChange = (field: 'startDate' | 'endDate' | 'description', value: string) => {
    setHolidayDate((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      holidayDate.startDate === '' ||
      holidayDate.endDate === '' ||
      (selectedClasses.length === 0 && selectedClasses !== 'All')
    ) {
      alert('Please fill in all fields.');
      return;
    }

    const payload: HolidayPayload = {
      className: selectedClasses === 'All' ? classes.map((cls) => cls.value) : selectedClasses,
      date: [
        {
          id: '',
          startDate: formatToDDMMYYYY(holidayDate.startDate),
          endDate: formatToDDMMYYYY(holidayDate.endDate),
          description: holidayDate.description,
        },
      ],
    };

    try {
      await saveHoliday(payload);
      alert('Holiday Created Successfully!');
      setShowForm(false);
    } catch (error) {
      alert('Failed to create holiday. Please try again.');
    }
  };

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Class', field: 'className', sortable: true, filter: true },
    { headerName: 'Start Date', field: 'startDate', sortable: true, filter: true },
    { headerName: 'End Date', field: 'endDate', sortable: true, filter: true },
    { headerName: 'Description', field: 'description', sortable: true, filter: true },
    {
      field: 'delete',
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <button
          className="bi bi-trash text-red-600"
          onClick={() => handleDeleteButtonClick(params.data.id)}
        >
         
        </button>
      ),
    },
  ];

  return (
    <div className="box ">
      {!showForm ? (
        <>
          <div className="text-right">
            <h1 className='text-2xl text-center font-bold mb-2'>Holidays</h1>
            <button onClick={() => setShowForm(true)} className="btn btn-default">
              Add Holiday
            </button>
          </div>
          <GridView rowData={rowData} columnDefs={columnDefs} />
        </>
      ) : (
        <div className='box'>

          <h2 className=" text-2xl font-bold mb-10 text-center">Holiday</h2>
          <div className="flex flex-row items-center justify-center space-x-10 ">
            <div className="mb-4 w-1/2">
              <h3 className="font-semibold mb-2">Select Classes:</h3>
              <Select
                isMulti
                options={options}
                onChange={handleClassSelection}
                className="basic-multi-select mb-4"
                classNamePrefix="select"
                placeholder="Select Classes..."
              />
              <label className="block mb-2 font-semibold">Description:</label>
              <input
                type="text"
                placeholder="Optional holiday description"
                className="w-full border px-3 py-2 rounded-md "
                value={holidayDate.description}
                onChange={(e) => handleHolidayDateChange('description', e.target.value)}
              />
            </div>
            <div className="mb-4 w-1/2 pd-4">
              <label className="block mb-2 font-semibold">Start Date:</label>
              <input
                type="date"
                className="w-full border px-3 py-2 mb-4 rounded-md"
                value={holidayDate.startDate}

                onChange={(e) => handleHolidayDateChange('startDate', e.target.value)}
              />
              <label className="block mb-2 font-semibold">End Date:</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded-md"
                value={holidayDate.endDate}
                onChange={(e) => handleHolidayDateChange('endDate', e.target.value)}
              />
            </div>
            {/* <div className="mb-4 w-1/2">
            
          </div> */}
          </div>
          <div className="text-center mt-10">
            <button
              type="button"
              className="w-1/8 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="w-1/8 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 ml-4"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayComponent;







