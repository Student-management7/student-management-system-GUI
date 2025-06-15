import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Send } from "lucide-react";
import StudentFeesForm from "./studentFeesForm";
import Loader from "../../loader/loader";
import ReusableTable from "../../StudenAttendanceShow/Table/Table";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/Utils/apiUtils";

interface FeeData {
  id: string;
  name: string;
  familyDetails: {
    stdo_FatherName: string;
  };
  contact: string;
  email: string;
  cls: string;
  totalFees: number;
  remainingFees: number;
  status?: string; // Adding status field for better filtering
}

const StudentFeesController: React.FC = () => {
  const [rowData, setRowData] = useState<FeeData[]>([]);
  const [filteredData, setFilteredData] = useState<FeeData[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingFee, setEditingFee] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const navigate = useNavigate();

  const columns = [
    { field: "name", headerName: "Name", editable: false },
    { field: "cls", headerName: "Class", editable: false },
    { field: "totalFees", headerName: "Total Fees", editable: false },
    { field: "remainingFees", headerName: "Remaining Fees", editable: false },
    { 
      field: "status", 
      headerName: "Fees Status", 
      editable: false,
      cellRenderer: (params: any) => (
        <span className={`badge ${params.data.remainingFees === 0 ? 'bg-success' : 'bg-danger'}`}>
          {params.data.remainingFees === 0 ? 'Complete' : 'Incomplete'}
        </span>
      )
    },
    {
      field: "view",
      headerName: "View Details",
      cellRenderer: (params: any) => (
        <button onClick={() => handleViewDetails(params.data.id)}>
          <Eye size={20} color="blue" />
        </button>
      ),
    },
  ];

  const handleViewDetails = (id: string) => {
    navigate(`/studentFeesDetails/${id}`);
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<FeeData[]>("/student/findAllStudent");
      // Add status field to each student
      const dataWithStatus = response.data.map(student => ({
        ...student,
        status: student.remainingFees === 0 ? 'Complete' : 'Incomplete'
      }));
      setRowData(dataWithStatus);
      setFilteredData(dataWithStatus);
      
      // Extract unique classes for filter dropdown
      const classes = Array.from(new Set(response.data.map(student => student.cls)));
      setAvailableClasses(classes);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        toast.warn(`Error: ${error.response.data.detail}`);
      } else {
        toast.error("Error fetching fee details. Please try again");
      }
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    // Apply filters whenever selectedClass or selectedStatus changes
    let filtered = [...rowData];
    
    if (selectedClass !== "all") {
      filtered = filtered.filter(student => student.cls === selectedClass);
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(student => 
        selectedStatus === "complete" 
          ? student.remainingFees === 0 
          : student.remainingFees > 0
      );
    }
    
    setFilteredData(filtered);
  }, [selectedClass, selectedStatus, rowData]);

  const handleSendFilteredList = () => {
    // Here you would typically send the filtered data to a server or perform an action
    // For now, we'll just show a toast with the count of filtered students
    const count = filteredData.length;
    toast.info(`Preparing to send list of ${count} ${count === 1 ? 'student' : 'students'}`);
    
    // In a real implementation, you might:
    // 1. Open a modal to confirm
    // 2. Make an API call to send notifications/emails
    // 3. Or export the list to a file
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Loader />}
      {!loading && (
        <div className="box p-3">
          {!showForm && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1 className="head1 mb-2 mb-md-0">Student Fees</h1>
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="button btn mt-1 d-flex align-items-center gap-1"
                  >
                    Add Fees
                  </button>
                  <button 
                    onClick={handleSendFilteredList}
                    disabled={filteredData.length === 0}
                    className="btn btn-primary mt-1 d-flex align-items-center gap-1"
                  >
                    <Send size={18} />
                    Send List
                  </button>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6 col-lg-3 mb-2 mb-md-0 mt-4">
                 
                  <select
                    id="classFilter"
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="all">All Classes</option>
                    {availableClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6 col-lg-3 mt-4">
                 
                  <select
                    id="statusFilter"
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="complete">Fees Complete</option>
                    <option value="incomplete">Fees Incomplete</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          {!showForm ? (
            <div className="table-responsive">
              <ReusableTable 
                rows={filteredData} 
                columns={columns} 
                rowsPerPageOptions={[5, 10, 25]} 
              />
              {filteredData.length === 0 && (
                <div className="alert alert-info mt-3">
                  No students match the current filters.
                </div>
              )}
            </div>
          ) : (
            <StudentFeesForm
              onClose={() => {
                setShowForm(false);
                setEditingFee(null);
                fetchFees();
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default StudentFeesController;