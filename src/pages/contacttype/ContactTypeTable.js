import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function ContactTypeTable({
                            contactTypes,
                            deleteContactType,
                            editContactType,
                            currentPage,
                            itemsPerPage,
                            onPageChange,
                            onLimitChange,
                            onSearch,
                            searchTerm,
                          }) {
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // Filter contact types based on search term
  const filteredContactTypes = contactTypes.filter(
      (ct) =>
          ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ct.status_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered contact types
  const sortedContactTypes = [...filteredContactTypes].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    const valA = a[key]?.toString().toLowerCase() || "";
    const valB = b[key]?.toString().toLowerCase() || "";
    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedContactTypes.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContactTypes = sortedContactTypes.slice(
      startIndex,
      startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (onPageChange && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  // Sorting handler
  const handleSort = (column) => {
    if (sortConfig.key === column) {
      setSortConfig({
        key: column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key: column, direction: "asc" });
    }
  };

  // Sorting arrow indicator
  const getSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
      <Box m="20px">
        <Header title="Contact Type Management" subtitle="Admin/ContactType" />

        <div className="container mt-4 p-3 bg-white rounded shadow-sm">
          {/* Search + Items per page */}
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

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle text-center">
              <thead className="table-dark">
              <tr>
                <th>Sr. No.</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>
                  Name <span style={{ float: "right" }}>{getSortArrow("name")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status_name")}>
                  Status <span style={{ float: "right" }}>{getSortArrow("status_name")}</span>
                </th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {paginatedContactTypes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No contact types found.
                    </td>
                  </tr>
              ) : (
                  paginatedContactTypes.map((data, index) => (
                      <tr key={data.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{data.name}</td>
                        <td>
                          {data.status_name
                              ? data.status_name.charAt(0).toUpperCase() +
                              data.status_name.slice(1)
                              : ""}
                        </td>
                        <td>
                          <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => editContactType(data)}
                          >
                            Edit
                          </button>
                          <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteContactType(data.id)}
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

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="form-label me-2 mb-0 text-body">
            Showing {paginatedContactTypes.length} of {sortedContactTypes.length} matching contact types
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

ContactTypeTable.propTypes = {
  contactTypes: PropTypes.array.isRequired,
  deleteContactType: PropTypes.func.isRequired,
  editContactType: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default ContactTypeTable;
 