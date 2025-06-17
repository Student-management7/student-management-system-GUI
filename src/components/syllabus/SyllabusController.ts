import { useState } from 'react';
import {
  getAllSyllabus,
  uploadSyllabus,
  updateSyllabus,
  deleteSyllabus,
} from '../../services/syllabusServices/syllabusService';
import { Syllabus } from '../../services/syllabusServices/syllabus.types';

export const useSyllabusController = () => {
  const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSyllabus = async () => {
    setLoading(true);
    const res = await getAllSyllabus();
    setSyllabusList(res.data);
    setLoading(false);
  };

  const upload = async (data: FormData) => {
    return await uploadSyllabus(data);
  };

  const update = async (data: FormData) => {
    return await updateSyllabus(data);
  };

  const remove = async (id: string) => {
    return await deleteSyllabus(id);
  };

  return {
    syllabusList,
    loading,
    fetchSyllabus,
    upload,
    update,
    remove,
  };
};
