import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function LeaveTypeTable({
  leaveTypes,
  deleteLeaveType,
  editLeaveType,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  searchTerm,
  onSearch,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "leave_type_name",
    direction: "asc",
  });

  /* -------------------- FILTER -------------------- */
  const filteredLeaveTypes = leaveTypes.filter(
    (item) =>
      item.leave_type_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /* -------------------- SORT -------------------- */
  const sortedLeaveTypes = [...filteredLeaveTypes].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    if ((a[key] || "").toLowerCase() < (b[key] || "").toLowerCase())
      return -1 * dir;

    if ((a[key] || "").toLowerCase() > (b[key] || "").toLowerCase())
      return 1 * dir;

    return 0;
  });

  /* -------------------- PAGINATION -------------------- */
  const totalPages =
    Math.ceil(sortedLeaveTypes.length / itemsPerPage) || 1;

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedLeaveTypes =
    sortedLeaveTypes.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  /* -------------------- SORT HANDLER -------------------- */
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

  /* -------------------- EXPORT EXCEL -------------------- */
  const handleExportExcel = () => {
    const exportData = sortedLeaveTypes.map(
      (item, index) => ({
        "Sr No": index + 1,
        "Leave Type Name":
          item.leave_type_name,
        Description: item.description,
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leave Types"
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
        type: "application/octet-stream",
      }
    );

    saveAs(
      fileData,
      "LeaveType_List.xlsx"
    );
  };

  return (
    <Box m="20px">
      <Header
        title="Leave Type"
        subtitle="Leave Management / Leave Type"
      />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* Search + Export + Limit */}
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
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 mb-2">

            <label className="mb-0 text-dark fw-semibold">
              Items Per Page:
            </label>

            <select
              className="form-select"
              style={{ width: "100px" }}
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
              className="btn btn-success"
              onClick={handleExportExcel}
            >
              Export Excel
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">

            <thead className="table-dark">
              <tr>
                <th>Sr No</th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleSort(
                      "leave_type_name"
                    )
                  }
                >
                  Leave Type Name{" "}
                  {getSortArrow(
                    "leave_type_name"
                  )}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleSort(
                      "description"
                    )
                  }
                >
                  Description{" "}
                  {getSortArrow(
                    "description"
                  )}
                </th>

                <th width="180">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {paginatedLeaveTypes.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center"
                  >
                    No Records Found
                  </td>
                </tr>
              ) : (
                paginatedLeaveTypes.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={item.id}
                    >
                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>

                      <td>
                        {
                          item.leave_type_name
                        }
                      </td>

                      <td>
                        {
                          item.description
                        }
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() =>
                            editLeaveType(
                              item
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteLeaveType(
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

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center mt-3">

          <span className="text-dark fw-semibold">
            Showing{" "}
            {
              paginatedLeaveTypes.length
            }{" "}
            of{" "}
            {
              sortedLeaveTypes.length
            }{" "}
            Leave Types
          </span>

          <div>

            <button
              className="btn btn-outline-secondary btn-sm me-1"
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
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
                    goToPage(
                      index + 1
                    )
                  }
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
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

export default LeaveTypeTable;