import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { validationSchema } from "../../../services/feesServices/AdminFeescreationForm/validation";
import { FeeFormValues } from "../../../services/feesServices/AdminFeescreationForm/type";
import { saveFees } from "../../../services/feesServices/AdminFeescreationForm/api";

const initialValues: FeeFormValues = {
    className: "",
    schoolFee: 0,
    sportsFee: 0,
    bookFee: 0,
    transportation: 0,
    otherAmount: [{ name: "", amount: 0 }],

};

const classes = [
    "Nursery",
    "LKG",
    "UKG",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
];

const FeesForm: React.FC = () => {
    const [error, setError] = React.useState("");
    const handleSubmit = async (values: FeeFormValues) => {
        try {
            const response = await saveFees(values);
            console.log("Response:", response);
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
        }
    };

    return (

        <div className="box max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-xl font-bold mb-4 text-center">Fees Creation Form</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold" htmlFor="className">
                                Class Name
                            </label>
                            <Field as="select" id="className" name="className" className="w-full p-2 border rounded-md">
                                <option value="" disabled>
                                    Select a class
                                </option>
                                {classes.map((classOption) => (
                                    <option key={classOption} value={classOption}>
                                        {classOption}
                                    </option>
                                ))}
                            </Field>

                            <ErrorMessage
                                name="className"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="schoolFee">
                                    School Fee
                                </label>
                                <Field
                                    type="number"
                                    id="schoolFee"
                                    name="schoolFee"
                                    className="w-full p-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="schoolFee"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="sportsFee">
                                    Sports Fee
                                </label>
                                <Field
                                    type="number"
                                    id="sportsFee"
                                    name="sportsFee"
                                    className="w-full p-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="sportsFee"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="bookFee">
                                    Book Fee
                                </label>
                                <Field
                                    type="number"
                                    id="bookFee"
                                    name="bookFee"
                                    className="w-full p-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="bookFee"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    className="block mb-2 font-semibold"
                                    htmlFor="transportation"
                                >
                                    Transportation Fee
                                </label>
                                <Field
                                    type="number"
                                    id="transportation"
                                    name="transportation"
                                    className="w-full p-2 border rounded-md"
                                />
                                <ErrorMessage
                                    name="transportation"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                        </div>

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

                        <button
                            type="submit"
                            className="mt-6 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>

    );
};

export default FeesForm;

