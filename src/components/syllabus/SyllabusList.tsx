import React, { useEffect } from "react";
import SyllabusCard from "./SyllabusCard";
import { useSyllabusController } from "./SyllabusController";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiPlus } from "react-icons/fi";
import { PulseLoader } from "react-spinners";

const SyllabusList: React.FC = () => {
  const { syllabusList, fetchSyllabus, loading, remove } = useSyllabusController();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/syllabus/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this syllabus document?")) {
      await remove(id);
      fetchSyllabus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">Syllabus Documents</h1>
            <p className="text-gray-600">Manage and organize your syllabus materials</p>
          </div>
          <button
            onClick={() => navigate("/UploadSyllabus")}
            className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            <FiPlus className="mr-2" />
            Upload New Syllabus
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <PulseLoader color="#3B82F6" size={15} />
          </div>
        ) : syllabusList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiUpload className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No syllabus documents found</h3>
            <p className="text-gray-500 mb-4">Upload your first syllabus document to get started</p>
            <button
              onClick={() => navigate("/UploadSyllabus")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload Syllabus
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {syllabusList.map((item) => (
              <SyllabusCard
                key={item.id}
                data={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusList;