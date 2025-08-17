// Create a new file CustomAlert.tsx in your components folder
import React from 'react';

interface AlertProps {
    message: string;
    type?: 'success' | 'error';
    onClose?: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ message, type = 'success', onClose }) => {
    const backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';
    const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';

    return (
        <div
            style={{
                padding: '12px 20px',
                marginBottom: '15px',
                backgroundColor,
                color: textColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '4px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: textColor,
                        cursor: 'pointer',
                        fontSize: '18px'
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default CustomAlert;