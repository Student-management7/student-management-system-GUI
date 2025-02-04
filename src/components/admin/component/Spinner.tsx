import React from 'react';
import { ClipLoader } from 'react-spinners';

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 50, color = '#4F46E5' }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default Spinner;

