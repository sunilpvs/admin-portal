import { useEffect, useState } from "react";
import ContactTypeForm from "./ContactTypeForm";
import ContactTypeTable from "./ContactTypeTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import {
  getPaginatedContactTypes,
  addContactType,
  editContactType,
  deleteContactType,
} from "../../services/admin/contactTypeService";

const ContactType = () => {
  const [allContactTypes, setAllContactTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState(null);

  // Fetch all contact types once
  const fetchContactTypes = async () => {
    try {
      const res = await getPaginatedContactTypes(1, 1000); // Fetch all for local pagination/search
      setAllContactTypes(res.data.contact_types || []);
    } catch (err) {
      console.error("Failed to fetch contact types", err);
      toast.error("Failed to load contact types");
    }
  };

  useEffect(() => {
    fetchContactTypes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContactType(id);
      toast.success("Contact Type deleted successfully");
      fetchContactTypes();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete contact type");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editMode) {
        await editContactType(formData.id, formData);
        toast.success("Contact Type updated successfully");
      } else {
        await addContactType(formData);
        toast.success("Contact Type added successfully");
      }
      setOpenForm(false);
      setSelectedContactType(null);
      setEditMode(false);
      fetchContactTypes();
      setPage(1);
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to save contact type");
    }
  };

  const handleEdit = (contactType) => {
    setSelectedContactType(contactType);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedContactType({ name: "", status_name: "active" });
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
    setPage(1);
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedContactType(null);
    setEditMode(false);
  };

  return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
              + Add Contact Type
            </button>

            <ContactTypeTable
                contactTypes={allContactTypes}
                deleteContactType={handleDelete}
                editContactType={handleEdit}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onSearch={handleSearchChange}
                searchTerm={searchTerm}
            />

            {openForm && (
                <ContactTypeForm
                    data={selectedContactType}
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

export default ContactType;
 