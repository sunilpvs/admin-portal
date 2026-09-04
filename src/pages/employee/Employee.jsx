import { useCallback, useContext, useEffect, useState } from "react";

import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import EmployeeViewModal from "./EmployeeViewModal";
import EmployeeImportModal from "./EmployeeImportModal";

import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import { AppContext } from "../../context/AppContext";
import {
  addEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
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

const normalizeEmployeeType = (employeeType) => {
  if (String(employeeType || "").toLowerCase() === "contract") {
    return "Contract";
  }

  return "Regular";
};

const getFormDataFromEmployee = (employee) => ({
  id: employee.id || employee.employee_id || "",
  entityId: employee.entity_id || employee.entityId || "",
  departmentId: employee.department_id || employee.departmentId || "",
  designationId: employee.designation_id || employee.designationId || "",
  firstName: employee.first_name || employee.firstName || "",
  lastName: employee.last_name || employee.lastName || "",
  displayName: employee.display_name || employee.displayName || "",
  dob: employee.dob || "",
  personalEmail: employee.personal_email || employee.personalEmail || "",
  mobileNo: employee.mobile || employee.mobile_no || employee.mobileNo || "",
  employeeType: normalizeEmployeeType(employee.emp_type || employee.employeeType),
  joiningDate: employee.join_date || employee.joining_date || employee.joiningDate || "",
  exitDate: employee.exit_date || employee.exitDate || "",
  add1: employee.add1 || "",
  add2: employee.add2 || "",
  countryId: employee.country_id || employee.countryId || "",
  stateId: employee.state_id || employee.stateId || "",
  cityId: employee.city_id || employee.cityId || "",
  pin: employee.pin || "",
  officeLocationId: employee.office_location_id || employee.officeLocationId || "",
  uan: employee.uan || "",
  aadharNo: employee.aadhar || employee.aadhar_no || "",
  panNo: employee.pan_no || employee.pan || "",
  esiNo:
    ["NA", "N/A"].includes(
      String(employee.esi_no || employee.esi || "").trim().toUpperCase()
    )
      ? ""
      : employee.esi_no || employee.esi || "",
  bankName: employee.bank_name || employee.bankName || "",
  accountNo: employee.bank_account_no || employee.accountNo || "",
  ifscCode: employee.ifsc_code || employee.ifscCode || "",
  m365Required:
    String(employee.m365 || "").toLowerCase() === "yes" ||
    employee.m365 === 1 ||
    employee.m365 === true,
  officialEmail: employee.email ? employee.email.split("@")[0] : "",
  domain: employee.email?.includes("@") ? employee.email.split("@")[1] : "",
  oldEmpCode: employee.old_emp_code || employee.oldEmpCode || "",
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
  const [editMode, setEditMode] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);

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
      const result = editMode
        ? await updateEmployee(selectedEmployee.id, payload)
        : await addEmployee(payload);
      toast.success(
        result.message ||
          (editMode
            ? "Employee record updated successfully"
            : "Employee record added successfully")
      );
      setOpenForm(false);
      setSelectedEmployee(null);
      setEditMode(false);
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
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = async (id) => {
    try {
      const employee = await getEmployeeById(id);
      if (!employee) {
        toast.error("Employee details not found");
        return;
      }

      setSelectedEmployee(getFormDataFromEmployee(employee));
      setEditMode(true);
      setOpenForm(true);
    } catch (error) {
      console.error("Failed to fetch employee for editing:", error);
      toast.error("Failed to load employee details");
    }
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
    setEditMode(false);
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewEmployee(null);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
            <button
              className="btn btn-outline-success"
              onClick={() => setOpenImportModal(true)}
            >
              Import Employees
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAdd}
            >
              + Create Employee
            </button>
          </div>

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
            onEdit={handleEdit}
          />

          {openForm && (
            <EmployeeForm
              data={selectedEmployee}
              add={handleSubmit}
              close={closeForm}
              userData={userData}
              editMode={editMode}
            />
          )}

          {openImportModal && (
            <EmployeeImportModal
              close={() => setOpenImportModal(false)}
              onImportComplete={() => fetchEmployees(1, limit)}
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
