import React, { useState, useEffect } from "react";
import CostCenterTable from "./CostCenterTable";
import CostCenterForm from "./CostCenterForm";
import {
    getPaginatedCostCenters,
    addCostCenter,
    editCostCenter,
    deleteCostCenter,
} from "../../services/admin/costcenterService";
import { toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const CostCenter = () => {
    const [allCostCenters, setAllCostCenters] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [openForm, setOpenForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCostCenter, setSelectedCostCenter] = useState(null);

    // Fetch all cost centers
    const fetchCostCenters = async () => {
        try {
            const res = await getPaginatedCostCenters(1, 1000); // fetch all for client-side pagination
            setAllCostCenters(res.data.costCenters || []);
        } catch (err) {
            console.error("Failed to fetch cost centers", err);
            toast.error("Failed to load cost centers");
        }
    };

    useEffect(() => {
        fetchCostCenters();
    }, []);

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this cost center?")) return;
        try {
            await deleteCostCenter(id);
            toast.success("Cost Center deleted successfully");
            fetchCostCenters();
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete cost center");
        }
    };

    // Add/Edit handler
    const handleSubmit = async (formData) => {
        try {
            if (editMode) {
                await editCostCenter(formData.id, formData);
                toast.success("Cost Center updated successfully");
            } else {
                await addCostCenter(formData);
                toast.success("Cost Center added successfully");
            }
            setOpenForm(false);
            setSelectedCostCenter(null);
            setEditMode(false);
            fetchCostCenters();
            setPage(1);
        } catch (err) {
            console.error("Submit failed", err);
            toast.error("Failed to save cost center");
        }
    };

    // Edit button click
    const handleEdit = (cc) => {
        setSelectedCostCenter({
            id: cc.id,
            cc_code: cc.cc_code || "",
            cc_type_id: cc.cc_type_id || "",
            cc_type: cc.cc_type || "",
            entity_id: cc.entity_id || "",
            entity_name: cc.entity_name || "",
            incorp_date: cc.incorp_date,
            gst_no: cc.gst_no || "",
            add1: cc.add1 || "",
            add2: cc.add2 || "",
            city_id: cc.city_id || "",
            city: cc.city || "",
            state_id: cc.state_id || "",
            state: cc.state || "",
            country_id: cc.country_id || "",
            country: cc.country || "",
            pin: cc.pin || "",
            contact_id: cc.contact_id || "",
            // primary_contact: cc.contact_id || "",
            status_id: cc.status_id || "",
            status: cc.status || "",
        });
        setEditMode(true);
        setOpenForm(true);
    };

    // Add button click
    const handleAdd = () => {
        setSelectedCostCenter({
            costcenter: "",
            cc_code: "",
            cc_type: "",
            entity_id: "",
            incorp_date: "",
            gst_no: "",
            add1: "",
            city: "",
            state: "",
            pin: "",
            country: "",
            primary_contact: "",
            status: "",
        });
        setEditMode(false);
        setOpenForm(true);
    };

    // Pagination and filters
    const handlePageChange = (newPage) => setPage(newPage);
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };
    const handleSearchChange = (term) => {
        setSearchTerm(term);
        setPage(1);
    };

    const closeForm = () => {
        setOpenForm(false);
        setSelectedCostCenter(null);
        setEditMode(false);
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <button className="btn btn-primary float-end mt-4 " onClick={handleAdd}>
                        + Add Cost Center
                    </button>

                    <CostCenterTable
                        costCenters={allCostCenters}
                        deleteCostCenter={handleDelete}
                        editCostCenter={handleEdit}
                        currentPage={page}
                        itemsPerPage={limit}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                        onSearch={handleSearchChange}
                        searchTerm={searchTerm}
                    />

                    {openForm && (
                        <CostCenterForm
                            data={selectedCostCenter}
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

export default CostCenter;
