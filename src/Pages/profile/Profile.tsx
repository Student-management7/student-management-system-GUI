import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch userDetails from localStorage
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (userDetails) {
      setUser(userDetails);
    } else {
      console.error("No user details found in localStorage.");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Show a loading spinner
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">No user data available.</div>; // Show an error message
  }

  // Destructure user object with optional chaining
  const { role, email, schoolCode, permission, facultyInfo, schoolCreationEntity, adminCreationEntity } = user;

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto  rounded-lg  overflow-hidden">
        {/* Profile Header with Avatar */}
        <div className="bg-[#126666] p-6 flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
            <span className="text-4xl text-blue-600 font-bold">U</span> {/* Default Avatar */}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            <p className="text-gray-200">{email}</p>
          </div>
        </div>

       
        <div className="p-6">
          <h2 className="head1 mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700"><strong>Role:</strong> {role}</p>
              {schoolCode && <p className="text-gray-700"><strong>School Code:</strong> {schoolCode}</p>}
            </div>
          </div>
        </div>

        
        {role === "user" && schoolCreationEntity && (
          <div className="p-6 border-t">
            <h2 className="head1 mb-4">School Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700"><strong>School Name:</strong> {schoolCreationEntity.schoolName}</p>
              <p className="text-gray-700"><strong>School Address:</strong> {schoolCreationEntity.schoolAddress}</p>
              <p className="text-gray-700"><strong>Board Type:</strong> {schoolCreationEntity.boardType}</p>
              <p className="text-gray-700"><strong>Phone number:</strong> {schoolCreationEntity.adminContact}</p>
            </div>
          </div>
        )}

        {role === "sub-user" && facultyInfo && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Faculty Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700"><strong>Name:</strong> {facultyInfo.fact_Name}</p>
              <p className="text-gray-700"><strong>Contact:</strong> {facultyInfo.fact_contact}</p>
              <p className="text-gray-700"><strong>Address:</strong> {facultyInfo.fact_address}</p>
            </div>
          </div>
        )}

        {role === "admin" && adminCreationEntity && (
          <div className="p-6 border-t">
            <h2 className="head1 mb-4">Admin Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700"><strong>Name:</strong> {adminCreationEntity.name}</p>
              <p className="text-gray-700"><strong>Role:</strong> {adminCreationEntity.role}</p>
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default UserProfile;