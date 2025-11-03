import { useEffect, useState } from "react";
import CityForm from "./CityForm";
import Table from "./CityTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import {
  getPaginatedCities, // fetch all cities
  addCity,
  editCity,
  deleteCity,
} from "../../services/admin/cityService";

const City = () => {
  const [allCities, setAllCities] = useState([]); // store all cities
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch all cities once
  const fetchCities = async () => {
    try {
      const res = await getPaginatedCities(1, 1000); // large number to fetch all
      setAllCities(res.data.cities || []);
    } catch (err) {
      console.error("Failed to fetch cities", err);
      toast.error("Failed to load cities");
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCity(id);
      toast.success("City deleted successfully");
      fetchCities();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete city");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editMode) {
        await editCity(formData.id, formData);
        toast.success("City updated successfully");
      } else {
        await addCity(formData);
        toast.success("City added successfully");
      }
      setOpenForm(false);
      setSelectedCity(null);
      setEditMode(false);
      fetchCities();
      setPage(1);
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to save city");
    }
  };

  const handleEdit = (city) => {
    setSelectedCity(city);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedCity({ city: "", state: "", country: "" });
    setEditMode(false);
    setOpenForm(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setPage(1); // reset to first page on search
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedCity(null);
    setEditMode(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
            + Add City
          </button>

          <Table
            cities={allCities}
            deleteCity={handleDelete}
            editCity={handleEdit}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {openForm && (
            <CityForm
              data={selectedCity}
              add={handleSubmit}
              close={closeForm}
              editMode={editMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default City;
