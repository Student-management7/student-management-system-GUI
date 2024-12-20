import React, { useState, useMemo } from 'react';
import axiosInstance from '../../services/Utils/apiUtils';
import { formatToDDMMYYYY } from '../Utils/dateUtils';

// Enhanced type definition
type NotificationPayload = {
  startDate: string;
  endDate: string;
  description: string;
  cato: 'Student' | 'Teacher' | 'Staff' | 'All' | 'Event' | 'Holiday' | 'Exam';
  className: string[];
};



const CreateNotification: React.FC = () => {
  const [formData, setFormData] = useState<NotificationPayload>({
    startDate: '',
    endDate: '',
    description: '',
    cato: 'Student',
    className: [],
  });

  const classOptions = useMemo(
    () => ['LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `${i + 1}`)],
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof NotificationPayload]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClasses = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      className: selectedClasses,
    }));
  };

  const isFormValid = () => {
    const { startDate, endDate, description, cato } = formData;
    return (
      startDate &&
      endDate &&
      description.trim().length > 0 &&
      cato &&
      new Date(startDate) <= new Date(endDate)
    );
  };

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      description: '',
      cato: 'Student',
      className: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert('Please fill all required fields correctly');
      return;
    }

    // Format dates before sending
    const formattedData = {
      ...formData,
      startDate: formatToDDMMYYYY(formData.startDate),
      endDate: formatToDDMMYYYY(formData.endDate),
    };

    try {
      const response = await axiosInstance.post(
        'https://s-m-s-keyw.onrender.com/notification/save',
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Notification created successfully!');
      resetForm();
    } catch (error: unknown) {
      alert(`Error creating notification: ${error}`);
      console.error('Submission Error:', error);
    }
  };

  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="box">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="form-control"
                      value={formData.startDate}
                      onChange={handleDateChange}
                      min={getTodayDate()}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      className="form-control"
                      value={formData.endDate}
                      onChange={handleDateChange}
                      min={formData.startDate || getTodayDate()}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      maxLength={500}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cato" className="form-label">Category</label>
                    <select
                      id="cato"
                      name="cato"
                      className="form-select"
                      value={formData.cato}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="All">All</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Staff">Staff</option>
                      <option value="Event">Event</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Exam">Exam</option>
                    </select>

                  </div>

                  {formData.cato === 'Student' && (
                    <div className="mb-3">
                      <label htmlFor="className" className="form-label">Class</label>
                      <select
                        id="className"
                        multiple
                        className="form-select"
                        value={formData.className}
                        onChange={handleClassChange}
                        required
                      >
                        {classOptions.map(cls => (
                          <option key={cls} value={cls}>
                            {cls === 'LKG' || cls === 'UKG' ? cls : `Class ${cls}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`btn w-100 ${isFormValid() ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={!isFormValid()}
                  >
                    Save Notification
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;


