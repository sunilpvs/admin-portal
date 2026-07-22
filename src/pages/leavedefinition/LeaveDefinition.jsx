import { useEffect, useState } from "react";
import LeaveDefinitionForm from "./LeaveDefinitionForm";
import LeaveDefinitionTable from "./LeaveDefinitionTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

const LeaveDefinition = () => {
  const [allLeaves, setAllLeaves] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setAllLeaves([]);
  };

  const handleDelete = (id) => {
    setAllLeaves(allLeaves.filter((item) => item.id !== id));
    toast.success("Leave Definition deleted successfully");
  };

  const handleSubmit = (formData) => {
    if (editMode) {
      setAllLeaves(
        allLeaves.map((item) =>
          item.id === formData.id ? formData : item
        )
      );
      toast.success("Updated Successfully");
    } else {
      setAllLeaves([
        ...allLeaves,
        {
          ...formData,
          id: Date.now(),
        },
      ]);
      toast.success("Added Successfully");
    }

    setOpenForm(false);
    setEditMode(false);
    setSelectedLeave(null);
  };

  const handleEdit = (data) => {
    setSelectedLeave(data);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedLeave({
      year: "",
      casual: "",
      earned: "",
      paid: "",
      special: "",
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
        + Add Leave Definition
      </button>

      <LeaveDefinitionTable
        leaves={allLeaves}
        deleteLeave={handleDelete}
        editLeave={handleEdit}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />

      {openForm && (
        <LeaveDefinitionForm
          data={selectedLeave}
          add={handleSubmit}
          close={() => setOpenForm(false)}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default LeaveDefinition;