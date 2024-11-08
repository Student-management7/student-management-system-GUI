import React, { useState } from "react";
import axios from "axios";
import { ClassData } from "../../services/SaveSubjects/Type";
import { API_ENDPOINTS } from "../../services/SaveSubjects/Api";

const allSubjects = [
    "Maths", "Science", "English", "History", "Geography", 
    "Physics", "Chemistry", "Biology", "Algebra", "Geometry"
];

const SaveSubjectsToClasses: React.FC = () => {
    const [classData, setClassData] = useState<ClassData[]>([]);
    const [classOptions, setClassOptions] = useState<string[]>(["LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [customSubject, setCustomSubject] = useState<string>("");
    const [newClass, setNewClass] = useState<string>("");

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
        }
    };

 
const handleSave = () => {
    // Filter out the existing class if it exists, then add the updated one
    const updatedClassData = classData.filter((cls) => cls.className !== selectedClass);
    updatedClassData.push({ className: selectedClass, subject: selectedSubjects });

    // Update classData state with new class information
    setClassData(updatedClassData);

    // Construct the payload in the required format
    const payload = { classData: updatedClassData };

    // Print the payload to the console for debugging
    console.log("Payload to be saved on the server:", JSON.stringify(payload, null, 2));

    // Send payload to the server
    axios.post(API_ENDPOINTS.SAVE_CLASS_DATA, payload)
        .then(() => alert("Class and subject data saved successfully!"))
        .catch((error) => console.error("Error saving class data:", error));
};


    return (
        <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Save Subjects to Classes</h2>

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

                <div className="mb-6">
                    <div className="flex items-center mt-2">
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
                </div>

                {selectedClass && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Subjects for Class {selectedClass}:</h3>
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

                <button
                    onClick={handleSave}
                    disabled={!selectedClass || selectedSubjects.length === 0}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SaveSubjectsToClasses;
