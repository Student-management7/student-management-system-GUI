

import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { validationSchema } from "../../../services/feesServices/AdminFeescreationForm/validation";
import { FeeFormValues, FeesFormProps } from "../../../services/feesServices/AdminFeescreationForm/type";
import { saveFees } from "../../../services/feesServices/AdminFeescreationForm/api";

const FeesForm: React.FC<FeesFormProps> = ({ initialData, onSave, onCancel }) => {
  const initialValues: FeeFormValues = initialData || {
    className: "",
    schoolFee: 0,
    sportsFee: 0,
    bookFee: 0,
    transportation: 0,
    otherAmount: [{ name: "", amount: 0 }],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSave(values);
      }}
    >
      {({ values }) => (
        <Form>
          {/* Class Name Field */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Class Name</label>
            <Field as="select" name="className" className="w-full p-2 border rounded-md">
              <option value="">Select Class</option>
              {["Nursery", "UKG", "LKG", ...Array.from({ length: 12 }, (_, i) => i + 1)].map(
                (className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                )
              )}
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
                    <div
                      key={index}
                      className="flex items-center gap-4 mb-2"
                    >
                      <button
                        type="button"
                        onClick={() => push({ name: "", amount: 0 })}
                        className="bi bi-plus-circle-fill text-blue-500"
                      >

                      </button>
                      <Field
                        name={`otherAmount[${index}].name`}
                        placeholder="Name"
                        className="p-2 border rounded-md flex-1"
                      />
                      <Field
                        name={`otherAmount[${index}].amount`}
                        placeholder="Amount"
                        type="number"
                        className="p-2 border rounded-md flex-1"
                      />
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

          {/* Submit and Cancel Buttons */}
          <div className="mt-6 flex justify-between">
            {initialData ? (
              <>
                <button
                  type="submit"
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 button"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 btn-danger"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

        </Form>
      )}
    </Formik>
  );
};

export default FeesForm;