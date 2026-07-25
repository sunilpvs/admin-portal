import PropTypes from "prop-types";
import { Box } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Header from "../../components/Header";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const getDisplayName = (employee) =>
  employee.display_name ||
  `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
  "—";

const getEmail = (employee) => employee.email || employee.personal_email || "—";

const getMobile = (employee) => employee.mobile || "—";

const getEmployeeCode = (employee) => employee.old_emp_code || employee.emp_code || "—";

function EmployeeTable({
  employees,
  total,
  currentPage,
  itemsPerPage,
  loading,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
  onView,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "displayName",
    direction: "asc",
  });

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase();
    if (!search) return employees;

    return employees.filter((employee) => {
      const displayName = getDisplayName(employee).toLowerCase();
      const email = getEmail(employee).toLowerCase();
      const mobile = getMobile(employee).toLowerCase();
      const empCode = getEmployeeCode(employee).toLowerCase();

      return (
        displayName.includes(search) ||
        email.includes(search) ||
        mobile.includes(search) ||
        empCode.includes(search)
      );
    });
  }, [employees, searchTerm]);

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const key = sortConfig.key;
      const dir = sortConfig.direction === "asc" ? 1 : -1;

      let valueA = "";
      let valueB = "";

      if (key === "displayName") {
        valueA = getDisplayName(a).toLowerCase();
        valueB = getDisplayName(b).toLowerCase();
      } else if (key === "email") {
        valueA = getEmail(a).toLowerCase();
        valueB = getEmail(b).toLowerCase();
      } else if (key === "mobile") {
        valueA = getMobile(a).toLowerCase();
        valueB = getMobile(b).toLowerCase();
      } else if (key === "emp_code") {
        valueA = getEmployeeCode(a).toLowerCase();
        valueB = getEmployeeCode(b).toLowerCase();
      }

      if (valueA < valueB) return -1 * dir;
      if (valueA > valueB) return 1 * dir;
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  const totalPages = Math.ceil(total / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      setSortConfig({
        key: column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
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

  const handleExportExcel = () => {
    const exportData = sortedEmployees.map((employee, index) => ({
      "Sr. No.": index + 1,
      "Display Name": getDisplayName(employee),
      Email: getEmail(employee),
      Mobile: getMobile(employee),
      "Employee Code": getEmployeeCode(employee),
      ID: employee.id,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "Employee_List.xlsx");
  };

  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pageNumbers.push(i);
  }

  return (
    <Box m="20px">
      <Header title="Employee Management" subtitle="Admin / Employee" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
          <div
            className="position-relative me-3 mb-2"
            style={{ flex: 1, minWidth: "200px" }}
          >
            <input
              type="text"
              placeholder="Search Employee..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
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
                  transform: "translateY(-50%)",
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
                onLimitChange(parseInt(e.target.value, 10));
                onPageChange(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
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

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr. No.</th>
                <th
                  onClick={() => handleSort("displayName")}
                  style={{ cursor: "pointer" }}
                >
                  Name{" "}
                  <span className="float-end">
                    {getSortArrow("displayName")}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email{" "}
                  <span className="float-end">{getSortArrow("email")}</span>
                </th>
                <th
                  onClick={() => handleSort("mobile")}
                  style={{ cursor: "pointer" }}
                >
                  Mobile{" "}
                  <span className="float-end">{getSortArrow("mobile")}</span>
                </th>
                <th
                  onClick={() => handleSort("emp_code")}
                  style={{ cursor: "pointer" }}
                >
                  Employee Code{" "}
                  <span className="float-end">
                    {getSortArrow("emp_code")}
                  </span>
                </th>
                <th style={{ display: "none" }}>ID</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-muted">
                    Loading employees...
                  </td>
                </tr>
              ) : sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-muted">
                    No employees found.
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((data, index) => (
                  <tr key={data.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{getDisplayName(data)}</td>
                    <td>{getEmail(data)}</td>
                    <td>{getMobile(data)}</td>
                    <td>{getEmployeeCode(data)}</td>
                    <td style={{ display: "none" }}>{data.id}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        title="View employee details"
                        onClick={() => onView(data.id)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-body">
            Showing {sortedEmployees.length} of {total} employees
          </span>

          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                className={`btn btn-sm me-1 ${
                  currentPage === pageNum
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onView: PropTypes.func.isRequired,
};

export default EmployeeTable;
