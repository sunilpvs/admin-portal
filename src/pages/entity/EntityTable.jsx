import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function EntityTable({
  entities,
  deleteEntity,
  editEntity,
  currentPage,
  total = 0,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "entity_name",
    direction: "asc",
  });

  // 🔹 Export Excel (basic)
  const handleExportExcel = () => {
    console.log("Export Excel clicked", entities);
    // you can integrate XLSX or backend export here
  };

  // 🔍 Filter
  const filteredEntities = entities.filter((entity) =>
    (entity.entity_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.cin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.incorp_date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.state || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔃 Sort
  const sortedEntities = [...filteredEntities].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const aVal = (a[key] || "").toString().toLowerCase();
    const bVal = (b[key] || "").toString().toLowerCase();

    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sortedEntities.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntities = sortedEntities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (onPageChange && pageNum >= 1 && pageNum <= totalPages) {
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
      <Header title="Entity Management" subtitle="Admin / Entity" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        {/* 🔍 Search + Limit + Export */}
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
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
          </div>

          <div className="d-flex align-items-center mb-2">
            <label className="form-label me-2 mb-0 text-body">
              Items per page:
            </label>
            <select
              className="form-select"
              style={{ width: "200px" }}
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

            {/* ✅ Export button with LEFT margin */}
            <button
              className="btn btn-success ms-3"
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
                <th onClick={() => handleSort("entity_name")} style={{ cursor: "pointer" }}>
                  Company Name <span className="float-end">{getSortArrow("entity_name")}</span>
                </th>
                <th onClick={() => handleSort("cin")} style={{ cursor: "pointer" }}>
                  CIN <span className="float-end">{getSortArrow("cin")}</span>
                </th>
                <th onClick={() => handleSort("incorp_date")} style={{ cursor: "pointer" }}>
                  Incorporation Date <span className="float-end">{getSortArrow("incorp_date")}</span>
                </th>
                <th onClick={() => handleSort("city")} style={{ cursor: "pointer" }}>
                  City <span className="float-end">{getSortArrow("city")}</span>
                </th>
                <th onClick={() => handleSort("state")} style={{ cursor: "pointer" }}>
                  State <span className="float-end">{getSortArrow("state")}</span>
                </th>
                <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                  Status <span className="float-end">{getSortArrow("status")}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEntities.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-muted">
                    No entities found
                  </td>
                </tr>
              ) : (
                paginatedEntities.map((entity, index) => (
                  <tr key={entity.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{entity.entity_name}</td>
                    <td>{entity.cin}</td>
                    <td>{entity.incorp_date}</td>
                    <td>{entity.city}</td>
                    <td>{entity.state}</td>
                    <td>{entity.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editEntity(entity)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteEntity(entity.id)}
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
      </div>
    </Box>
  );
}

EntityTable.propTypes = {
  entities: PropTypes.array,
  deleteEntity: PropTypes.func.isRequired,
  editEntity: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  total: PropTypes.number,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default EntityTable;
