import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function LeavePolicyTable({
  leavePolicies,
  deleteLeavePolicy,
  editLeavePolicy,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  searchTerm,
  onSearch,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: "leave_type",
    direction: "asc",
  });

  /* ---------------- FILTER ---------------- */

  const filteredPolicies = leavePolicies.filter(
    (item) =>
      item.leave_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.year
        ?.toString()
        .includes(searchTerm) ||
      item.carry_forward
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /* ---------------- SORT ---------------- */

  const sortedPolicies = [...filteredPolicies].sort(
    (a, b) => {
      const key = sortConfig.key;
      const dir =
        sortConfig.direction === "asc"
          ? 1
          : -1;

      if ((a[key] || "") < (b[key] || ""))
        return -1 * dir;

      if ((a[key] || "") > (b[key] || ""))
        return 1 * dir;

      return 0;
    }
  );

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
      sortedPolicies.length /
        itemsPerPage
    ) || 1;

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedPolicies =
    sortedPolicies.slice(
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
    const exportData =
      sortedPolicies.map(
        (item, index) => ({
          "Sr No": index + 1,
          "Leave Type":
            item.leave_type,
          "Annual Quota":
            item.annual_quota,
          Year: item.year,
          "Carry Forward":
            item.carry_forward,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leave Policies"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/octet-stream",
      }
    );

    saveAs(
      fileData,
      "LeavePolicy_List.xlsx"
    );
  };

  return (
    <Box m="20px">
      <Header
        title="Leave Policy"
        subtitle="Leave Management / Leave Policy"
      />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">

        {/* SEARCH + LIMIT + EXPORT */}

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
                onSearch(
                  e.target.value
                )
              }
              className="form-control"
            />
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
              style={{
                width: "120px",
              }}
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
              onClick={
                handleExportExcel
              }
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
                    cursor:
                      "pointer",
                  }}
                  onClick={() =>
                    handleSort(
                      "leave_type"
                    )
                  }
                >
                  Leave Type{" "}
                  {getSortArrow(
                    "leave_type"
                  )}
                </th>

                <th>
                  Annual Quota
                </th>

                <th
                  style={{
                    cursor:
                      "pointer",
                  }}
                  onClick={() =>
                    handleSort(
                      "year"
                    )
                  }
                >
                  Year{" "}
                  {getSortArrow(
                    "year"
                  )}
                </th>

                <th>
                  Carry Forward
                </th>

                <th width="180">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {paginatedPolicies.length ===
              0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    No Records Found
                  </td>
                </tr>
              ) : (
                paginatedPolicies.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={
                        item.id
                      }
                    >
                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>

                      <td>
                        {
                          item.leave_type
                        }
                      </td>

                      <td>
                        {
                          item.annual_quota
                        }
                      </td>

                      <td>
                        {
                          item.year
                        }
                      </td>

                      <td>
                        {
                          item.carry_forward
                        }
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() =>
                            editLeavePolicy(
                              item
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteLeavePolicy(
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

          <span
            style={{
              color: "#000",
              fontWeight: "500",
            }}
          >
            Showing{" "}
            {
              paginatedPolicies.length
            }{" "}
            of{" "}
            {
              sortedPolicies.length
            }{" "}
            Leave Policies
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

export default LeavePolicyTable;