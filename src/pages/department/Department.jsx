import { useEffect, useState } from "react";
import DepartmentForm from "./DepartmentForm";
import Table from "./DepartmentTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import {
  getPaginatedDepartments,
  addDepartment,
  editDepartment,
  deleteDepartment,
} from "../../services/admin/departmentService";

const Department = () => {
  const [departments, setAllDepartments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

    // Fetch all cities once
    const fetchDepartments = async () => {
      try {
        const res = await getPaginatedDepartments(1, 1000); // large number to fetch all
        setAllDepartments(res.data.departments || []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
        toast.error("Failed to load cities");
      }
    };
  
    useEffect(() => {
      fetchDepartments();
    }, []);


   const handleDelete = async (id) => {
      try {
        await deleteDepartment(id);
        toast.success("Departments deleted successfully");
        fetchDepartments();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete city");
      }
    };

  const handleSubmit = async (formData) => {
    try {
      if (editMode) {
        await editDepartment(formData.id, formData);
        toast.success("City updated successfully");
      } else {
        await addDepartment(formData);
        toast.success("Department added successfully");
      }
      setOpenForm(false);
      setSelectedDepartment(null);
      setEditMode(false);
      fetchDepartments();
      setPage(1);
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to save city");
    }
  };

  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedDepartment({ name: "", code: "", status: "" });
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

  const closeForm = () => {
    setOpenForm(false);
    setSelectedDepartment(null);
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
          <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
            + Add Department
          </button>

          <Table
            departments={departments}
            deleteDepartment={handleDelete}
            editDepartment={handleEdit}
            currentPage={page}
            total={total}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {openForm && (
            <DepartmentForm
              data={selectedDepartment}
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

export default Department;
