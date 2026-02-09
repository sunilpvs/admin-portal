import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function CostCenterTypeTable({
  CostCenterTypes,
  deleteCcType,
  editCcType,
  currentPage,
  total,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
  handleExportExcel, // 👈 add this prop
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "cc_type",
    direction: "asc",
  });

  /* 🔍 Filter */
  const filteredCostCenterTypes = CostCenterTypes.filter((item) =>
    item?.cc_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ↕️ Sort */
  const sortedCostCenterTypes = [...filteredCostCenterTypes].sort((a, b) => {
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    return a.cc_type.localeCompare(b.cc_type) * dir;
  });

  const totalPages = Math.ceil(sortedCostCenterTypes.length / itemsPerPage) || 1;

  /* 📄 Pagination */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCostCenterTypes = sortedCostCenterTypes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = () => {
    setSortConfig((prev) => ({
      key: "cc_type",
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortArrow = () =>
    sortConfig.direction === "asc" ? "▲" : "▼";

  return (
    <Box m="20px">
      <Header
        title="Cost Center Type Management"
        subtitle="Admin / CostCenterType"
      />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* 🔍 Search + Export + Limit */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">

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

            {/* ✅ Export Excel with LEFT MARGIN */}
          

            <label className="form-label me-2 mb-0 text-body">Items per page:</label>
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
          <table className="table table-hover table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr. No</th>
                <th style={{ cursor: "pointer" }} onClick={handleSort}>
                  Cost Center Type
                  <span className="float-end">{getSortArrow()}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCostCenterTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-muted">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedCostCenterTypes.map((item, index) => (
                  <tr key={item.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{item.cc_type}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editCcType(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCcType(item.id)}
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

        {/* 📄 Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing {paginatedCostCenterTypes.length} of {total}
          </span>

          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm me-1 ${
                  currentPage === i + 1
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}

CostCenterTypeTable.propTypes = {
  CostCenterTypes: PropTypes.array.isRequired,
  deleteCcType: PropTypes.func.isRequired,
  editCcType: PropTypes.func.isRequired,
  handleExportExcel: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  total: PropTypes.number,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default CostCenterTypeTable;
