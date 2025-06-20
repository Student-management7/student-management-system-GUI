import React, { useEffect, useState } from "react";
import { useSyllabusController } from "./SyllabusController";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiDownload, FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/loader";
import { sortArrayByKey } from "../Utils/sortArrayByKey";

const SyllabusList: React.FC = () => {
  const {
    syllabusList,
    fetchSyllabus,
    loading,
    remove,
    handleDownload,
    updatePublishStatus
  } = useSyllabusController();
  const navigate = useNavigate();
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [modifiedStatus, setModifiedStatus] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  useEffect(() => {
    // Extract unique classes and subjects when syllabusList changes
    const classes = Array.from(new Set(syllabusList.map(item => item.cls)));
    const sortClasses = sortArrayByKey(classes, "className");
    setAvailableClasses(sortClasses);

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

    // Reset modified status when filters change
    setModifiedStatus({});
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

  const handleStatusChange = (id: string, currentStatus: boolean) => {
    setModifiedStatus(prev => ({
      ...prev,
      [id]: !currentStatus
    }));
  };

  const handleUpdateStatus = async () => {
    if (Object.keys(modifiedStatus).length === 0) {
      toast.info("No changes to update");
      return;
    }

    const payload = Object.entries(modifiedStatus).map(([id, publish]) => ({
      id,
      publish: publish.toString()
    }));

    try {
      setIsUpdating(true);
      await updatePublishStatus(payload);
      toast.success("Status updated successfully");
      fetchSyllabus();
      setModifiedStatus({});
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const resetFilters = () => {
    setClassFilter("");
    setSubjectFilter("");
  };

  const getCurrentStatus = (id: string, defaultStatus: boolean) => {
    return modifiedStatus.hasOwnProperty(id) ? modifiedStatus[id] : defaultStatus;
  };

  return (
    <>
      <div className="box">
        <div className="container mx-auto">
          <ToastContainer position="top-right" autoClose={3000} />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="head1">Syllabus Documents</h1>
            <button
              onClick={() => navigate("/UploadSyllabus")}
              className="button float-right"
            >
              Add Syllabus
            </button>
          </div>

          {/* Filter Section */}
          <div className="p-6 mb-8">
            <div className="flex items-center mb-4">
              <FiFilter className="text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-700">Filter Syllabus</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Class</label>
                <select
                  value={classFilter}
                  onChange={(e) => {
                    setClassFilter(e.target.value);
                    setSubjectFilter(""); // Reset subject when class changes
                  }}
                  className="w-full p-2 form-control"
                >
                  <option value="">All Classes</option>
                  {availableClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Subject</label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full p-2 form-control"
                  disabled={!classFilter && availableSubjects.length > 0}
                >
                  <option value="">All Subjects</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={resetFilters}
                  className="button text-lg flex-1"
                >
                  Reset
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || Object.keys(modifiedStatus).length === 0}
                  className="button text-lg flex-1 "
                >
                  {isUpdating ? "Publishing..." : "Publish Syllabus"}
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && <Loader />}

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
                        {/* Status Checkbox */}
                        <div className="flex items-center justify-center mr-4 mt-1">
                          <input
                            type="checkbox"
                            checked={getCurrentStatus(syllabus.id, syllabus.publish)}
                            onChange={() => handleStatusChange(syllabus.id, getCurrentStatus(syllabus.id, syllabus.publish))}
                            className="w-5 h-5 rounded border-2 text-blue-600 focus:ring-blue-500"
                          />
                        </div>

                        {/* Syllabus Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900 truncate">
                              {index + 1}. {syllabus.title}
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
                                onClick={() => {
                                  // Add replace: true to maintain history state
                                  navigate(`/syllabus/edit/${syllabus.id}`, {
                                    state: { syllabusData: syllabus },
                                    replace: true // This prevents adding to history stack
                                  });
                                }}
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
                              <span className={getCurrentStatus(syllabus.id, syllabus.publish) ? "text-green-600" : "text-gray-500"}>
                                {getCurrentStatus(syllabus.id, syllabus.publish) ? "Published" : "Draft"}
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