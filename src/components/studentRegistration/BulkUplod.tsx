import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../loader/loader";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import * as XLSX from "xlsx";
import "./StudentRegistration.scss";
import axiosInstance from "../../services/Utils/apiUtils";
import axios from "axios";
import BackButton from "../Navigation/backButton";

const StudentRegistrationController = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // Custom cell renderer for download buttons
    const renderDownloadButton = (value: any, row: any, type: string) => {
        return (
            <div className="flex gap-3">
                <span className="">{value}</span>
                <button
                    onClick={() => handleDownload(row.id, type)}
                    className="download-button flex items-center justify-center"
                >
                    <img src="/images/download.png" alt="Download" className="download-icon" height={20} width={20} />
                </button>
            </div>
        );
    };

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "creationDateTime", headerName: "Creation Date" },
        { field: "fileName", headerName: "File Name" },
        {
            field: "total",
            headerName: "Total Records",
            cellRenderer: (params: any) => renderDownloadButton(params.value, params.data, "total")
        },
        { field: "fileStatus", headerName: "Status" },
        {
            field: "success",
            headerName: "Success",
            cellRenderer: (params: any) => renderDownloadButton(params.value, params.data, "success")
        },
        {
            field: "failure",
            headerName: "Failure",
            cellRenderer: (params: any) => renderDownloadButton(params.value, params.data, "error")
        },
    ];

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            // Using the provided API endpoint
            const response = await axiosInstance.get("https://s-m-s-keyw.onrender.com/student/getExcelRecord");
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

    // Function to handle download when a button is clicked


    const handleDownload = async (id: string, value: string) => {
        try {
            const downloadUrl = `/student/download?value=${value}&id=${id}`;

            // Making an API request using Axios with error handling
            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob', // Important for handling binary data
            });

            if (!response || !response.data) {
                throw new Error('Received empty response from the server');
            }

            // Creating a blob from the response data
            const blob = new Blob([response.data]);

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${value}_records_${id}.xlsx`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`${value} records downloaded successfully!`);
        } catch (error: any) {
            // Handling different types of errors
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    toast.error(`Error ${error.response.status}: ${error.response.data?.message || 'Failed to download records'}`);
                } else if (error.request) {
                    // No response received (e.g., network error)
                    toast.error("Network error: Unable to reach the server.");
                } else {
                    // Other Axios-related errors
                    toast.error("An unexpected error occurred.");
                }
            } else {
                // Non-Axios errors
                toast.error("Failed to download records. Please try again.");
            }

            console.error("Download error:", error);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {loading && <Loader />}
            {!loading && (
                <div className="box">
                    <div className="flex items-center space-x-4 mb-3">
                        <span>
                            <BackButton />
                        </span>
                        <h1 className="head1 items-center mt-2 " >Bulk Upload</h1>
                    </div>
                    <div className="p-4">
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600 sm:mt-3 md:mt-2">Upload</button>
                    </div>
                    <ReusableTable rows={data} columns={columns} />
                </div>
            )}
        </>
    );
};

export default StudentRegistrationController;