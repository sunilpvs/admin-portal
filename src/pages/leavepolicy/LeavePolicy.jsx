import { useState } from "react";
import LeavePolicyForm from "./LeavePolicyForm";
import LeavePolicyTable from "./LeavePolicyTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

const LeavePolicy = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (formData) => {
    if (editMode) {
      setLeavePolicies((prev) =>
        prev.map((item) =>
          item.id === formData.id ? formData : item
        )
      );

      toast.success("Leave Policy Updated Successfully");
    } else {
      setLeavePolicies((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
        },
      ]);

      toast.success("Leave Policy Added Successfully");
    }

    setOpenForm(false);
    setEditMode(false);
    setSelectedPolicy(null);
  };

  const handleDelete = (id) => {
    setLeavePolicies(
      leavePolicies.filter((item) => item.id !== id)
    );

    toast.success("Leave Policy Deleted Successfully");
  };

  const handleEdit = (policy) => {
    setSelectedPolicy(policy);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedPolicy({
      leave_type: "",
      annual_quota: "",
      year: "",
      carry_forward: "",
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
        + Add Leave Policy
      </button>

      <LeavePolicyTable
        leavePolicies={leavePolicies}
        deleteLeavePolicy={handleDelete}
        editLeavePolicy={handleEdit}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />

      {openForm && (
        <LeavePolicyForm
          data={selectedPolicy}
          add={handleSubmit}
          close={() => setOpenForm(false)}
          editMode={editMode}
        />
      )}

    </div>
  );
};

export default LeavePolicy;