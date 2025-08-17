import React from "react";
import  GridView from "./GridView";
import './Attendence.scss';

interface AttendanceTableProps {
  rowData: any[];
  columnDefs: any[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ rowData, columnDefs }) => {
  return (
    <div className="box">
      <GridView rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default AttendanceTable;
