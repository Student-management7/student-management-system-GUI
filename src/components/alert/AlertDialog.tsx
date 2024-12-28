import React from "react";

interface AlertDialogProps {
  title: string; // Title of the dialog
  message: string; // Message or description
  isOpen: boolean; // Whether the dialog is visible
  onConfirm: () => void; // Function to execute on OK
  onCancel: () => void; // Function to execute on Cancel
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  message,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; // Don't render the dialog if it's not open

  const styles = {
    overlay: {
      position: "fixed" as "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    dialog: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center" as "center",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    title: {
      margin: "0 0 10px",
    },
    message: {
      margin: "0 0 20px",
    },
    buttons: {
      display: "flex",
      justifyContent: "space-around",
    },
    confirmButton: {
      background: "#28a745",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    cancelButton: {
      background: "#dc3545",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const handleConfirm = () => {
    onConfirm()
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons} >
          <button style={styles.confirmButton} onClick={handleConfirm} >
            OK
          </button>
          <button style={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
