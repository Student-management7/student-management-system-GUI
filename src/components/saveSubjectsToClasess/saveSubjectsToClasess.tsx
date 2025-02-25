import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassData } from "../../services/SaveSubjects/Type";
import axiosInstance from "../../services/Utils/apiUtils";

interface SaveSubjectsToClassesProps {
  onClose: () => void;
  onSave: () => void;
  editableRow?: ClassData;

}



const allSubjects = [
  "Maths", "Science", "English", "History", "Geography",
  "Physics", "Chemistry", "Biology", "Algebra", "Geometry",
];

const SaveSubjectsToClasses: React.FC<SaveSubjectsToClassesProps> = ({
  onClose,
  onSave,
  editableRow,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState<string>("");
  const [newClass, setNewClass] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState<string[]>([
    "Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
  ]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>(allSubjects);

  // Initialize form with editableRow data
  useEffect(() => {
    if (editableRow) {
      console.log("Editable Row Data:", editableRow); // Debugging: Log editableRow
      setSelectedClass(editableRow.data?.className || ""); // Access className from editableRow.data
      setSelectedSubjects(
        typeof editableRow.data?.subject === "string"
          ? editableRow.data.subject.split(", ") // Convert string to array
          : Array.isArray(editableRow.data?.subject)
          ? editableRow.data.subject
          : []
      );
    } else {
      setSelectedClass(""); // Reset selected class if not in edit mode
      setSelectedSubjects([]); // Reset selected subjects
    }
  }, [editableRow]);

  // Handle class selection
  const handleClassSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
  };

  // Handle adding a new class
  const handleAddNewClass = () => {
    const trimmedClass = newClass.trim();
    if (!trimmedClass) {
      toast.error("Please enter a class name!");
      return;
    }

    if (classOptions.includes(trimmedClass)) {
      toast.error("Class already exists!");
      return;
    }

    setClassOptions((prev) => [...prev, trimmedClass]);
    setNewClass("");
    toast.success("New class added successfully!");
  };

  // Handle toggling subjects
  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Handle adding a custom subject
  const handleAddCustomSubject = () => {
    const trimmedSubject = customSubject.trim();
    if (!trimmedSubject) {
      toast.error("Please enter a subject name!");
      return;
    }

    if (availableSubjects.includes(trimmedSubject)) {
      toast.error("Subject already exists!");
      return;
    }

    setAvailableSubjects((prev) => [...prev, trimmedSubject]);
    setSelectedSubjects((prev) => [...prev, trimmedSubject]);
    setCustomSubject("");
    toast.success("New subject added successfully!");
  };

  // Validate inputs
  const validateInputs = () => {
    if (!selectedClass) {
      toast.error("Please select a class!");
      return false;
    }

    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject!");
      return false;
    }

    return true;
  };

  // Prepare payload for API
  const preparePayload = () => {
    return {
      classData: [
        {
          className: selectedClass.trim(),
          subject: [...new Set(selectedSubjects.map((subject) => subject.trim()))],
        },
      ],
    };
  };

  // Handle saving new class
  const handleSaveNewClass = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const payload = preparePayload();
      console.log("Save Payload:", payload);

      const response = await axiosInstance.post("class/save", payload);
      toast.success("Class and subjects saved successfully!");
      onSave();
    } catch (error: any) {
      console.error("Error saving class data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle updating class
  const handleUpdateClass = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const payload = preparePayload();
      console.log("Update Payload:", payload);

      const response = await axiosInstance.post(
        `class/edit?className=${encodeURIComponent(editableRow?.className || "")}`,
        payload
      );
      toast.success("Class and subjects updated successfully!");
      onSave();
    } catch (error: any) {
      console.error("Error updating class data:", error);
      toast.error(
        error.response?.data?.message || "Failed to update data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div>
        <h2 className="head1 mb-4 text-center text-gray-700">
          <i onClick={onClose} className="bi bi-arrow-left-circle m-3" />
          {editableRow ? "Update Subjects" : "Save Subjects"}
        </h2>

        <div className="mb-6">
          <label className="block mb-4">
            <span className="text-gray-600">Select Class:</span>
            <select
              value={selectedClass} // Bind value to selectedClass
              onChange={handleClassSelect}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Class</option>
              {classOptions.map((classOption) => (
                <option key={classOption} value={classOption}>
                  Class {classOption}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="Add New Class"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNewClass}
              className="btn button text-white md:block"
            >
              Add Class
            </button>
          </div>
        </div>

        {selectedClass && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Select Subjects for Class {selectedClass}:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubjects.map((subject) => (
                <label key={subject} className="flex items-center space-x-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    className="rounded focus:ring-blue-500"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter new subject name"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCustomSubject}
                className="btn button"
              >
                Add Subject
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between space-x-4">
          <button onClick={onClose} className="btn buttonred">
            Cancel
          </button>
          <button
            onClick={editableRow ? handleUpdateClass : handleSaveNewClass}
            disabled={loading || !selectedClass}
            className={`py-2 px-4 rounded-md ${loading || !selectedClass || selectedSubjects.length === 0
                ? "btn button"
                : "btn button"
              } text-white`}
          >
            {loading ? "Saving..." : editableRow ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSubjectsToClasses;