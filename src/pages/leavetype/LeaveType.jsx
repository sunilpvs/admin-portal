import { useState } from "react";
import LeaveTypeForm from "./LeaveTypeForm";
import LeaveTypeTable from "./LeaveTypeTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

const LeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);


  const handleSubmit = (formData) => {
    if (editMode) {
      setLeaveTypes(
        leaveTypes.map((item) =>
          item.id === formData.id ? formData : item
        )
      );
      toast.success("Leave Type Updated");
    } else {
      setLeaveTypes([
        ...leaveTypes,
        {
          ...formData,
          id: Date.now(),
        },
      ]);
      toast.success("Leave Type Added");
    }

    setOpenForm(false);
    setEditMode(false);
    setSelectedLeaveType(null);
  };

  const handleDelete = (id) => {
    setLeaveTypes(
      leaveTypes.filter((item) => item.id !== id)
    );
    toast.success("Leave Type Deleted");
  };

  const handleEdit = (data) => {
    setSelectedLeaveType(data);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedLeaveType({
      leave_type_name: "",
      description: "",
    });

    setEditMode(false);
    setOpenForm(true);
  };

  return (
    <div className="container mt-4">

      <button
        className="btn btn-primary float-end mb-3"
        onClick={handleAdd}
      >
        + Add Leave Type
      </button>

      <LeaveTypeTable
        leaveTypes={leaveTypes}
        deleteLeaveType={handleDelete}
        editLeaveType={handleEdit}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />

      {openForm && (
        <LeaveTypeForm
          data={selectedLeaveType}
          add={handleSubmit}
          close={() => setOpenForm(false)}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default LeaveType;