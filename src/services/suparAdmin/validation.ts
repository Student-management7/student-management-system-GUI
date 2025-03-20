import * as Yup from "yup";

export const getSchoolValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        schoolName: Yup.string()
            .required("Name is required")
            .min(2, "Name must be at least 2 characters"),
        schoolAddress: Yup.string()
            .required("Address is required")
            .min(2, "Address must be at least 2 characters"),
        adminContact: Yup.string().required("Admin contact is required"),
        serviceStartDate: Yup.date().required("Service start date is required"),
        email: isEditMode
            ? Yup.string().email("Invalid email") // Not required in edit mode
            : Yup.string()
                  .email("Invalid email")
                  .required("Email is required"), // Required in add mode
        password: isEditMode
            ? Yup.string() // Not required in edit mode
            : Yup.string().required("Password is required"), // Required in add mode
    });
};