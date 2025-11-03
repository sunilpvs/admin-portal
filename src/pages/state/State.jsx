import { useEffect, useState } from "react";
import StateForm from "./StateForm";
import StateTable from "./StateTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-hot-toast';

import {
  getPaginatedStates,
  addState,
  editState,
  deleteState,
} from "../../services/admin/stateService";

const State = () => {
  const [states, setStates] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  // Fetch all states from backend once
  const fetchStates = async () => {
    try {
      const res = await getPaginatedStates(1, 1000); // fetch all states at once
      setStates(res.data.states || []);
    } catch (err) {
      console.error("Failed to fetch states", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteState(id);
      setStates(states.filter((s) => s.id !== id));
      toast.success("State deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };



  const handleSubmit = async (formData) => {
      try {
        if (editMode) {
          await editState(formData.id, formData);
          toast.success("State updated successfully");
        } else {
          await addState(formData);
          toast.success("State added successfully");
        }
        setOpenForm(false);
        setSelectedState(null);
        setEditMode(false);
        fetchStates();
        setPage(1);
      } catch (err) {
        console.error("Submit failed", err);
        toast.error("Failed to save city");
      }
    };
  

  const handleEdit = (stateData) => {
    setSelectedState(stateData);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedState({ state: "", country: "" });
    setEditMode(false);
    setOpenForm(true);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
            + Add State
          </button>

          <StateTable
            states={states}
            deleteState={handleDelete}
            editState={handleEdit}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {openForm && (
            <StateForm
              data={selectedState}
              add={handleSubmit}
              close={() => {
                setOpenForm(false);
                setSelectedState(null);
                setEditMode(false);
              }}
              editMode={editMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default State;
