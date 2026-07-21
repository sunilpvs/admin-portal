import { useEffect, useState } from "react";
import axios from "axios";

import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";

import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/employees";

const Employee = () => {
  const [allEmployees, setAllEmployees] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  /* =====================================================
     FETCH EMPLOYEES
  ===================================================== */

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_URL}?page=1&limit=1000`
      );

      setAllEmployees(
        response.data.employees ||
          response.data.data ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to fetch employees:",
        error
      );

      toast.error(
        "Failed to load employees"
      );
    }
  };

  /* =====================================================
     LOAD EMPLOYEES ON PAGE LOAD
  ===================================================== */

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* =====================================================
     DELETE EMPLOYEE
  ===================================================== */

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/${id}`
      );

      toast.success(
        "Employee deleted successfully"
      );

      fetchEmployees();
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      toast.error(
        "Failed to delete employee"
      );
    }
  };

  /* =====================================================
     ADD / UPDATE EMPLOYEE
  ===================================================== */

  const handleSubmit = async (formData) => {
    try {
      if (editMode) {
        await axios.put(
          `${API_URL}/${formData.id}`,
          formData
        );

        toast.success(
          "Employee updated successfully"
        );
      } else {
        await axios.post(
          API_URL,
          formData
        );

        toast.success(
          "Employee Createded Successfully"
        );
      }

      setOpenForm(false);
      setSelectedEmployee(null);
      setEditMode(false);

      await fetchEmployees();

      setPage(1);
    } catch (error) {
      console.error(
        "Submit failed:",
        error
      );

      toast.error(
        "Failed to save employee"
      );
    }
  };

  /* =====================================================
     EDIT EMPLOYEE
  ===================================================== */

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);

    setEditMode(true);

    setOpenForm(true);
  };

  /* =====================================================
     ADD EMPLOYEE
  ===================================================== */

  const handleAdd = () => {
    setSelectedEmployee({
      entityId: "",
      departmentId: "",
      designationId: "",

      firstName: "",
      lastName: "",
      displayName: "",

      dob: "",
      personalEmail: "",
      mobileNo: "",

      employeeType: "Regular",

      joiningDate: new Date()
        .toISOString()
        .split("T")[0],

      expiryDate: "",

      add1: "",
      add2: "",

      countryId: "",
      stateId: "",
      cityId: "",

      pin: "",

      uan: "",
      aadharNo: "",
      panNo: "",
      esiNo: "",

      bankName: "",
      accountNo: "",
      ifscCode: "",
    });

    setEditMode(false);

    setOpenForm(true);
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);

    setPage(1);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);

    setPage(1);
  };

  /* =====================================================
     CLOSE FORM
  ===================================================== */

  const closeForm = () => {
    setOpenForm(false);

    setSelectedEmployee(null);

    setEditMode(false);
  };

  return (
    <div className="container-fluid mt-4">

      <div className="row justify-content-center">

        <div className="col-md-12">

          {/* ADD EMPLOYEE BUTTON */}

          <button
            className="btn btn-primary float-end mt-4"
            onClick={handleAdd}
          >
            + Create Employee
          </button>

          {/* EMPLOYEE TABLE */}

          <EmployeeTable
            employees={allEmployees}
            deleteEmployee={handleDelete}
            editEmployee={handleEdit}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {/* EMPLOYEE FORM */}

          {openForm && (
            <EmployeeForm
              data={selectedEmployee}
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

export default Employee;