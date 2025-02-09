import React, { useState, useEffect } from "react";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import './../../global.scss';
import FormView from "./FormView";
import axiosInstance from "../../services/Utils/apiUtils";
import { Pencil, Trash2 } from "lucide-react";
import AlertDialog from "../alert/AlertDialog";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../loader/loader";

const SuperAdminController = () => {
    const [superAdminData, setSuperAdminData] = useState<boolean>(false);
    const [rows, setRows] = useState<any[]>([]);
    const [editData, setEditData] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<any>(null);
    const [loading, setLoading] = useState(false);


    const [columns] = useState<any[]>([
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
                <div className="smInline">
                    <button
                        onClick={() => handleEdit(params.data)}
                        className="btn btn-edit"
                    >
                        <Pencil size={20} />
                    </button>

                </div>
            ),
        },
        {
            field: "Delete data",
            headerName: "Delete",

            cellRenderer: (params: any) => (

                <button
                    onClick={() => handleDelete(params.data)}

                >
                    <Trash2 size={20} color="red" />
                </button>
            )
        },
        // { field: "status", headerName: "Status" },
        // { field: "serviceStartDate", headerName: "Service Start Date" },
        // { field: "renewalDate", headerName: "Renewal Date" },
        // { field: "subscriptionType", headerName: "Subscription Type" },
        // { field: "ownerName", headerName: "Owner Name" },
        // { field: "schoolLandlineNo", headerName: "School Landline No" },
        // { field: "boardType", headerName: "Board Type" },
        // { field: "gst", headerName: "GST" },
    ]);


    // data get from api

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/school/get");
            setRows(response.data);
        } catch (error) {
            toast.error("Error fetching data:");
        } finally {
            setLoading(false); // Hide loader
        }
    };

    //   handel edit 

    const handleEdit = (data: any) => {
        setEditData(data);
        console.log(data);
        setSuperAdminData(true);
    };

    const handleFormSubmit = () => {
        setEditData(null);
        setSuperAdminData(false);
        fetchData(); // Refresh done
    };


    // delete handele
    const handleDelete = (data: any) => {
        setDialogData(data);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!dialogData?.id) return;

        setLoading(true);
        try {

            // data is alredy set in setDialogData  , so its take from there *

            await axiosInstance.post(`/school/delete?id=${dialogData.id}`);
            setRows((prev) => prev.filter((row) => row.id !== dialogData.id));
            toast.success("School record deleted successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the school record. Please try again.");
        } finally {
            setLoading(false); // Hide loader
            setIsDialogOpen(false);
            setDialogData(null);
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setDialogData(null);
    };




    return (

      <>
                  <ToastContainer position="top-right" autoClose={3000} />

        {loading && <Loader />} {/* Show loader when loading */}
            {!loading && (

        <div className="box">

          

                {
                    superAdminData?(
                <>
                    <div className="head1">
                        <h1 onClick={() => setSuperAdminData(false)}>
                            <div>
                                <i className="bi bi-arrow-left-circle" /> <span>Super Admin</span>
                            </div>
                        </h1>
                    </div>
                    <FormView editData={editData} onSubmitSuccess={handleFormSubmit} />
                </>
    ) : (
        <>
            <div className="headding1">
                <h1>
                    &nbsp;School Registration
                </h1>
            </div>

            <div className="rightButton">
                <button className="btn button"
                    onClick={() => {
                        setEditData(null);
                        setSuperAdminData(true);
                    }}
                >
                    Add Student
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
    )
}

       

        </div >
            )}
      </>

    );



}

export default SuperAdminController;