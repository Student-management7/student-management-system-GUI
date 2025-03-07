import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/loader';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import FacultyForm from './FacultyForm';
import { FacultyFormData } from '../../services/Faculty/fecultyRegistretion/Type/FecultyRegistrationType';
import { getFacultyDetails, deleteFacultyDetails } from '../../services/Faculty/fecultyRegistretion/API/API';
import { Pencil, Trash2, Eye } from 'lucide-react';
import AlertDialog from '../alert/AlertDialog';

const FacultyRegistrationController: React.FC = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<FacultyFormData[]>([]);
  const [editingFaculty, setEditingFaculty] = useState<FacultyFormData | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedFacultyToDelete, setSelectedFacultyToDelete] = useState<FacultyFormData | null>(null);
  const [editmode, setEditmode] = useState<boolean>(false);

  useEffect(() => {
    fetchFacultyDetails();
  }, []);


  const fetchFacultyDetails = async () => {
    try {
      setLoading(true);
      const response = await getFacultyDetails();
      if (Array.isArray(response?.data)) {
        setRowData(response.data);
      } else {
        console.error('Unexpected data format:', response);
      }
    } catch (error) {
      console.error('Failed to fetch faculty details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((facultyData: FacultyFormData) => {
    const selectedFaculty = rowData.find((faculty) => faculty.fact_id === facultyData.fact_id);
    if (selectedFaculty) {
      setIsFormVisible(true);
      setEditmode(true); 
      setEditingFaculty(selectedFaculty);
      console.log('Editing faculty:----', selectedFaculty);
    } else {
      console.error('Faculty not found');
    }
  }, [rowData]);

  const handleAddFaculty = () => {
    setIsFormVisible(true);
    setEditmode(false); // ✅ Disable edit mode when adding a new faculty
    setEditingFaculty(null); // ✅ Ensure no pre-filled data
  };


  const handleDelete = useCallback((facultyData: FacultyFormData) => {
    setSelectedFacultyToDelete(facultyData);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    try {
      if (!selectedFacultyToDelete?.fact_id) {
        console.error('Faculty ID is missing');
        return;
      }

      const response = await deleteFacultyDetails(selectedFacultyToDelete.fact_id);

      if (response?.status === 200) {
        await fetchFacultyDetails();
        setShowDeleteModal(false);
        toast.success('Faculty deleted successfully!');
        setSelectedFacultyToDelete(null);
      } else {
        console.error('Delete failed:', response);
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleViewDetails = useCallback((id: string) => {
    navigate(`/FacultyDetails/${id}`);
  }, [navigate]);

  const columns = [
    { field: 'fact_Name', headerName: 'Name' },
    { field: 'fact_email', headerName: 'Email' },
    { field: 'fact_contact', headerName: 'Contact' },
    { field: 'fact_address', headerName: 'Address' },
    { field: 'fact_gender', headerName: 'Gender' },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params: any) => (
        <button onClick={() => handleEdit(params.data)}>
          <Pencil size={20} color='orange' />
        </button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      cellRenderer: (params: any) => (
        <button onClick={() => handleDelete(params.data)}>
          <Trash2 size={20} color="red" />
        </button>
      ),
    },
    {
      field: 'View',
      headerName: 'Details',
      width: 100,
      cellRenderer: (params: any) => (
        <button onClick={() => handleViewDetails(params.data.fact_id)}>
          <Eye size={20} color="blue" />
        </button>
      ),
    },
  ];

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <ToastContainer position='top-right' autoClose={3000} />
          {!isFormVisible ? (
            <div className="box">
              <h1 className='head1 mb-4'>Faculty Registration</h1>
              <div className='float-right'>
                <button onClick={handleAddFaculty} className="btn button head1 text-white">
                  Add Faculty
                </button>

              </div>

              <ReusableTable rows={rowData} columns={columns} />

              {showDeleteModal && selectedFacultyToDelete && (
                <AlertDialog
                  message="Are you sure you want to delete this faculty?"
                  onConfirm={confirmDelete}
                  onCancel={() => setShowDeleteModal(false)}
                  isOpen={showDeleteModal}
                  title="Delete Faculty"
                />
              )}
            </div>
          ) : (
            <FacultyForm
              editingFaculty={editingFaculty}
              setIsFormVisible={setIsFormVisible}
              editmode={editmode}
              fetchFacultyDetails={fetchFacultyDetails}
              setEditingFaculty={setEditingFaculty}
            />
          )}
        </>
      )}
    </>
  );
};

export default FacultyRegistrationController;