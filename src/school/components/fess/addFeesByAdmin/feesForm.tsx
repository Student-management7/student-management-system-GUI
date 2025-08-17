import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { validationSchema } from "../../../services/feesServices/AdminFeescreationForm/validation"
import { FeeFormValues, FeesFormProps } from "../../../services/feesServices/AdminFeescreationForm/type";
import { saveFees, updateFee } from "../../../services/feesServices/AdminFeescreationForm/api"; 

import { toast } from "react-toastify";
import { sortArrayByKey } from "../../Utils/sortArrayByKey";
import axiosInstance from "../../../services/Utils/apiUtils";

interface ClassData {
  className: string;
}

const FeesForm: React.FC<FeesFormProps> = ({ initialData, onSave, onCancel }) => {
  const [classes, setClasses] = useState<ClassData[]>([]);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/class/data");
      const sortedClasses = sortArrayByKey(response.data.classData, "className");
      setClasses(sortedClasses); // Set the sorted class data
    } catch (error) {
      toast.warning("Failed to fetch class data");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const initialValues: FeeFormValues = initialData || {
    className: "",
    schoolFee: 0,
    sportsFee: 0,
    bookFee: 0,
    transportation: 0,
    otherAmount: [{ name: "", amount: 0 }],
  };

  const handleSubmit = async (values: FeeFormValues) => {
    try {
      if (initialData) {
       
        await updateFee(initialData.id, values);
        toast.success("Fee updated successfully!");
      } else {
        
        await saveFees(values);
        toast.success("Fee saved successfully!");
      }
      onSave(values); 
      onCancel();
    } catch (error) {
      toast.warn("class fee already present");
      console.error("Error saving/updating fee:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          {/* Class Name Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Class Name</label>
            <Field
              as="select"
              name="className"
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.className} value={cls.className}>
                  Class {cls.className}
                </option>
              ))}
            </Field>
            <ErrorMessage name="className" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Fee Fields */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "schoolFee", label: "School Fee" },
              { name: "sportsFee", label: "Sports Fee" },
              { name: "bookFee", label: "Book Fee" },
              { name: "transportation", label: "Transportation Fee" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block mb-2 font-semibold" htmlFor={name}>
                  {label}
                </label>
                <Field
                  type="number"
                  id={name}
                  name={name}
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
              </div>
            ))}
          </div>

      
         {/* Other Amounts */}
  <div className="mt-4">
  <label className="block mb-2 font-semibold">Other Amounts</label>
  <FieldArray name="otherAmount">
    {({ push, remove }) => (
      <>
        {values.otherAmount.map((_, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <button
              type="button"
              onClick={() => push({ name: "", amount :0 })}
              className="bi bi-plus-circle-fill text-blue-500"
            >
            
            </button>
            <div className="flex-1">
              <Field
                name={`otherAmount[${index}].name`}
                placeholder="Name"
                className="p-2 border rounded-md w-full"
              />
              <ErrorMessage
                name={`otherAmount[${index}].name`}
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="flex-1">
              <Field
                name={`otherAmount[${index}].amount`}
                placeholder="Amount"
                type="number"
                className={`p-2 border rounded-md w-full ${!values.otherAmount[index].name.trim() ? 'bg-gray-200 border-gray-400 cursor-not-allowed' : ''}`}
                disabled={!values.otherAmount[index].name || !values.otherAmount[index].name.trim()}
                
              />
              <ErrorMessage
                name={`otherAmount[${index}].amount`}
                component="div"
                className="text-red-500 text-sm mt-1" // Make sure you add error classes
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="bi bi-dash-circle-fill text-red-600 cursor-pointer bold"
            >
             
            </button>
          </div>
        ))}
      </>
    )}
  </FieldArray>
</div>


          <div className="mt-6 flex justify-between">
            <button type="submit" className="btn button text-white">
              {initialData ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn buttonred text-white"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FeesForm;