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

  return {
    syllabusList,
    loading,
    fetchSyllabus,
    upload,
    update,
    remove,
  };
};