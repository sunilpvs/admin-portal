import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

import OfficeLocationForm from "./OfficeLocationForm";
import OfficeLocationTable from "./OfficeLocationTable";

import {
  addOfficeLocation,
  editOfficeLocation,
  getOfficeLocationById,
  getPaginatedOfficeLocations,
} from "../../services/admin/officeLocationService";

const OfficeLocation = () => {
  const [officeLocations, setOfficeLocations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOfficeLocation, setSelectedOfficeLocation] = useState(null);

  const fetchOfficeLocations = async (pageOverride, limitOverride) => {
    const activePage = pageOverride ?? page;
    const activeLimit = limitOverride ?? limit;

    setLoading(true);
    try {
      const response = await getPaginatedOfficeLocations(
        activePage,
        activeLimit
      );

      const data = response?.data ?? {};
      setOfficeLocations(data.office_locations || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch office locations:", error);
      toast.error("Failed to load office locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeLocations();
  }, [page, limit]);

  const handleAdd = () => {
    setSelectedOfficeLocation({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      office: "",
      status: 1,
    });
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = async (officeLocation) => {
    try {
      const response = await getOfficeLocationById(officeLocation.id);
      const record = response?.data ?? officeLocation;

      setSelectedOfficeLocation(record);
      setEditMode(true);
      setOpenForm(true);
    } catch (error) {
      console.error("Failed to load office location details:", error);
      toast.error("Failed to load office location details");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        office: formData.office,
        status: Number(formData.status),
      };

      if (editMode) {
        await editOfficeLocation(formData.id, payload);
        toast.success("Office location updated successfully");
      } else {
        await addOfficeLocation(payload);
        toast.success("Office location added successfully");
      }

      setOpenForm(false);
      setSelectedOfficeLocation(null);
      setEditMode(false);
      setPage(1);
      await fetchOfficeLocations(1, limit);
    } catch (error) {
      console.error("Submit failed:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to save office location";
      toast.error(message);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedOfficeLocation(null);
    setEditMode(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
            + Add Office Location
          </button>

          <OfficeLocationTable
            officeLocations={officeLocations}
            total={total}
            currentPage={page}
            itemsPerPage={limit}
            loading={loading}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onEdit={handleEdit}
          />

          {openForm && (
            <OfficeLocationForm
              data={selectedOfficeLocation}
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

export default OfficeLocation;