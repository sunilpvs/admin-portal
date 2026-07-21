import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function EmployeeTable({
  employees,
  deleteEmployee,
  editEmployee,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "firstName",
    direction: "asc",
  });

  /* -------------------- FILTER -------------------- */

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    return (
      (employee.firstName || "").toLowerCase().includes(search) ||
      (employee.lastName || "").toLowerCase().includes(search) ||
      (employee.displayName || "").toLowerCase().includes(search) ||
      (employee.personalEmail || "").toLowerCase().includes(search) ||
      (employee.mobileNo || "").toLowerCase().includes(search) ||
      (employee.employeeType || "").toLowerCase().includes(search) ||
      (employee.entity || "").toLowerCase().includes(search) ||
      (employee.department || "").toLowerCase().includes(search) ||
      (employee.designation || "").toLowerCase().includes(search)
    );
  });

  /* -------------------- SORT -------------------- */

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const valueA = String(a[key] || "").toLowerCase();
    const valueB = String(b[key] || "").toLowerCase();

    if (valueA < valueB) return -1 * dir;
    if (valueA > valueB) return 1 * dir;

    return 0;
  });

  /* -------------------- PAGINATION -------------------- */

  const totalPages =
    Math.ceil(sortedEmployees.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedEmployees = sortedEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  /* -------------------- SORT HANDLER -------------------- */

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      setSortConfig({
        key: column,
        direction:
          sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({
        key: column,
        direction: "asc",
      });
    }
  };

  const getSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }

    return "";
  };

  /* -------------------- EXPORT EXCEL -------------------- */

  const handleExportExcel = () => {
    const exportData = sortedEmployees.map((employee, index) => ({
      "Sr. No.": index + 1,
      "First Name": employee.firstName,
      "Last Name": employee.lastName,
      "Display Name": employee.displayName,
      Entity: employee.entity,
      Department: employee.department,
      Designation: employee.designation,
      "Date of Birth": employee.dob,
      "Personal Email": employee.personalEmail,
      "Mobile No": employee.mobileNo,
      "Employee Type": employee.employeeType,
      "Joining Date": employee.joiningDate,
      "Expiry Date": employee.expiryDate,
      Country: employee.country,
      State: employee.state,
      City: employee.city,
      PIN: employee.pin,
      UAN: employee.uan,
      "Aadhar No": employee.aadharNo,
      PAN: employee.panNo,
      "ESI No": employee.esiNo,
      Bank: employee.bankName,
      "Account No": employee.accountNo,
      IFSC: employee.ifscCode,
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Employees"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "Employee_List.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="Employee Management"
        subtitle="Admin / Employee"
      />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* SEARCH + LIMIT + EXPORT */}

        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">

          <div
            className="position-relative me-3 mb-2"
            style={{
              flex: 1,
              minWidth: "200px",
            }}
          >
            <input
              type="text"
              placeholder="Search Employee..."
              value={searchTerm}
              onChange={(e) =>
                onSearch(e.target.value)
              }
              className="form-control"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearch("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className="d-flex align-items-center mb-2">

            <label className="form-label me-2 mb-0 text-body">
              Items per page:
            </label>

            <select
              className="form-select"
              style={{ width: "120px" }}
              value={itemsPerPage}
              onChange={(e) => {
                onLimitChange(
                  parseInt(e.target.value, 10)
                );

                onPageChange(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option
                  key={num}
                  value={num}
                >
                  {num}
                </option>
              ))}
            </select>

            <button
              className="btn btn-success ms-4"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>

          </div>
        </div>

        {/* TABLE */}

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">

            <thead className="table-dark">

              <tr>
                <th>Sr. No.</th>

                <th
                  onClick={() =>
                    handleSort("displayName")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Display Name{" "}
                  <span className="float-end">
                    {getSortArrow("displayName")}
                  </span>
                </th>

                <th
                  onClick={() =>
                    handleSort("entity")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Entity{" "}
                  <span className="float-end">
                    {getSortArrow("entity")}
                  </span>
                </th>

                <th
                  onClick={() =>
                    handleSort("department")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Department{" "}
                  <span className="float-end">
                    {getSortArrow("department")}
                  </span>
                </th>

                <th
                  onClick={() =>
                    handleSort("designation")
                  }
                  style={{ cursor: "pointer" }}
                >
                  Designation{" "}
                  <span className="float-end">
                    {getSortArrow("designation")}
                  </span>
                </th>

                <th>Mobile No</th>

                <th>Employee Type</th>

                <th>Joining Date</th>

                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {paginatedEmployees.length === 0 ? (

                <tr>
                  <td
                    colSpan="9"
                    className="text-muted"
                  >
                    No employees found.
                  </td>
                </tr>

              ) : (

                paginatedEmployees.map(
                  (data, index) => (

                    <tr key={data.id}>

                      <td>
                        {startIndex + index + 1}
                      </td>

                      <td>
                        {data.displayName ||
                          `${data.firstName || ""} ${
                            data.lastName || ""
                          }`}
                      </td>

                      <td>
                        {data.entity}
                      </td>

                      <td>
                        {data.department}
                      </td>

                      <td>
                        {data.designation}
                      </td>

                      <td>
                        {data.mobileNo}
                      </td>

                      <td>
                        {data.employeeType}
                      </td>

                      <td>
                        {data.joiningDate}
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            editEmployee(data)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            deleteEmployee(data.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>
        </div>

        {/* PAGINATION */}

        <div className="d-flex justify-content-between align-items-center mt-3">

          <span className="text-body">
            Showing {paginatedEmployees.length} of{" "}
            {sortedEmployees.length} employees
          </span>

          <div>

            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() =>
                goToPage(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map(
              (_, index) => (

                <button
                  key={index}
                  className={`btn btn-sm me-1 ${
                    currentPage === index + 1
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() =>
                    goToPage(index + 1)
                  }
                >
                  {index + 1}
                </button>

              )
            )}

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                goToPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>
    </Box>
  );
}

EmployeeTable.propTypes = {
  employees: PropTypes.array.isRequired,
  deleteEmployee: PropTypes.func.isRequired,
  editEmployee: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default EmployeeTable;