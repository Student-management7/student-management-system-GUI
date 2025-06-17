import React from "react";
import SyllabusForm from "./SyllabusForm";
import { useSyllabusController } from "./SyllabusController";
import { useNavigate } from "react-router-dom";

const UploadSyllabus: React.FC = () => {
  const { upload } = useSyllabusController();
  const navigate = useNavigate();

  const handleUpload = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("class", data.class);
    formData.append("subject", data.subject);
    formData.append("publish", String(data.publish));
    
    // Use either the uploaded file or the generated PDF
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    } else if (data.pdfFile) {
      formData.append("file", data.pdfFile);
    }

    try {
      await upload(formData);
      alert("Syllabus uploaded successfully!");
      navigate("/syllabus");
    } catch (err) {
      alert("Upload failed. Please try again.");
      console.error("Upload error:", err);
    }
  };

  return (
    <>
  

    <div className=" box min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <SyllabusForm 
          onSubmit={handleUpload} 
          onCancel={() => navigate("/syllabus")} 
        />
      </div>
    </div>
    </>

  );
};

export default UploadSyllabus;