import React from "react";
import { Syllabus } from "../../services/syllabusServices/syllabus.types";
import { FiEdit2, FiTrash2, FiFile, FiDownload, FiClock, FiUser } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

type Props = {
  data: Syllabus;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const SyllabusCard: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Card Header with Status */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {data.tittle}
        </h3>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            data.publish
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {data.publish ? "Published" : "Draft"}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <FaChalkboardTeacher className="text-gray-400 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Class</p>
              <p className="font-medium text-gray-700">{data.cls}</p>
            </div>
          </div>

          <div className="flex items-center">
            <FiUser className="text-gray-400 mr-2 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Subject</p>
              <p className="font-medium text-gray-700">{data.subject}</p>
            </div>
          </div>

          <div className="flex items-center col-span-2">
            <FiFile className="text-gray-400 mr-2 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs text-gray-500">File</p>
              <p className="font-medium text-gray-700 truncate">{data.name}</p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <FiClock className="mr-2" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Card Footer with Actions */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
        <button
          onClick={() => {/* Add download functionality here */}}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiDownload className="mr-2" />
          <span className="text-sm font-medium">Download</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(data.id)}
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            aria-label="Edit syllabus"
          >
            <FiEdit2 className="mr-2" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            aria-label="Delete syllabus"
          >
            <FiTrash2 className="mr-2" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyllabusCard;