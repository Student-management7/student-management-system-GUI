import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassData } from "../../services/SaveSubjects/Type";
import axiosInstance from "../../services/Utils/apiUtils";

interface SaveSubjectsToClassesProps {
  onClose: () => void;
  onSave: (updatedData: ClassData) => void;
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

  useEffect(() => {
    if (editableRow) {
      setSelectedClass(editableRow.className || "");

      // Ensure subjects are correctly set from editableRow
      const normalizedSubjects = Array.isArray(editableRow.subject)
        ? editableRow.subject.map(sub => (typeof sub === 'string' ? sub.trim() : '')).filter(Boolean)
        : [];

      setSelectedSubjects(normalizedSubjects);

      // Add subjects to availableSubjects if missing
      setAvailableSubjects(prevSubjects => {
        const newSubjects = normalizedSubjects.filter(sub => !prevSubjects.includes(sub));
        return [...prevSubjects, ...newSubjects];
      });
    }
  }, [editableRow]);


  const handleClassSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
  };

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

    setClassOptions(prev => [...prev, trimmedClass]);
    setNewClass("");
    toast.success("New class added successfully!");
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

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

    setAvailableSubjects(prev => [...prev, trimmedSubject]);
    setSelectedSubjects(prev => [...prev, trimmedSubject]);
    setCustomSubject("");
    toast.success("New subject added successfully!");
  };

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

  const preparePayload = () => {
    return {
      classData: [
        {
          className: selectedClass.trim(),
          subject: [...new Set(selectedSubjects.map(subject => subject.trim()))]
        }
      ]
    };
  };

  const handleSaveNewClass = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const payload = preparePayload();
      console.log("Save Payload:", payload);

      const response = await axiosInstance.post("class/save", payload);
      toast.success("Class and subjects saved successfully!");
      onSave(response.data);
    } catch (error: any) {
      console.error("Error saving class data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const payload = preparePayload();
      console.log("Update Payload:", payload);

      if (!editableRow?.className?.trim()) {
        throw new Error("Invalid class name for update.");
      }

      const response = await axiosInstance.post(
        `class/edit?className=${encodeURIComponent(editableRow.className.trim())}`,
        payload
      );

      toast.success("Class and subjects updated successfully!");
      onSave(response.data);
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
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
            {editableRow ? "Update Subjects" : "Save Subjects"}
          </h2>

          <div className="mb-6">
            <label className="block mb-4">
              <span className="text-gray-600">Select Class:</span>
              <select
                value={selectedClass}
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

            <div className="flex gap-2 mb-4" hidden = {!!editableRow}>
              <input
                type="text"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                placeholder={!!editableRow ? "hidden" : "Add New Class"} 
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
            <button
              onClick={onClose}
              className="btn buttonred"
            >
              Cancel
            </button>

            <button
              onClick={editableRow ? handleUpdateClass : handleSaveNewClass}
              disabled={loading || !selectedClass}
              className={`py-2 px-4 rounded-md ${loading || !selectedClass || selectedSubjects.length === 0
                  ? "btn button "
                  : "btn button "
                } text-white`}
            >
              {loading ? "Saving..." : editableRow ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSubjectsToClasses;