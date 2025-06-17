import React from "react";
import SyllabusForm from "./SyllabusForm";
import { useSyllabusController } from "./SyllabusController";
import { useNavigate } from "react-router-dom";

const UploadSyllabus: React.FC = () => {
  const { upload } = useSyllabusController();
  const navigate = useNavigate();

  const handleUpload = async (data: any) => {
    try {
      const formData = new FormData();
      
      // Handle file upload (either direct file or converted PDF)
      const fileToUpload = data.pdfFile || (data.file?.[0] instanceof File ? data.file[0] : null);
      
      if (!fileToUpload) {
        throw new Error("No valid file to upload");
      }
      
      formData.append("file", fileToUpload);

      // Prepare query parameters
      const params = {
        tittle: data.title,  // Note: backend expects "tittle" with two 't's
        subject: data.subject,
        publish: String(data.publish),
        cls: data.class,
      };

      // Upload with proper error handling
      await upload(params, formData);
      navigate("/syllabus");
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return <SyllabusForm onSubmit={handleUpload} loading={false} />;
};

export default UploadSyllabus;