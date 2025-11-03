import React, { useState, useEffect } from "react";
import EntityTable from "./EntityTable";
import EntityForm from "./EntityForm";
import toast from "react-hot-toast";
import {
  getPaginatedEntities,
  addEntity,
  editEntity,
  deleteEntity,
} from "../../services/admin/entityService";

const Entity = () => {
  const [entities, setAllEntities] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

 // Fetch all Entities once
  const fetchEntities = async () => {
    try {
      const res = await getPaginatedEntities(1, 1000); // large number to fetch all
      setAllEntities(res.data.entities || []);
    } catch (err) {
      console.error("Failed to fetch Entities", err);
      toast.error("Failed to load Entities");
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);


    const handleDelete = async (id) => {
      try {
        await deleteEntity(id);
        toast.success("Entity deleted successfully");
        fetchEntities();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete Entity");
      }
    };

 const handleSubmit = async (formData) => {
    try {
      if (editMode) {
        await editEntity(formData.id, formData);
        toast.success("City updated successfully");
      } else {
        await addEntity(formData);
        toast.success("City added successfully");
      }
      setOpenForm(false);
      setSelectedEntity(null);
      setEditMode(false);
      fetchEntities();
      setPage(1);
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to save city");
    }
  };

  const handleEdit = (entity) => {
    setSelectedEntity(entity);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedEntity({
      entity_name: "",
      cin: "",
      incorp_date: "",
      city_id: "",
      state_id: "",
      country_id: "",
      status: "",
      primary_contact_id: "",
      cc_code: "",
      gst_no: "",
      add1: "",
      add2: "",
      pin: ""
    });
    setEditMode(false);
    setOpenForm(true);
  };

   const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1); // reset to first page on search
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedEntity(null);
    setEditMode(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
            + Add Entity
          </button>
          <EntityTable
            entities={entities}
            deleteEntity={handleDelete}
            editEntity={handleEdit}
            currentPage={page}
            total={total}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />
          {openForm && (
            <EntityForm
              data={selectedEntity}
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

export default Entity;
