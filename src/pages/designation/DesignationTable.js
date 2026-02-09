import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function DesignationTable({
  designations,
  deleteDesignation,
  editDesignation,
  currentPage,
  total,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const theme = useTheme();

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Filter designations
  const filteredDesignations = designations.filter(
    (designation) =>
      designation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort designations
  const sortedDesignations = [...filteredDesignations].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    if (a[key].toLowerCase() < b[key].toLowerCase()) return -1 * dir;
    if (a[key].toLowerCase() > b[key].toLowerCase()) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sortedDesignations.length / itemsPerPage) || 1;

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDesignations = sortedDesignations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      setSortConfig({ key: column, direction: "asc" });
    }
  };

  const getSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  // ✅ Export to Excel
  const handleExportExcel = () => {
    const exportData = sortedDesignations.map((item, index) => ({
      "Sr. No.": index + 1,
      Designation: item.name,
      Code: item.code,
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Designations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Designation_List.xlsx");
  };

  return (
    <Box m="20px">
      <Header title="Designation Management" subtitle="Admin / Designation" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        {/* Search + Export + Items per page */}
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
                    color: "#c80404ff",
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
               <button
              className="btn btn-success ms-3 mb-2"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>
          
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Sr. No.</th>
                <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                  Designation{" "}
                  <span className="float-end">{getSortArrow("name")}</span>
                </th>
                <th onClick={() => handleSort("code")} style={{ cursor: "pointer" }}>
                  Code <span className="float-end">{getSortArrow("code")}</span>
                </th>
                <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                  Status{" "}
                  <span className="float-end">{getSortArrow("status")}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedDesignations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted">
                    No designations found.
                  </td>
                </tr>
              ) : (
                paginatedDesignations.map((designation, index) => (
                  <tr key={designation.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{designation.name}</td>
                    <td>{designation.code}</td>
                    <td>{designation.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editDesignation(designation)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteDesignation(designation.id)}
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
          <span className="text-body">
            Showing {paginatedDesignations.length} of{" "}
            {sortedDesignations.length} matching Designations
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

DesignationTable.propTypes = {
  designations: PropTypes.array.isRequired,
  deleteDesignation: PropTypes.func.isRequired,
  editDesignation: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default DesignationTable;
