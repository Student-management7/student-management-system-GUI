import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassData } from "../../services/SaveSubjects/Type";
import { API_ENDPOINTS } from "../../services/SaveSubjects/Api";
import axiosInstance from "../../services/Utils/apiUtils";



interface SaveSubjectsToClassesProps {
  onClose: () => void;
  onSave: (updatedData: ClassData[]) => void;
}

const allSubjects = [
  "Maths", "Science", "English", "History", "Geography",
  "Physics", "Chemistry", "Biology", "Algebra", "Geometry",
];

const SaveSubjectsToClasses: React.FC<SaveSubjectsToClassesProps> = ({ onClose, onSave }) => {
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classOptions, setClassOptions] = useState<string[]>(["LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState<string>("");
  const [newClass, setNewClass] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleClassSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const className = event.target.value;
    setSelectedClass(className);
    const existingClass = classData.find((cls) => cls.className === className);
    setSelectedSubjects(existingClass ? existingClass.subject : []);
  };

  const handleAddNewClass = () => {
    if (newClass && !classOptions.includes(newClass)) {
      setClassOptions([...classOptions, newClass]);
      setNewClass("");
    } else {
      toast.error("Class already exists or is invalid!");
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((s) => s !== subject)
        : [...prevSubjects, subject]
    );
  };

  const handleAddCustomSubject = () => {
    if (customSubject && !allSubjects.includes(customSubject)) {
      allSubjects.push(customSubject);
      setSelectedSubjects([...selectedSubjects, customSubject]);
      setCustomSubject("");
    } else {
      toast.error("Subject already exists or is invalid!");
    }
  };

  const handleSave = async () => {
    if (!selectedClass || selectedSubjects.length === 0) {
      toast.error("Please select a class and subjects.");
      return;
    }

    setLoading(true);
    const updatedClassData = classData.filter((cls) => cls.className !== selectedClass);
    updatedClassData.push({ className: selectedClass, subject: selectedSubjects });

    try {
      const payload = { classData: updatedClassData };
      await axiosInstance.post(API_ENDPOINTS.SAVE_CLASS_DATA, payload);
      setClassData(updatedClassData);
      toast.success("Class and subject data saved successfully!");
      onSave(updatedClassData);
      onClose();
    } catch (error: any) {
      console.error("Error saving class data:", error.message || error);
      toast.error("Failed to save class and subject data.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  <div className="box">
  <div className="bg-gray-100 min-h-screen p-4 md:p-6 flex items-center justify-center">
      <div className="box bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Save Subjects</h2>

        <label className="block mb-4">
          <span className="text-gray-600">Select Class:</span>
          <select
            value={selectedClass}
            onChange={handleClassSelect}
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Class</option>
            {classOptions.map((classOption, index) => (
              <option key={index} value={classOption}>
                Class {classOption}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Enter class name"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddNewClass}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {selectedClass && (
          <div className="box mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Select Subjects for Class {selectedClass}:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {allSubjects.map((subject) => (
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

            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Add custom subject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCustomSubject}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !selectedClass || selectedSubjects.length === 0}
            className={`py-2 px-4 rounded-md ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>
  </>
  );
};

export default SaveSubjectsToClasses;
