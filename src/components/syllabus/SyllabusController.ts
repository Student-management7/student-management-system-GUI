import { useState } from 'react';
import {
  getAllSyllabus,
  uploadSyllabus,
  updateSyllabus,
  deleteSyllabus,
  downloadSyllabus,
} from '../../services/syllabusServices/syllabusService';
import { Syllabus } from '../../services/syllabusServices/syllabus.types';
import { toast } from 'react-toastify';


export const useSyllabusController = () => {
  const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const res = await getAllSyllabus();
      setSyllabusList(res.data);
    } finally {
      setLoading(false);
    }
  };

  const upload = async (params: Record<string, string>, data: FormData) => {
    setLoading(true);
    try {
      return await uploadSyllabus(params, data);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data: FormData) => {
    setLoading(true);
    try {
      return await updateSyllabus(data);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      return await deleteSyllabus(id);
    } finally {
      setLoading(false);
    }
  };

 const handleDownload = async (id: string, name: string) => {
  setLoading(true);
  try {
    const response = await downloadSyllabus(id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    toast.success("Download started successfully");
  } catch (error) {
    toast.error("Failed to download file");
    console.error("Download error:", error);
  } finally {
    setLoading(false);
  }
};


  
  return {
    syllabusList,
    loading,
    fetchSyllabus,
    upload,
    update,
    remove,
    handleDownload,
  };
};