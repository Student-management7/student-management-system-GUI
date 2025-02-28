import React from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';

interface HolidayFormProps {
  onSubmit: (values: {
    selectedClasses: (string | number)[];
    startDate: string;
    endDate: string;
    description: string;
  }) => void;
  onCancel: () => void;
  classes: { value: string; label: string }[];
}

const HolidayForm: React.FC<HolidayFormProps> = ({ onSubmit, onCancel, classes }) => {
  const options = [{ value: 'All', label: 'All Classes' }, ...classes];

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
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleClassSelection = (selectedOptions: any) => {
    if (selectedOptions.some((opt: any) => opt.value === 'All')) {
      formik.setFieldValue('selectedClasses', ['All']);
    } else {
      formik.setFieldValue('selectedClasses', selectedOptions.map((opt: any) => opt.value));
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="head1 mb-10 text-left">
        <i onClick={onCancel} className="bi bi-arrow-left-circle m-2 cursor-pointer" />
        Holiday
      </h2>
    <div className="box">
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
            className="w-full border px-3 py-2 rounded-md "
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
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
    </>
  );
};

export default HolidayForm;