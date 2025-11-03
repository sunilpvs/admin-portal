import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function CostCenterTable({
                             costCenters,
                             deleteCostCenter,
                             editCostCenter,
                             currentPage,
                             itemsPerPage,
                             onPageChange,
                             onLimitChange,
                             onSearch,
                             searchTerm,
                         }) {
    const [sortConfig, setSortConfig] = useState({ key: "cc_code", direction: "asc" });

    // Filter by search
    const filtered = costCenters.filter((cc) =>
        `${cc.cc_code} ${cc.cc_type} ${cc.entity_name} ${cc.city} ${cc.state} ${cc.country} ${cc.gst_no}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Sorting logic
    const sorted = [...filtered].sort((a, b) => {
        const key = sortConfig.key;
        const dir = sortConfig.direction === "asc" ? 1 : -1;
        const aVal = (a[key] || "").toString().toLowerCase();
        const bVal = (b[key] || "").toString().toLowerCase();
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);

    // Sort click handler
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

    const getSortArrow = (column) =>
        sortConfig.key === column ? (sortConfig.direction === "asc" ? "▲" : "▼") : "";

    const goToPage = (pageNum) => {
        if (onPageChange && pageNum >= 1 && pageNum <= totalPages) onPageChange(pageNum);
    };

    return (
        <Box m="20px">
            <Header title="Cost Center Management" subtitle="Admin/Cost Center" />

            <div className="container mt-4 p-3 bg-white rounded shadow-sm">
                {/* Search and Items per page */}
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
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("cc_code")}>
                                Code <span style={{ float: "right" }}>{getSortArrow("cc_code")}</span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("cc_type")}>
                                Type <span style={{ float: "right" }}>{getSortArrow("cc_type")}</span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("entity_name")}>
                                Entity <span style={{ float: "right" }}>{getSortArrow("entity_name")}</span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("city")}>
                                City <span style={{ float: "right" }}>{getSortArrow("city")}</span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("state")}>
                                State <span style={{ float: "right" }}>{getSortArrow("state")}</span>
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("country")}>
                                Country <span style={{ float: "right" }}>{getSortArrow("country")}</span>
                            </th>
                            <th>GST No</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center text-muted">
                                    No cost centers found.
                                </td>
                            </tr>
                        ) : (
                            paginated.map((data, index) => (
                                <tr key={data.id}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{data.cc_code}</td>
                                    <td>{data.cc_type}</td>
                                    <td>{data.entity_name}</td>
                                    <td>{data.city}</td>
                                    <td>{data.state}</td>
                                    <td>{data.country}</td>
                                    <td>{data.gst_no}</td>
                                    <td>{data.status}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => editCostCenter(data)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteCostCenter(data.id)}
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
            Showing {paginated.length} of {sorted.length} matching cost centers
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

CostCenterTable.propTypes = {
    costCenters: PropTypes.array.isRequired,
    deleteCostCenter: PropTypes.func.isRequired,
    editCostCenter: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onLimitChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
};

export default CostCenterTable;
