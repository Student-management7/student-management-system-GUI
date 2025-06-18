import React, { useState, useEffect } from "react";
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

type FormData = {
  title: string;
  class: string;
  subject: string;
  publish: boolean;
  file: FileList;
  textContent: string;
};

const schema = yup.object({
  title: yup.string().required("Title is required"),
  class: yup.string().required("Class is required"),
  subject: yup.string().required("Subject is required"),
  publish: yup.boolean(),
  file: yup.mixed(),
  textContent: yup.string(),
}).test("file-or-text", "Either file or text content is required", function (values) {
  return !!(values.file?.[0] || values.textContent?.trim());
});

type Props = {
  onSubmit: (formData: FormData & { pdfFile?: File }) => void;
  loading: boolean;
};

const SyllabusForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, watch, setError, setValue } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const [inputType, setInputType] = useState<"file" | "text">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [classData, setClassData] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const watchedFile = watch("file");
  const watchedClass = watch("class");

useEffect(() => {
  const getData = async () => {
    try {
      const data = await fetchClassData();
      setClassData(data);
    } catch (error) {
      toast.error("Failed to load class data");
    }
  };

  getData();
}, []);

  useEffect(() => {
    // Update subjects when class changes
    if (watchedClass) {
      const selectedClass = classData.find(c => c.className === watchedClass);
      setSubjects(selectedClass?.subject || []);
      setValue("subject", ""); // Reset subject when class changes
    }
  }, [watchedClass, classData, setValue]);

  const convertTextToPdf = async (text: string, title: string) => {
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
  };

  const onSubmitHandler = async (data: FormData) => {
    try {
      let pdfFile: File | undefined;
      
      if (inputType === "text" && data.textContent) {
        pdfFile = await convertTextToPdf(data.textContent, data.title);
      }
      
      onSubmit({ ...data, pdfFile });
    } catch (error) {
      setError("", { message: "Failed to convert text to PDF" });
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('application/pdf|text/plain|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        const fileList = {
          0: file,
          length: 1,
          item: (index: number) => file
        } as FileList;
        setValue("file", fileList);
      } else {
        toast.error("Only PDF, TXT, DOC, and DOCX files are allowed");
      }
    }
  };

  return (

    <>
    <div className="box">

    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Loader />}

      <span className="flex items-center gap-4 mb-6">
  <div className="flex items-center">
    <BackButton />
  </div>
  <h1 className="text-2xl head1 font-semibold flex items-center">
    <FiBookOpen className="mr-2" /> Upload Syllabus
  </h1>
</span>


      <form onSubmit={handleSubmit(onSubmitHandler)} >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiBook className="mr-2" /> Title*
            </label>
            <input
              {...register("title")}
              className="w-full p-3 form-control"
              placeholder="Enter syllabus title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

         {/* Class Dropdown */}
<div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
    <FiBook className="mr-2" /> Class*
  </label>
  <select
    {...register("class")}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select Class</option>
    {classData.map((cls) => (
      <option key={cls.id} value={cls.className}>{cls.className}</option>
    ))}
  </select>
  {errors.class && <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>}
</div>

{/* Subject Dropdown */}
<div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
    <FiBook className="mr-2" /> Subject*
  </label>
  <select
    {...register("subject")}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    disabled={!watchedClass}
  >
    <option value="">Select Subject</option>
    {subjects.map((subject) => (
      <option key={subject} value={subject}>{subject}</option>
    ))}
  </select>
  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
</div>


          <div className="flex items-center justify-start md:justify-end">
            <div className="flex items-center h-full mt-6">
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
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-lg ${inputType === "file" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setInputType("file")}
            >
              <FiUpload className="mr-2" /> Upload File
            </button>
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-lg ${inputType === "text" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setInputType("text")}
            >
              <FiFileText className="mr-2" /> Enter Text
            </button>
          </div>

          {inputType === "file" ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, or TXT (MAX. 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  {...register("file")}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Select File
                </label>
              </div>
              {watchedFile?.[0]?.name && (
                <p className="mt-3 text-sm text-gray-700">
                  Selected: <span className="font-medium">{watchedFile[0].name}</span>
                </p>
              )}
              {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file.message}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiFileText className="mr-2" /> Syllabus Content*
              </label>
              <textarea
                {...register("textContent")}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter syllabus content here..."
              />
              {errors.textContent && <p className="text-red-500 text-sm mt-1">{errors.textContent.message}</p>}
            </div>
          )}
          {errors[""] && <p className="text-red-500 text-sm mt-2">{errors[""].message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className=" button  flex items-center justify-center "
        >
          {loading ? "Uploading..." : "Upload Syllabus"}
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default SyllabusForm;