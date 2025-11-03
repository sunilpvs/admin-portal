import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function DepartmentTable({
  departments,
  deleteDepartment,
  editDepartment,
  currentPage,
  total,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
 const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" }); // default sort

  // Filter cities based on search term
 const filteredDepartments = departments.filter((department) => 
  department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
  department.status.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Sort the filtered cities
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (a[key].toLowerCase() < b[key].toLowerCase()) return -1 * dir;
    if (a[key].toLowerCase() > b[key].toLowerCase()) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sortedDepartments.length / itemsPerPage) || 1;

  // Paginate sorted cities
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = sortedDepartments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (onPageChange && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      // toggle direction
      setSortConfig({
        key: column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key: column, direction: "asc" }); // default to ascending
    }
  };

  // render sort arrow
  const getSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <Box m="20px">
      <Header title="Department Management" subtitle="Admin/Department" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
          <div className="position-relative me-3 mb-2" style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search..."
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
            <label htmlFor="limitSelect" className="form-label me-2 mb-0 text-body">
              Items per page:
            </label>
            <select
              id="limitSelect"
              className="form-select"
              style={{ width: "250px" }}
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
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th hidden>ID</th>
                <th>Sr. No.</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
                  Name <span style={{ float: "right" }}>{getSortArrow("name")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("code")}>
                  Code <span style={{ float: "right" }}>{getSortArrow("code")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                  Status <span style={{ float: "right" }}>{getSortArrow("status")}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDepartments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No departments found.
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map((departments, index) => (
                  <tr key={departments.id}>
                    
                    <td>{startIndex + index + 1}</td>
                    <td>{departments.name}</td>
                    <td>{departments.code}</td>
                    <td>{departments.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editDepartment(departments)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteDepartment(departments.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="form-label me-2 mb-0 text-body">
            Showing {paginatedDepartments.length} of {sortedDepartments.length} matching Departments
          </span>
          <div>
            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm me-1 ${
                  currentPage === index + 1 ? "btn-primary" : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
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

DepartmentTable.propTypes = {
  departments: PropTypes.array.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  editDepartment: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default DepartmentTable;
