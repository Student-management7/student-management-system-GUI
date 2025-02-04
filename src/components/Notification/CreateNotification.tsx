import React, { useState, useMemo } from "react";
import axiosInstance from "../../services/Utils/apiUtils";
import { formatToDDMMYYYY } from "../Utils/dateUtils";

type NotificationPayload = {
  startDate: string;
  endDate: string;
  description: string;
  cato: "Student" | "Teacher" | "Staff" | "All" | "Event" | "Holiday" | "Exam";
  className: string[];
};

interface NotificationCreateProps {
  onClose: () => void;
}

const NotificationCreate: React.FC<NotificationCreateProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<NotificationPayload>({
    startDate: "",
    endDate: "",
    description: "",
    cato: "Student",
    className: [],
  });

  const classOptions = useMemo(
    () => ["LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `${i + 1}`)],
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof NotificationPayload]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClasses = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prev) => ({
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
      startDate: "",
      endDate: "",
      description: "",
      cato: "Student",
      className: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill all required fields correctly");
      return;
    }

    const formattedData = {
      ...formData,
      startDate: formatToDDMMYYYY(formData.startDate),
      endDate: formatToDDMMYYYY(formData.endDate),
    };

    try {
      await axiosInstance.post(
        "https://s-m-s-keyw.onrender.com/notification/save",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Notification created successfully!");
      resetForm();
    } catch (error: unknown) {
      alert(`Error creating notification: ${error}`);
      console.error("Submission Error:", error);
    }
  };

  const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="box">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-sm p-4">
              <h2 className="head1 text-center">Create Notification</h2>

              <form onSubmit={handleSubmit}>
                <div className="row row-cols-1 row-cols-md-2 g-3">
                  <div className="col">
                    <label htmlFor="startDate" className="form-label fw-bold">
                      Start Date
                    </label>
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

                  <div className="col">
                    <label htmlFor="endDate" className="form-label fw-bold">
                      End Date
                    </label>
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

                  <div className="col">
                    <label htmlFor="cato" className="form-label fw-bold">
                      Category
                    </label>
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

                  {formData.cato === "Student" && (
                    <div className="col">
                      <label htmlFor="className" className="form-label fw-bold">
                        Class
                      </label>
                      <select
                        id="className"
                        multiple
                        className="form-select"
                        value={formData.className}
                        onChange={handleClassChange}
                        required
                      >
                        {classOptions.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls === "LKG" || cls === "UKG"
                              ? cls
                              : `Class ${cls}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="col-12">
                    <label htmlFor="description" className="form-label fw-bold">
                      Description
                    </label>
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

                  <div className="col-12 text-center mt-3">
                    <button
                      type="submit"
                      className={`btn button ${
                        isFormValid() ? "btn-primary" : "btn-secondary"
                      } px-4 py-2`}
                      disabled={!isFormValid()}
                    >
                      Save Notification
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCreate;
