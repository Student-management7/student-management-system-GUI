import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PDFDocument, rgb } from "pdf-lib";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../../components/loader/loader';
import BackButton from "../Navigation/backButton";
import { FiUpload, FiFileText, FiBook, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import { fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { sortArrayByKey } from "../Utils/sortArrayByKey";

interface ClassData {
  id: string;
  className: string;
  subject: string[];
}

type FormData = {
  title: string;
  class: string;
  subject: string;
  publish: boolean;
  file: FileList | null;
  textContent: string;
};

type DefaultValues = {
  title: string;
  class: string;
  subject: string;
  publish: boolean;
  textContent?: string;
};

type Props = {
  onSubmit: (formData: FormData & { pdfFile?: File }) => void;
  loading: boolean;
  defaultValues?: DefaultValues;
  isEditMode?: boolean;
};

const schema = yup.object({
  title: yup.string().required("Title is required"),
  class: yup.string().required("Class is required"),
  subject: yup.string().required("Subject is required"),
  publish: yup.boolean(),
  file: yup.mixed().nullable(),
  textContent: yup.string(),
}).test("file-or-text", "Either file or text content is required", function (values) {
  return !!(values.file?.[0] || values.textContent?.trim());
});

const SyllabusForm: React.FC<Props> = ({ onSubmit, loading, defaultValues, isEditMode = false }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch, 
    setError, 
    setValue, 
    reset,
    control
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      class: '',
      subject: '',
      publish: false,
      file: null,
      textContent: '',
      ...defaultValues
    }
  });

  const [inputType, setInputType] = useState<"file" | "text">(
    defaultValues?.textContent ? "text" : "file"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [classDataLoaded, setClassDataLoaded] = useState(false);

  const watchedFile = watch("file");
  const watchedClass = watch("class");
  const watchedSubject = watch("subject");

  // Fetch class data only once
  useEffect(() => {
    const loadClassData = async () => {
      if (!classDataLoaded) {
        try {
          const data = await fetchClassData();
          setClassData(data);
          setClassDataLoaded(true);
        } catch (error) {
          toast.error("Failed to load class data");
        }
      }
    };
    loadClassData();
  }, [classDataLoaded]);

  // Initialize form with default values
  useEffect(() => {
    if (defaultValues && classDataLoaded) {
      const selectedClass = classData.find(c => c.className === defaultValues.class);
      const classSubjects = selectedClass?.subject || [];
      setSubjects(classSubjects);

      reset({
        ...defaultValues,
        file: null // Reset file input in edit mode
      });

      if (defaultValues.textContent) {
        setInputType("text");
      }
    }
  }, [defaultValues, classData, classDataLoaded, reset]);

  // Update subjects when class changes
  useEffect(() => {
    if (watchedClass && classDataLoaded) {
      const selectedClass = classData.find(c => c.className === watchedClass);
      const newSubjects = selectedClass?.subject || [];
      setSubjects(newSubjects);
      
      // Only reset subject if the current value isn't in the new subjects
      if (watchedSubject && !newSubjects.includes(watchedSubject)) {
        setValue("subject", "");
      }
    }
  }, [watchedClass, classData, classDataLoaded, setValue, watchedSubject]);

  const sortedClassData = useMemo(
    () => sortArrayByKey(classData, "className"),
    [classData]
  );

  const convertTextToPdf = useCallback(async (text: string, title: string) => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();

    page.drawText(title, { x: 50, y: height - 50, size: 20, color: rgb(0, 0, 0) });

    const lines = text.split('\n');
    let yPosition = height - 80;

    for (const line of lines) {
      if (yPosition < 50) {
        page = pdfDoc.addPage([600, 800]);
        yPosition = height - 50;
      }
      page.drawText(line, { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) });
      yPosition -= 15;
    }

    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes], `${title}.pdf`, { type: 'application/pdf' });
  }, []);

  const onSubmitHandler = async (data: FormData) => {
    try {
      let pdfFile: File | undefined;

      if (inputType === "text" && data.textContent) {
        pdfFile = await convertTextToPdf(data.textContent, data.title);
      }

      onSubmit({ ...data, pdfFile });
    } catch (error) {
      setError("root", { 
        type: "manual",
        message: "Failed to convert text to PDF" 
      });
      toast.error("Failed to convert text to PDF");
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      const validTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (validTypes.some(type => files[0].type.includes(type))) {
        setValue("file", files);
      } else {
        toast.error("Only PDF, TXT, DOC, and DOCX files are allowed");
      }
    }
  }, [setValue]);

  return (
    <div className="box">
      <div className="container mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        {loading && <Loader />}

        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center mb-2">
            <BackButton />
          </span>
          <h1 className="text-2xl head1 font-semibold flex items-center mt-1">
            <FiBookOpen className="mr-2" /> {isEditMode ? "Edit" : "Upload"} Syllabus
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 flex items-center">
              <FiBook className="mr-2" /> Title*
            </label>
            <input
              {...register("title")}
              className="p-2 form-control max-w-md"
              placeholder="Enter syllabus title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Class & Subject */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Class */}
            <div className="flex flex-col w-full md:max-w-sm">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiBook className="mr-2" /> Class*
              </label>
              <select
                {...register("class")}
                className="p-2 form-control"
                disabled={!classDataLoaded}
              >
                <option value="">Select Class</option>
                {sortedClassData.map((cls) => (
                  <option key={cls.id} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
              {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>}
            </div>

            {/* Class & Subject */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Class */}
              <div className="flex flex-col w-full md:max-w-sm">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FiBook className="mr-2" /> Class*
                </label>
                <select
                  {...register("class")}
                  className="p-2 form-control"
                >
                  <option value="">Select Class</option>
                  {sortedClassData.map((cls) => (
                    <option key={cls.id} value={cls.className}>
                      {cls.className}
                    </option>
                  ))}
                </select>
                {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>}
              </div>

    {/* Subject */}
    <div className="flex flex-col w-full md:max-w-sm">
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
        <FiBook className="mr-2" /> Subject*
      </label>
      <select
        {...register("subject")}
        disabled={!watchedClass}
        className="p-2 form-control"
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>{subject}</option>
        ))}
      </select>
      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
    </div>
  </div>

            {/* Publish Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="publish"
                {...register("publish")}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="publish" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                <FiCheckCircle className="mr-1" /> Publish immediately
              </label>
              <select
                {...register("subject")}
                disabled={!watchedClass || !subjects.length}
                className="p-2 form-control"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject} selected={watchedSubject === subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="publish"
              {...register("publish")}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="publish" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
              <FiCheckCircle className="mr-1" /> Publish immediately
            </label>
          </div>

          {/* File/Text Toggle */}
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-md ${inputType === "file" ? "bg-[#0d774b11] text-[#519186]" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setInputType("file")}
            >
              <FiUpload className="mr-2" /> Upload File
            </button>
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-md ${inputType === "text" ? "bg-[#0d774b11] text-[#519186]" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setInputType("text")}
            >
              <FiFileText className="mr-2" /> Enter Text
            </button>
          </div>

          {/* File Upload or Text Content */}
          {inputType === "file" ? (
            <div
              className={`border-2 border-dashed rounded-md p-6 text-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (MAX. 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  {...register("file")}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-3 px-4 py-2 btn button"
                >
                  Select File
                </label>
              </div>
              {watchedFile?.[0]?.name && (
                <p className="mt-2 text-sm text-gray-700">
                  Selected: <span className="font-medium">{watchedFile[0].name}</span>
                </p>
              )}
              {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file.message}</p>}
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiFileText className="mr-2" /> Syllabus Content*
              </label>
              <textarea
                {...register("textContent")}
                rows={6}
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full max-w-2xl"
                placeholder="Enter syllabus content here..."
              />
              {errors.textContent && <p className="text-red-500 text-sm mt-1">{errors.textContent.message}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn button font-medium py-2 px-6 rounded-md flex items-center justify-center"
          >
            {loading ? (isEditMode ? "Updating..." : "Uploading...") : (isEditMode ? "Update Syllabus" : "Upload Syllabus")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SyllabusForm;