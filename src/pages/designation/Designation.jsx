import { useEffect, useState } from "react";
import DesignationForm from "./DesignationForm";
import DesignationTable from "./DesignationTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";
import {
  getPaginatedDesignations,
  addDesignation,
  editDesignation,
  deleteDesignation,
} from "../../services/admin/designationService";

const Designation = () => {
  
  const [designations, setAllDesignations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  

   // Fetch all cities once
    const fetchDesignations = async () => {
      try {
        const res = await getPaginatedDesignations(1, 1000); // large number to fetch all
        setAllDesignations(res.data.designations || []);
      } catch (err) {
        console.error("Failed to fetch cities", err);
        toast.error("Failed to load cities");
      }
    };
  
    useEffect(() => {
      fetchDesignations();
    }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDesignation(id);
      toast.success("Deleted successfully");
      fetchDesignations();
    } catch (err) {
      toast.error("Failed to delete");
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = editMode
        ? await editDesignation(formData.id, formData)
        : await addDesignation(formData);

      if (response?.data?.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.message || "Saved successfully");
        fetchDesignations();
        setOpenForm(false);
        setSelectedDesignation(null);
        setEditMode(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const handleAdd = () => {
    setSelectedDesignation({ designation: "", code: "", status: "active" });
    setEditMode(false);
    setOpenForm(true);
  };

   const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1); // reset to first page on search
  };

  const handleEdit = (desig) => {
    setSelectedDesignation(desig);
    setEditMode(true);
    setOpenForm(true);
  };

  return (
    <div className="container mt-4">
     <div className="row justify-content-center">
        <div className="col-md-10">
            <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
              + Add Designation
            </button>
      <DesignationTable
        designations={designations}
        deleteDesignation={handleDelete}
        editDesignation={handleEdit}
        currentPage={page}
        total={total}
        itemsPerPage={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearch={handleSearchChange}
        searchTerm={searchTerm}
      />
      {openForm && (
        <DesignationForm
          data={selectedDesignation}
          add={handleSubmit}
          close={() => {
            setOpenForm(false);
            setSelectedDesignation(null);
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

export default Designation;