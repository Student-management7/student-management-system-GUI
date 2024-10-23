import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios"; // Or use fetch for making API calls

const FacultyRegistrationForm = () => {
  // useForm hook for handling form state and validation
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fact_id: "",
      fact_Name: "",
      fact_email: "",
      fact_contact: "",
      fact_gender: "",
      fact_address: "",
      fact_city: "",
      fact_state: "",
      fact_joiningDate: "",
      fact_leavingDate: "",
      qualifications: [
        { type: "Graduation", subject: "", branch: "", grade: "", university: "", yearOfPassing: "" }
      ],
      fact_cls: [{ cls_name: "", cls_sub: [""] }],
      fact_status: "",
    }
  });

  // Field array for dynamic qualification fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      console.log("Submitting data: ", data);
      // Make a POST request to your API endpoint
      const response = await axios.post("https://your-api-endpoint.com/faculty", data);
      console.log("Response from API: ", response.data);

      // Optionally show a success message or reset form
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Faculty Registration Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Faculty ID</label>
            <input
              type="text"
              {...register("fact_id", { required: "Faculty ID is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_id && <p className="text-red-600">{errors.fact_id.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              {...register("fact_Name", { required: "Name is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_Name && <p className="text-red-600">{errors.fact_Name.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("fact_email", { required: "Email is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_email && <p className="text-red-600">{errors.fact_email.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Contact</label>
            <input
              type="text"
              {...register("fact_contact", { required: "Contact is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_contact && <p className="text-red-600">{errors.fact_contact.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Gender</label>
            <select
              {...register("fact_gender", { required: "Gender is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            {errors.fact_gender && <p className="text-red-600">{errors.fact_gender.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Address</label>
            <input
              type="text"
              {...register("fact_address", { required: "Address is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_address && <p className="text-red-600">{errors.fact_address.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">City</label>
            <input
              type="text"
              {...register("fact_city", { required: "City is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_city && <p className="text-red-600">{errors.fact_city.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">State</label>
            <input
              type="text"
              {...register("fact_state", { required: "State is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_state && <p className="text-red-600">{errors.fact_state.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Joining Date</label>
            <input
              type="date"
              {...register("fact_joiningDate", { required: "Joining Date is required" })}
              className="block w-full px-4 py-2 border rounded-md"
            />
            {errors.fact_joiningDate && <p className="text-red-600">{errors.fact_joiningDate.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Leaving Date</label>
            <input
              type="date"
              {...register("fact_leavingDate")}
              className="block w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

       
<br />
<br />
<hr />
<br />

 
{/* Qualification Section */}
<div className="mt-6">
  <h3 className="text-xl font-bold mb-4"></h3>

  {fields.map((field, index) => (
    <div key={field.id} className="grid grid-cols-2 gap-4 mb-6">
      {/* Qualification Type */}
      <div>
        <label className="block mb-2 text-sm font-medium">Qualification Type</label>
        <select
          {...register(`qualifications.${index}.type`, { required: "Qualification type is required" })}
          className="block w-full px-4 py-2 border rounded-md"
        >
          <option value="Graduation">Graduation</option>
          <option value="Post-Graduation">Post-Graduation</option>
          <option value="Other">Other</option>
        </select>
        {errors.qualifications?.[index]?.type && <p className="text-red-600">{errors.qualifications[index].type.message}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block mb-2 text-sm font-medium">Subject</label>
        <input
          type="text"
          {...register(`qualifications.${index}.subject`, { required: "Subject is required" })}
          className="block w-full px-4 py-2 border rounded-md"
        />
        {errors.qualifications?.[index]?.subject && <p className="text-red-600">{errors.qualifications[index].subject.message}</p>}
      </div>

      {/* Branch */}
      <div>
        <label className="block mb-2 text-sm font-medium">Branch</label>
        <input
          type="text"
          {...register(`qualifications.${index}.branch`, { required: "Branch is required" })}
          className="block w-full px-4 py-2 border rounded-md"
        />
        {errors.qualifications?.[index]?.branch && <p className="text-red-600">{errors.qualifications[index].branch.message}</p>}
      </div>

      {/* Grade */}
      <div>
        <label className="block mb-2 text-sm font-medium">Grade</label>
        <input
          type="text"
          {...register(`qualifications.${index}.grade`, { required: "Grade is required" })}
          className="block w-full px-4 py-2 border rounded-md"
        />
        {errors.qualifications?.[index]?.grade && <p className="text-red-600">{errors.qualifications[index].grade.message}</p>}
      </div>

      {/* University */}
      <div>
        <label className="block mb-2 text-sm font-medium">University</label>
        <input
          type="text"
          {...register(`qualifications.${index}.university`, { required: "University is required" })}
          className="block w-full px-4 py-2 border rounded-md"
        />
        {errors.qualifications?.[index]?.university && <p className="text-red-600">{errors.qualifications[index].university.message}</p>}
      </div>

      {/* Year of Passing */}
      <div>
        <label className="block mb-2 text-sm font-medium">Year of Passing</label>
        <input
          type="date"
          {...register(`qualifications.${index}.yearOfPassing`, { required: "Year of passing is required" })}
          className="block w-full px-4 py-2 border rounded-md"
        />
        {errors.qualifications?.[index]?.yearOfPassing && <p className="text-red-600">{errors.qualifications[index].yearOfPassing.message}</p>}
      </div>

      {/* Remove Qualification Button */}
      {fields.length > 1 && (
        <div className="col-span-2 text-right">
          <button type="button" onClick={() => remove(index)} className="text-red-600 hover:underline">
            Remove
          </button>
        </div>
      )}
    </div>
  ))}
    <br />

  {/* Add Qualification Button */}
  <div className="mt-4">
    <button
      type="button"
      onClick={() =>
        append({
          type: "Graduation",
          subject: "",
          branch: "",
          grade: "",
          university: "",
          yearOfPassing: "",
        })
      }
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Add More
    </button>
  </div>
</div>

<br />
<br />

        {/* Class & Subjects */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4"></h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Class Name</label>
              <input
                type="text"
                {...register("fact_cls.cls_name", { required: "Class name is required" })}
                className="block w-full px-4 py-2 border rounded-md"
              />
              {errors.fact_cls?.cls_name && <p className="text-red-600">{errors.fact_cls.cls_name.message}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Subjects</label>
              <input
                type="text"
                {...register("fact_cls.cls_sub", { required: "Subjects are required" })}
                className="block w-full px-4 py-2 border rounded-md"
              />
              {errors.fact_cls?.cls_sub && <p className="text-red-600">{errors.fact_cls.cls_sub.message}</p>}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium">Status</label>
          <select
            {...register("fact_status", { required: "Status is required" })}
            className="block w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.fact_status && <p className="text-red-600">{errors.fact_status.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyRegistrationForm;

