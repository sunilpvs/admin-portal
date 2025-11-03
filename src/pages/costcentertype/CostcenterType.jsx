import { useState, useEffect } from "react";
import CostCenterTypeForm from "./CostCenterTypeForm";
import CostCenterTypeTable from "./CostCenterTypeTable";
import { toast } from 'react-hot-toast';

import {
  addCostCenterType,
  editCostCenterType,
  deleteCostCenterType, getPaginatedCostCenterType,
} from "../../services/admin/costcenterTypeService";

const CostCenterType = () => {
  const [costCenterTypes, setCostCenterTypes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fetch all costcentertype once
  const fetchCostCentertypes = async () => {
    try {
      const res = await getPaginatedCostCenterType(1, 1000); // large number to fetch all
      setCostCenterTypes(res.data.costcentertypes || []);
    } catch (err) {
      console.error("Failed to fetch Costcenter Types", err);
      toast.error("Failed to load Costcenter Types");
    }
  };

  useEffect(() => {
    fetchCostCentertypes();
  }, []);


  const handleAdd = () => {
    setSelected({ cc_type: "" });
    setEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (item) => {
    setSelected(item);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCostCenterType(id);
      toast.success("CostCenter Type deleted successfully");
      fetchCostCentertypes();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete Costcenter Type");
    }
  };

  const handleSubmit = async (formData) => {
    let res;
    if (editMode) {
      res = await editCostCenterType(formData.id, formData);
    } else {
      res = await addCostCenterType(formData);
    }
    toast.success(res.data?.message || "Saved");
    fetchCostCentertypes();
    setOpenForm(false);
  };

  return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <button className="btn btn-primary float-end mt-4" onClick={handleAdd}>
              + Add Costcenter Type
            </button>

            <CostCenterTypeTable
                CostCenterTypes={costCenterTypes}
                deleteCcType={handleDelete}
                editCcType={handleEdit}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
            />

            {openForm && (
                <CostCenterTypeForm
                    data={selected}
                    add={handleSubmit}
                    close={() => setOpenForm(false)}
                    editMode={editMode}
                />
            )}
          </div>
        </div>
      </div>
  );
};

export default CostCenterType;
 