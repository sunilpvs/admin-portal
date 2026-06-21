import { Box } from "@mui/material";
import { useState } from "react";

function LeaveCalendarTable({
  holidays,
  deleteHoliday,
  editHoliday,
  currentPage,
  itemsPerPage,
  total,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "holiday_name",
    direction: "asc",
  });

  const sortedHolidays = [...holidays].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    const aValue = String(a[key] || "").toLowerCase();
    const bValue = String(b[key] || "").toLowerCase();

    if (aValue < bValue) return -1 * dir;
    if (aValue > bValue) return 1 * dir;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const startSerial = (currentPage - 1) * itemsPerPage;

  return (
    <Box m="20px">
      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
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

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Sr No</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("holiday_name")}
              >
                Holiday Name
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("holiday_date")}
              >
                Holiday Date
              </th>
              <th>Branches</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("description")}
              >
                Description
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedHolidays.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No Records Found
                </td>
              </tr>
            ) : (
              sortedHolidays.map((holiday, index) => (
                <tr key={holiday.holiday_id}>
                  <td>{startSerial + index + 1}</td>
                  <td>{holiday.holiday_name}</td>
                  <td>{new Date(holiday.holiday_date).toLocaleDateString()}</td>
                  <td>
                    {Array.isArray(holiday.branches)
                      ? holiday.branches.join(", ")
                      : holiday.branches}
                  </td>
                  <td>{holiday.description}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => editHoliday(holiday)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteHoliday(holiday.holiday_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-body">
            Showing {sortedHolidays.length} of {total} holidays
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

export default LeaveCalendarTable;
