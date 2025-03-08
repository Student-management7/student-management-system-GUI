import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../loader/loader";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import * as XLSX from "xlsx";
import "./StudentRegistration.scss";
import axiosInstance from "../../services/Utils/apiUtils";

const StudentRegistrationController = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const columns = [
        { field: "File Name", headerName: "Name" },
        { field: "Exceptions", headerName: "Exception" },
        { field: "Success", headerName: "Success" },
        { field: "Failure", headerName: "Failure" },
    ];

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/FileResponse");
            setData(response.data);
        } catch (error) {
            toast.error("Failed to fetch student data.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const uploadedFile = event.target.files[0];
            setFile(uploadedFile);

            const reader = new FileReader();
            reader.readAsBinaryString(uploadedFile);
            reader.onload = (e) => {
                const binaryData = e.target?.result;
                const workbook = XLSX.read(binaryData, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);
                console.log("Excel Converted JSON:", parsedData);
            };
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warning("Please select a file before uploading!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            await axiosInstance.post("/student/bulkupload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Upload successful!");
            fetchStudentData(); // Refresh table data after upload
        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {loading && <Loader />}
            {!loading && (
                <div className="box">
                    <div className="headding1 mb-4">
                        <h1 className="text-center">Student Bulk Upload</h1>
                    </div>
                    <div className="p-4">
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 ml-2">Upload</button>
                    </div>
                    <ReusableTable rows={data} columns={columns} />
                </div>
            )}
        </>
    );
};

export default StudentRegistrationController;
