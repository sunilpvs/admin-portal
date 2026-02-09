import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function StatusTable({
  statuses,
  deleteStatus,
  editStatus,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
  handleExportExcel, // 👈 add this prop
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "status",
    direction: "asc",
  });

  /* 🔍 Filter */
  const filteredStatuses = statuses.filter(
    (item) =>
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ↕️ Sort */
  const sortedStatuses = [...filteredStatuses].sort((a, b) => {
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key].localeCompare(b[sortConfig.key]) * dir;
  });

  const totalPages = Math.ceil(filteredStatuses.length / itemsPerPage) || 1;

  /* 📄 Pagination */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStatuses = sortedStatuses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortArrow = (column) =>
    sortConfig.key === column
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : "";

  return (
    <Box m="20px">
      <Header title="Status Management" subtitle="Admin / Status" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* 🔍 Search + Export + Limit */}
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">

          {/* Search */}
            <div
            className="position-relative me-3 mb-2"
            style={{ flex: 1, minWidth: "200px" }}
          >
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
                className="btn btn-sm position-absolute"
                style={{
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Export + Limit */}
          <div className="d-flex align-items-center mb-2">

            {/* ✅ Export Excel (LEFT MARGIN ADDED) */}
           

            <label className="form-label me-2 mb-0 text-body">
              Items per page:
            </label>
            <select
              className="form-select"
              style={{ width: "120px" }}
              value={itemsPerPage}
              onChange={(e) => {
                onLimitChange(Number(e.target.value));
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
              className="btn btn-success me-3 ms-3"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* 📋 Table */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr. No.</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("code")}>
                  Code <span className="float-end">{getSortArrow("code")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                  Status <span className="float-end">{getSortArrow("status")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("module")}>
                  Module <span className="float-end">{getSortArrow("module")}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStatuses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted">
                    No statuses found.
                  </td>
                </tr>
              ) : (
                paginatedStatuses.map((data, index) => (
                  <tr key={data.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{data.code}</td>
                    <td>{data.status}</td>
                    <td>{data.module}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editStatus(data)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteStatus(data.id)}
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

        {/* 📄 Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing {paginatedStatuses.length} of {sortedStatuses.length} matching statuses
          </span>

          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm me-1 ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

StatusTable.propTypes = {
  statuses: PropTypes.array.isRequired,
  deleteStatus: PropTypes.func.isRequired,
  editStatus: PropTypes.func.isRequired,
  handleExportExcel: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default StatusTable;
