import React, { useEffect, useState } from "react";
import { useSyllabusController } from "./SyllabusController";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiPlus, FiFilter, FiDownload, FiEdit, FiTrash2 } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SyllabusList: React.FC = () => {
  const { syllabusList, fetchSyllabus, loading, remove, handleDownload } = useSyllabusController();
  const navigate = useNavigate();
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  useEffect(() => {
    // Extract unique classes and subjects when syllabusList changes
    const classes = Array.from(new Set(syllabusList.map(item => item.cls)));
    setAvailableClasses(classes);

    // If class filter is set, filter subjects for that class
    if (classFilter) {
      const subjectsForClass = Array.from(new Set(
        syllabusList
          .filter(item => item.cls === classFilter)
          .map(item => item.subject)
      ));
      setAvailableSubjects(subjectsForClass);
    } else {
      const allSubjects = Array.from(new Set(syllabusList.map(item => item.subject)));
      setAvailableSubjects(allSubjects);
    }

    // Apply filters
    let result = syllabusList;
    if (classFilter) {
      result = result.filter(item => item.cls === classFilter);
    }
    if (subjectFilter) {
      result = result.filter(item => item.subject === subjectFilter);
    }
    setFilteredList(result);
  }, [syllabusList, classFilter, subjectFilter]);

  const handleEdit = (id: string) => {
    navigate(`/syllabus/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this syllabus document?")) {
      try {
        await remove(id);
        toast.success("Syllabus deleted successfully");
        fetchSyllabus();
      } catch (error) {
        toast.error("Failed to delete syllabus");
      }
    }
  };

 

  const resetFilters = () => {
    setClassFilter("");
    setSubjectFilter("");
  };

  return (

    <>
    <div className="box">
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 ">
        <h1 className="head1">Syllabus Documents</h1>
        <button
          onClick={() => navigate("/UploadSyllabus")}
          className="button float-right"
        >     
          
          Add Syllabus
        </button>
      </div>

      {/* Filter Section */}
      <div className=" p-6 mb-8">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Filter Syllabus</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setSubjectFilter(""); // Reset subject when class changes
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!classFilter && availableSubjects.length > 0}
            >
              <option value="">All Subjects</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <PulseLoader color="#3B82F6" size={10} />
        </div>
      )}

      {/* Syllabus List */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {syllabusList.length === 0 ? (
                "No syllabus documents found. Upload your first document!"
              ) : (
                "No documents match your filters. Try adjusting your criteria."
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredList.map((syllabus, index) => (
                <li key={syllabus.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    {/* Status Indicator */}
                    <div className="flex items-center justify-center mr-4 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${syllabus.publish
                            ? "border-green-500 bg-green-100"
                            : "border-gray-300 bg-gray-100"
                          }`}
                      >
                        {syllabus.publish && (
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    </div>

                    {/* Syllabus Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {index + 1}. {syllabus.tittle}
                        </h3>
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleDownload(syllabus.id, syllabus.name)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Download"
                            
                          >
                            <FiDownload size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(syllabus.id)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(syllabus.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-1">Class:</span>
                          {syllabus.cls}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-1">Subject:</span>
                          {syllabus.subject}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-1">Status:</span>
                          <span className={syllabus.publish ? "text-green-600" : "text-gray-500"}>
                            {syllabus.publish ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-gray-500 truncate">
                        <span className="font-medium">File:</span> {syllabus.name}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default SyllabusList;