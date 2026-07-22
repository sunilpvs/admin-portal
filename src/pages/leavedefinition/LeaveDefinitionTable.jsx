import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function LeaveDefinitionTable({
  leaves,
  deleteLeave,
  editLeave,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  searchTerm,
  onSearch,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "year",
    direction: "asc",
  });

  /* ---------------- FILTER ---------------- */

  const filteredLeaves = leaves.filter(
    (item) =>
      item.year?.toString().includes(searchTerm) ||
      item.casual?.toString().includes(searchTerm) ||
      item.earned?.toString().includes(searchTerm) ||
      item.paid?.toString().includes(searchTerm) ||
      item.special?.toString().includes(searchTerm)
  );

  /* ---------------- SORT ---------------- */

  const sortedLeaves = [...filteredLeaves].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    return (
      ((Number(a[key]) || 0) - (Number(b[key]) || 0)) * dir
    );
  });

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      setSortConfig({
        key: column,
        direction:
          sortConfig.direction === "asc"
            ? "desc"
            : "asc",
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
      return sortConfig.direction === "asc"
        ? "▲"
        : "▼";
    }
    return "";
  };

  /* ---------------- PAGINATION ---------------- */

  const totalPages =
    Math.ceil(
      sortedLeaves.length / itemsPerPage
    ) || 1;

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedLeaves =
    sortedLeaves.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const goToPage = (pageNum) => {
    if (
      pageNum >= 1 &&
      pageNum <= totalPages
    ) {
      onPageChange(pageNum);
    }
  };

  /* ---------------- EXPORT EXCEL ---------------- */

  const handleExportExcel = () => {
    const exportData = sortedLeaves.map(
      (item, index) => ({
        "Sr. No.": index + 1,
        Year: item.year,
        Casual: item.casual,
        Earned: item.earned,
        Paid: item.paid,
        Special: item.special,
        Total: item.total,
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leave Definition"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/octet-stream",
      }
    );

    saveAs(
      fileData,
      "LeaveDefinition_List.xlsx"
    );
  };

  return (
    <Box m="20px">
      <Header
        title="Leave Definition"
        subtitle="Leave Management / Leave Definition"
      />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* Search + Export + Items Per Page */}

        <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">

          <div
            className="position-relative me-3 mb-2"
            style={{
              flex: 1,
              minWidth: "250px",
            }}
          >
            <input
              type="text"
              placeholder="Search..."
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
                  background:
                    "transparent",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className="d-flex align-items-center mb-2">

            <label
              className="form-label me-2 mb-0"
              style={{
                color: "#000",
                fontWeight: "500",
              }}
            >
              Items Per Page:
            </label>

            <select
              className="form-select"
              style={{ width: "120px" }}
              value={itemsPerPage}
              onChange={(e) => {
                onLimitChange(
                  parseInt(
                    e.target.value,
                    10
                  )
                );
                onPageChange(1);
              }}
            >
              {[5, 10, 20, 50].map(
                (num) => (
                  <option
                    key={num}
                    value={num}
                  >
                    {num}
                  </option>
                )
              )}
            </select>

            <button
              className="btn btn-success ms-3"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">

            <thead className="table-dark">
              <tr>
                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleSort("year")
                  }
                >
                  Year {getSortArrow("year")}
                </th>

                <th>Casual</th>
                <th>Earned</th>
                <th>Paid</th>
                <th>Special</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLeaves.length ===
              0 ? (
                <tr>
                  <td colSpan="7">
                    No Records Found
                  </td>
                </tr>
              ) : (
                paginatedLeaves.map(
                  (item, index) => (
                    <tr key={item.id}>
                      <td>{item.year}</td>
                      <td>{item.casual}</td>
                      <td>{item.earned}</td>
                      <td>{item.paid}</td>
                      <td>{item.special}</td>
                      <td>{item.total}</td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() =>
                            editLeave(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteLeave(
                              item.id
                            )
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

        {/* Pagination */}

        <div className="d-flex justify-content-between align-items-center mt-3">

          <span
            style={{
              color: "#000",
              fontWeight: "500",
            }}
          >
            Showing {paginatedLeaves.length} of{" "}
            {sortedLeaves.length} Leave
            Definitions
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
                    currentPage ===
                    index + 1
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

export default LeaveDefinitionTable;