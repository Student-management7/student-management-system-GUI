import React, { useState, useEffect } from "react";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import FormView from "./FormView";
import { fetchSchools, saveSchool, updateSchool, deleteSchool } from "../../services/suparAdmin/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import AlertDialog from "../alert/AlertDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../loader/loader";
import { useNavigate } from "react-router-dom";
import { School } from "../../services/suparAdmin/type";

const SuperAdminController = () => {
    const navigate = useNavigate();
    const [superAdminData, setSuperAdminData] = useState<boolean>(false);
    const [rows, setRows] = useState<School[]>([]);
    const [editData, setEditData] = useState<School | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<School | null>(null);
    const [loading, setLoading] = useState(false);

    const columns = [
        { field: "schoolName", headerName: "School Name" },
        { field: "adminContact", headerName: "Admin Contact" },
        { field: "city", headerName: "City" },
        { field: "state", headerName: "State" },
        { field: "schoolCode", headerName: "School Code" },
        { field: "schoolAddress", headerName: "School Address" },
        { field: "email", headerName: "Email" },
        {
            field: "Edit data",
            headerName: "Edit",
            cellRenderer: (params: any) => (
                <button onClick={() => handleEdit(params.data)} className="btn btn-edit">
                    <Pencil size={20} />
                </button>
            ),
        },
        {
            field: "Delete data",
            headerName: "Delete",
            cellRenderer: (params: any) => (
                <button onClick={() => handleDelete(params.data)}>
                    <Trash2 size={20} color="red" />
                </button>
            ),
        },
        {
            field: "View",
            headerName: "view",
            cellRenderer: (params: any) => (
                <button onClick={() => handleViewDetails(params.data.id)}>
                    <Eye size={20} color="blue" />
                </button>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchSchools();
            setRows(data);
        } catch (error) {
            toast.error("Error fetching data:");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (data: School) => {
        setEditData(data);
        setSuperAdminData(true);
    };

    const handleFormSubmit = () => {
        setEditData(null);
        setSuperAdminData(false);
        fetchData();
    };

    const handleDelete = (data: School) => {
        setDialogData(data);
        setIsDialogOpen(true);
    };
    const handleCancel = () => {
        setIsDialogOpen(false);
        setDialogData(null);
    };

    const handleViewDetails = (id: string) => {
        navigate(`/SchoolsDetails/${id}`);
    };

    const handleConfirmDelete = async () => {
        if (!dialogData?.id) return;
    
        setLoading(true);
        try {
            await deleteSchool(dialogData.id);
            setRows((prev) => prev.filter((row) => row.id !== dialogData.id));
            toast.success("School record deleted successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the school record. Please try again.");
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
            setDialogData(null);
        }
    };
    
    const handleSubmit = async (values: School) => {
        try {
            let response;
            if (values.id) {
                response = await updateSchool(values); // Ensure this is awaited
                console.log("Form updated successfully:", response);
                if (response?.status === 200) {
                    
                    toast.success("Form updated successfully.");
                }
            } else {
                response = await saveSchool(values); // Ensure this is awaited
                console.log("Form submitted successfully:", response);
                toast.success("Form submitted successfully.");
            }
            fetchData(); // Refresh data after successful add/edit
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An error occurred while processing the form.");
        }
    };
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {loading && <Loader />}
            {!loading && (
                <div className="box">
                    {superAdminData ? (
                        <>
                            <div className="head1">
                                <h1>
                                    <div>
                                        <i onClick={() => setSuperAdminData(false)} className="bi bi-arrow-left-circle" />{" "}
                                        <span>Super Admin</span>
                                    </div>
                                </h1>
                            </div>
                            <FormView
                                editData={editData} // Pass editData (null for add mode, object for edit mode)
                                onSubmitSuccess={handleFormSubmit}
                                onSubmit={handleSubmit}
                            />                        </>
                    ) : (
                        <>
                            <div className="headding1">
                                <h1>&nbsp;School Registration</h1>
                            </div>
                            <div className="rightButton">
                                <button
                                    className="btn button"
                                    onClick={() => {
                                        setEditData(null);
                                        setSuperAdminData(true);
                                    }}
                                >
                                    Add School
                                </button>
                            </div>
                            <AlertDialog
                                title="Confirm Deletion"
                                message={`Are you sure you want to delete the school record for ${dialogData?.schoolName}?`}
                                isOpen={isDialogOpen}
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancel}
                            />
                            <ReusableTable rows={rows} columns={columns} />
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default SuperAdminController;