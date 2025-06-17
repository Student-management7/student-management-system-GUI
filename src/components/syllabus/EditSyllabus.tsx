import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SyllabusForm from "../syllabus/SyllabusForm";
import { useSyllabusController } from "../syllabus/SyllabusController";
import { Syllabus } from "../../services/syllabusServices/syllabus.types";

const EditSyllabus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { syllabusList, fetchSyllabus, update } = useSyllabusController();
  const [current, setCurrent] = useState<Syllabus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSyllabus(); // ensure data is loaded
  }, []);

  useEffect(() => {
    const found = syllabusList.find((item) => item.id === id);
    if (found) setCurrent(found);
  }, [syllabusList, id]);

  const handleUpdate = async (data: any) => {
    const formData = new FormData();
    formData.append("tittle", data.title);
    formData.append("discription", data.description);
    formData.append("cls", data.class);
    formData.append("subject", data.subject);
    formData.append("publish", String(data.publish));
    formData.append("file", data.file[0]);
    formData.append("id", id || "");

    try {
      await update(formData);
      alert("Updated successfully!");
      navigate("/syllabus");
    } catch (err) {
      alert("Update failed.");
    }
  };

  if (!current) {
    return <p className="text-center mt-10 text-gray-500">Loading document...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Syllabus</h2>
      <SyllabusForm
        onSubmit={handleUpdate}
        defaultValues={{
          title: current.title,
          description: current.description || "",
          class: current.class,
          subject: current.subject,
          publish: current.publish,
        }}
      />
    </div>
  );
};

export default EditSyllabus;
