import { useCallback, useContext, useEffect, useState } from "react";

import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import EmployeeViewModal from "./EmployeeViewModal";

import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import { AppContext } from "../../context/AppContext";
import {
  addEmployee,
  getEmployeeById,
  getEmployees,
} from "../../services/hr/employeeService";

const getInitialFormData = () => ({
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
  joiningDate: new Date().toISOString().split("T")[0],
  exitDate: "",
  add1: "",
  add2: "",
  countryId: "",
  stateId: "",
  cityId: "",
  pin: "",
  officeLocationId: "",
  uan: "",
  aadharNo: "",
  panNo: "",
  esiNo: "",
  bankName: "",
  accountNo: "",
  ifscCode: "",
  m365Required: false,
  officialEmail: "",
  domain: "",
  oldEmpCode: "",
});

const Employee = () => {
  const { userData } = useContext(AppContext);

  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchEmployees = useCallback(async (pageOverride, limitOverride) => {
    const activePage = pageOverride ?? page;
    const activeLimit = limitOverride ?? limit;

    setLoading(true);
    try {
      const response = await getEmployees(activePage, activeLimit);
      setEmployees(response.employees || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (payload) => {
    try {
      const result = await addEmployee(payload);
      toast.success(result.message || "Employee record added successfully");
      setOpenForm(false);
      setSelectedEmployee(null);
      setPage(1);
      await fetchEmployees(1, limit);
    } catch (error) {
      console.error("Submit failed:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to save employee";
      toast.error(message);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(getInitialFormData());
    setOpenForm(true);
  };

  const handleView = async (id) => {
    setOpenViewModal(true);
    setViewEmployee(null);
    setViewLoading(true);

    try {
      const employee = await getEmployeeById(id);
      setViewEmployee(employee || null);
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
      toast.error("Failed to load employee details");
      setOpenViewModal(false);
    } finally {
      setViewLoading(false);
    }
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
    setSelectedEmployee(null);
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewEmployee(null);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <button
            className="btn btn-primary float-end mt-4"
            onClick={handleAdd}
          >
            + Create Employee
          </button>

          <EmployeeTable
            employees={employees}
            total={total}
            currentPage={page}
            itemsPerPage={limit}
            loading={loading}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
            onView={handleView}
          />

          {openForm && (
            <EmployeeForm
              data={selectedEmployee}
              add={handleSubmit}
              close={closeForm}
              userData={userData}
            />
          )}

          {openViewModal && (
            <EmployeeViewModal
              employee={viewEmployee}
              loading={viewLoading}
              close={closeViewModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employee;
