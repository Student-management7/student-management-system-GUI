import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PDFDocument, rgb } from "pdf-lib";
import {
  FiUpload, 
  FiType, 
  FiBook, 
  FiBookOpen, 
  FiCheckSquare, 
  FiFileText,
  FiSave,
  FiArrowLeft
} from "react-icons/fi";

type FormData = {
  title: string;
  description: string;
  class: string;
  subject: string;
  publish: boolean;
  file: FileList;
  textContent: string;
};

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  class: yup.string().required("Class is required"),
  subject: yup.string().required("Subject is required"),
  publish: yup.boolean(),
  file: yup.mixed(),
  textContent: yup.string(),
}).test("file-or-text", "Either file or manual text is required", function (values) {
  const filePresent = values.file && values.file.length > 0;
  const textPresent = values.textContent && values.textContent.trim().length > 0;
  return filePresent || textPresent;
});

type Props = {
  onSubmit: (formData: FormData & { pdfFile?: File }) => void;
  defaultValues?: Partial<FormData>;
  onCancel?: () => void;
};

const SyllabusForm: React.FC<Props> = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [inputType, setInputType] = useState<"file" | "text">(
    defaultValues?.textContent ? "text" : "file"
  );
  const [isConverting, setIsConverting] = useState(false);

  const watchedFile = watch("file");
  const watchedText = watch("textContent");

  const convertTextToPdf = async (text: string, title: string) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { height } = page.getSize();
      
      // Add title
      page.drawText(title, {
        x: 50,
        y: height - 50,
        size: 20,
        color: rgb(0, 0, 0),
      });
      
      // Add content
      const lines = text.split('\n');
      let yPosition = height - 80;
      
      for (const line of lines) {
        if (yPosition < 50) {
          // Add new page if we run out of space
          page = pdfDoc.addPage([600, 800]);
          yPosition = height - 50;
        }
        
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 12,
          color: rgb(0, 0, 0),
        });
        
        yPosition -= 15;
      }
      
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF from text");
    }
  };

  const onSubmitHandler = async (data: FormData) => {
    try {
      let pdfFile: File | undefined;
      
      if (inputType === "text" && data.textContent) {
        setIsConverting(true);
        const pdfBlob = await convertTextToPdf(data.textContent, data.title);
        pdfFile = new File([pdfBlob], `${data.title}.pdf`, { type: 'application/pdf' });
        setIsConverting(false);
      }
      
      onSubmit({ ...data, pdfFile });
    } catch (error) {
      setIsConverting(false);
      setError("", {
        type: "manual",
        message: "Failed to convert text to PDF. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto"
    >
      <div className=" flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiBookOpen className="mr-2 text-blue-600" />
          Upload New Syllabus
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiType className="mr-2 text-gray-500" />
            Title
          </label>
          <input
            {...register("title")}
            className={`mt-1 block w-full px-4 py-2 border ${
              errors.title ? "border-red-300" : "border-gray-300"
            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Syllabus title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FiFileText className="mr-2 text-gray-500" />
            Description (Optional)
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the syllabus"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiBook className="mr-2 text-gray-500" />
              Class
            </label>
            <select
              {...register("class")}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.class ? "border-red-300" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select Class</option>
              {["LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())].map(
                (cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                )
              )}
            </select>
            {errors.class && (
              <p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FiBookOpen className="mr-2 text-gray-500" />
              Subject
            </label>
            <input
              {...register("subject")}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.subject ? "border-red-300" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Subject name"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>
        </div>

        {/* Publish Field */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="publish"
            {...register("publish")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="publish" className="ml-2 block text-sm text-gray-700 flex items-center">
            <FiCheckSquare className="mr-2 text-gray-500" />
            Publish immediately
          </label>
        </div>

        {/* Content Type Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                inputType === "file" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}>
                <input
                  type="radio"
                  name="uploadType"
                  value="file"
                  checked={inputType === "file"}
                  onChange={() => setInputType("file")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3 flex items-center">
                  <FiUpload className="text-gray-700 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Upload File</span>
                </div>
              </label>

              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                inputType === "text" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}>
                <input
                  type="radio"
                  name="uploadType"
                  value="text"
                  checked={inputType === "text"}
                  onChange={() => setInputType("text")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3 flex items-center">
                  <FiFileText className="text-gray-700 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Enter Text</span>
                </div>
              </label>
            </div>
          </div>

          {/* File Upload or Text Input */}
          {inputType === "file" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Syllabus File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        {...register("file")}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT up to 10MB
                  </p>
                </div>
              </div>
              {watchedFile?.[0]?.name && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected file: <span className="font-medium">{watchedFile[0].name}</span>
                </p>
              )}
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Syllabus Content
              </label>
              <textarea
                {...register("textContent")}
                rows={8}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the syllabus content here..."
              />
              {errors.textContent && (
                <p className="mt-1 text-sm text-red-600">{errors.textContent.message}</p>
              )}
            </div>
          )}
          {errors?.[""]?.message && (
            <p className="mt-1 text-sm text-red-600">{errors[""].message}</p>
          )}
        </div>

        {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isConverting}
          className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-50"
        >
          {isConverting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </>
          ) : isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <FiSave className="mr-2" />
              Submit Syllabus
            </>
          )}
        </button>
      </div>
      </div>
    </form>
  );
};

export default SyllabusForm;