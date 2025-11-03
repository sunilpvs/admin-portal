import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { useState } from "react";

function CityTable({
  cities,
  deleteCity,
  editCity,
  currentPage,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  onSearch,
  searchTerm,
}) {
  const [sortConfig, setSortConfig] = useState({ key: "city", direction: "asc" }); // default sort

  // Filter cities based on search term
 const filteredCities = cities.filter((city) => 
  city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
  city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
  city.country.toLowerCase().includes(searchTerm.toLowerCase())

);

  // Sort the filtered cities
  const sortedCities = [...filteredCities].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (a[key].toLowerCase() < b[key].toLowerCase()) return -1 * dir;
    if (a[key].toLowerCase() > b[key].toLowerCase()) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sortedCities.length / itemsPerPage) || 1;



  // Paginate sorted cities
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCities = sortedCities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (onPageChange && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      // toggle direction
      setSortConfig({
        key: column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key: column, direction: "asc" }); // default to ascending
    }
  };

  // render sort arrow
  const getSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <Box m="20px">
      <Header title="City Management" subtitle="Admin/City" />

      <div className="container mt-4 p-3 bg-white rounded shadow-sm">
        {/* Search and Items Per Page */}
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
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("city")}>
                  City <span style={{ float: "right" }}>{getSortArrow("city")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("state")}>
                  State <span style={{ float: "right" }}>{getSortArrow("state")}</span>
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("country")}>
                  Country <span style={{ float: "right" }}>{getSortArrow("country")}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No cities found.
                  </td>
                </tr>
              ) : (
                paginatedCities.map((data, index) => (
                  <tr key={data.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{data.city}</td>
                    <td>{data.state}</td>
                    <td>{data.country}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editCity(data)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCity(data.id)}
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
            Showing {paginatedCities.length} of {sortedCities.length} matching cities
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

CityTable.propTypes = {
  cities: PropTypes.array.isRequired,
  deleteCity: PropTypes.func.isRequired,
  editCity: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default CityTable;
