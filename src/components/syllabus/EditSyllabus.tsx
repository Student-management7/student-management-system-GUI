import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import SyllabusForm from "../syllabus/SyllabusForm";
import { useSyllabusController } from "../syllabus/SyllabusController";
import { toast } from "react-toastify";

const EditSyllabus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { update, loading } = useSyllabusController();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('[EditSyllabus] Location state:', location.state);
  console.log('[EditSyllabus] URL params id:', id);

  // Get data from navigation state
  const current = location.state?.syllabusData;

  console.log('[EditSyllabus] Current syllabus data:', current);

  const handleUpdate = async (data: any) => {
    console.log('[EditSyllabus] Form submission data:', data);
    
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("cls", data.class);
    formData.append("subject", data.subject);
    formData.append("publish", String(data.publish));
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }
    formData.append("id", id || "");

    console.log('[EditSyllabus] FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await update(formData);
      toast.success("Updated successfully!");
      navigate("/syllabus");
    } catch (err) {
      console.error('[EditSyllabus] Update error:', err);
      toast.error("Update failed.");
    }
  };

  if (!current) {
    console.error('[EditSyllabus] No syllabus data found in location state');
    return (
      <div className="text-center mt-10 text-gray-500">
        No syllabus data found. Please go back and try again.
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 button"
        >
          Go Back
        </button>
      </div>
    );
  }

  console.log('[EditSyllabus] Rendering form with data:', current);
  
  return (
    
      <SyllabusForm
        onSubmit={handleUpdate}
        loading={loading}
        isEditMode={true}
        defaultValues={{
          title: current.title,
          class: current.cls,
          subject: current.subject,
          publish: current.publish,
        }}
      />
  );
};

export default EditSyllabus;