import React, { useState } from 'react';

// Reusable input field component
const InputField = ({ label, name, value, onChange, type = "text", placeholder, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const StudentRegistrationForm = () => {
  const [showFamilyDetails, setShowFamilyDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    contact: '',
    gender: '',
    dob: '',
    email: '',
    cls: '',
    department: '',
    category: '',
    familyDetails: {
      stdo_FatherName: '',
      stdo_MotherName: '',
      stdo_primaryContact: '',
      stdo_secondaryContact: '',
      stdo_address: '',
      stdo_city: '',
      stdo_state: '',
      stdo_email: '',
    },
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('familyDetails.')) {
      const familyField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        familyDetails: {
          ...prevState.familyDetails,
          [familyField]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = 'Invalid contact number format';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.cls) newErrors.cls = 'Class is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.category) newErrors.category = 'Category is required';

    if (showFamilyDetails) {
      if (!formData.familyDetails.stdo_FatherName) newErrors['familyDetails.stdo_FatherName'] = "Father's Name is required";
      if (!formData.familyDetails.stdo_MotherName) newErrors['familyDetails.stdo_MotherName'] = "Mother's Name is required";
      if (formData.familyDetails.stdo_primaryContact && !/^\d{10}$/.test(formData.familyDetails.stdo_primaryContact)) {
        newErrors['familyDetails.stdo_primaryContact'] = 'Invalid contact number format';
      }
      if (formData.familyDetails.stdo_secondaryContact && !/^\d{10}$/.test(formData.familyDetails.stdo_secondaryContact)) {
        newErrors['familyDetails.stdo_secondaryContact'] = 'Invalid contact number format';
      }
      if (formData.familyDetails.stdo_email && !/\S+@\S+\.\S+/.test(formData.familyDetails.stdo_email)) {
        newErrors['familyDetails.stdo_email'] = 'Invalid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (validateForm()) {
      // Prepare the formatted data for the server
      const formattedData = {
        ...formData,
        familyDetails: formData.familyDetails,
      };

      try {
        // Make the POST request to the server
        const response = await fetch('http://localhost:8080/student/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),  // Send the form data as a JSON payload
        });

        // Check if the request was successful
        if (response.ok) {
          const result = await response.json();
          console.log('Server response:', result);
          alert('Form submitted successfully!');
        } else {
          const errorResult = await response.json();
          console.error('Failed to submit form:', errorResult.message || response.statusText);
          alert(`Error: ${errorResult.message || 'Failed to submit form. Please try again later.'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form. Please check your network and try again.');
      }
    }
  };


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg transform -skew-y-1"></div>
        
        <div className="relative bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-2xl font-bold text-center">Student Registration Form</h2>
          </div>
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" error={errors.name} />
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" error={errors.address} />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New York" error={errors.city} />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="NY" error={errors.state} />
              <InputField label="Contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="+1-234-567-8901" error={errors.contact} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} type="date" error={errors.dob} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" error={errors.email} />
              <InputField label="Class" name="cls" value={formData.cls} onChange={handleChange} placeholder="10" error={errors.cls} />
              <InputField label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Science" error={errors.department} />
              <InputField label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="General" error={errors.category} />
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => setShowFamilyDetails(!showFamilyDetails)}
                className="flex items-center justify-between w-full text-left text-lg font-medium text-blue-600 focus:outline-none"
              >
                Family Details
                <span>{showFamilyDetails ? '▲' : '▼'}</span>
              </button>
              {showFamilyDetails && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Father's Name" name="familyDetails.stdo_FatherName" value={formData.familyDetails.stdo_FatherName} onChange={handleChange} placeholder="John Doe Sr." error={errors['familyDetails.stdo_FatherName']} />
                  <InputField label="Mother's Name" name="familyDetails.stdo_MotherName" value={formData.familyDetails.stdo_MotherName} onChange={handleChange} placeholder="Jane Doe" error={errors['familyDetails.stdo_MotherName']} />
                  <InputField label="Primary Contact" name="familyDetails.stdo_primaryContact" value={formData.familyDetails.stdo_primaryContact} onChange={handleChange} placeholder="+1-234-567-8901" error={errors['familyDetails.stdo_primaryContact']} />
                  <InputField label="Secondary Contact" name="familyDetails.stdo_secondaryContact" value={formData.familyDetails.stdo_secondaryContact} onChange={handleChange} placeholder="+1-234-567-8902" error={errors['familyDetails.stdo_secondaryContact']} />
                  <InputField label="Family Address" name="familyDetails.stdo_address" value={formData.familyDetails.stdo_address} onChange={handleChange} placeholder="456 Family St" error={errors['familyDetails.stdo_address']} />
                  <InputField label="Family City" name="familyDetails.stdo_city" value={formData.familyDetails.stdo_city} onChange={handleChange} placeholder="Family Town" error={errors['familyDetails.stdo_city']} />
                  <InputField label="Family State" name="familyDetails.stdo_state" value={formData.familyDetails.stdo_state} onChange={handleChange} placeholder="FS" error={errors['familyDetails.stdo_state']} />
                  <InputField label="Family Email" name="familyDetails.stdo_email" value={formData.familyDetails.stdo_email} onChange={handleChange} placeholder="family@example.com" error={errors['familyDetails.stdo_email']} />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                
              >
                
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;