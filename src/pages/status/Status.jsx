import { useEffect, useState } from "react";
import StatusForm from "./StatusForm";
import StatusTable from "./StatusTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import {
  getPaginatedStatuses,
  addStatus,
  editStatus,
  deleteStatus,
} from "../../services/admin/statusService";

const Status = () => {
  const [statuses, setAllStatuses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);



     const fetchStatuses = async () => {
        try {
          const res = await getPaginatedStatuses(1, 1000); // large number to fetch all
          setAllStatuses(res.data.statuses || []);
        } catch (err) {
          console.error("Failed to fetch cities", err);
          toast.error("Failed to load cities");
        }
      };
    
      useEffect(() => {
        fetchStatuses();
      }, []);



   const handleDelete = async (id) => {
      try {
        await deleteStatus(id);
        toast.success("Status deleted successfully");
        fetchStatuses();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete city");
      }
    };


  const handleSubmit = async (formData) => {
    try {
      let response;
      if (editMode) {
        response = await editStatus(formData.id, formData);
      } else {
        response = await addStatus(formData);
      }
      if (response?.data?.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.message);
      }
      setPage(1);
      fetchStatuses(1, limit);
      setOpenForm(false);
      setSelectedStatus(null);
      setEditMode(false);
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
        console.error("API error:", err.response.data.error);
      } else {
        toast.error("An error occurred while saving status.");
        console.error("Submit failed", err);
      }
    }
  };

  const handleEdit = (status) => {
    setSelectedStatus(status);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedStatus({ code: "", status: "", module: "" });
    setEditMode(false);
    setOpenForm(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage > 0 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    if (newLimit !== limit) {
      setLimit(newLimit);
      setPage(1);
    }
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedStatus(null);
    setEditMode(false);
  };

  const handleSearchChange = (newSearch) => {
    if (newSearch !== searchTerm) {
      setSearchTerm(newSearch);
      setPage(1);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <button className="btn btn-primary float-end mb-3" onClick={handleAdd}>
            + Add Status
          </button>
          <StatusTable
            statuses={statuses}
            deleteStatus={handleDelete}
            editStatus={handleEdit}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {openForm && (
            <StatusForm
              data={selectedStatus}
              add={handleSubmit}
              close={closeForm}
              editMode={editMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;