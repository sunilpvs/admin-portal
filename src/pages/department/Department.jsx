import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import DepartmentForm from "./DepartmentForm";
import DepartmentImportModal from "./DepartmentImportModal";
import Table from "./DepartmentTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";

import {
  getPaginatedDepartments,
  addDepartment,
  editDepartment,
  deleteDepartment,
  getExcelTemplate,
} from "../../services/admin/departmentService";

const getTemplateFilename = (response) => {
  const contentDisposition = response?.headers?.["content-disposition"];
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match?.[1]) return match[1];
  }
  return "Department_Template.xlsx";
};

const Department = () => {
  const [departments, setAllDepartments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await getPaginatedDepartments(1, 1000);
      setAllDepartments(res.data.departments || []);
    } catch (err) {
      console.error("Failed to fetch departments", err);
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete department");
    }
  };

  const handleSubmit = async (formData) => {
    const payload = {
      unit: formData.unit,
      department: formData.department,
      code: formData.code,
      status: formData.status,
    };

    try {
      if (editMode) {
        await editDepartment(formData.id, payload);
        toast.success("Department updated successfully");
      } else {
        await addDepartment(payload);
        toast.success("Department added successfully");
      }
      setOpenForm(false);
      setSelectedDepartment(null);
      setEditMode(false);
      fetchDepartments();
      setPage(1);
    } catch (err) {
      console.error("Submit failed", err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to save department";
      toast.error(message);
    }
  };

  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedDepartment({ unit: "", department: "", code: "", status: "" });
    setEditMode(false);
    setOpenForm(true);
  };

  const handleDownloadTemplate = async () => {
    if (isDownloadingTemplate) return;

    setIsDownloadingTemplate(true);
    const toastId = toast.loading("Downloading template...");

    try {
      const response = await getExcelTemplate();
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, getTemplateFilename(response));
      toast.success("Template downloaded successfully", { id: toastId });
    } catch (err) {
      console.error("Template download failed", err);
      toast.error("Failed to download template", { id: toastId });
    } finally {
      setIsDownloadingTemplate(false);
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
    setSelectedDepartment(null);
    setEditMode(false);
  };

  const handleSearchChange = (newSearch) => {
    if (newSearch !== searchTerm) {
      setSearchTerm(newSearch);
      setPage(1);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="d-flex justify-content-end gap-2 mt-4 flex-wrap">
            <button
              className="btn btn-outline-secondary"
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate}
            >
              {isDownloadingTemplate ? "Downloading..." : "Download Template"}
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => setOpenImportModal(true)}
            >
              Import Excel
            </button>
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add Department
            </button>
          </div>

          <Table
            departments={departments}
            deleteDepartment={handleDelete}
            editDepartment={handleEdit}
            currentPage={page}
            total={total}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
          />

          {openForm && (
            <DepartmentForm
              data={selectedDepartment}
              add={handleSubmit}
              close={closeForm}
              editMode={editMode}
            />
          )}

          {openImportModal && (
            <DepartmentImportModal
              close={() => setOpenImportModal(false)}
              onImportComplete={fetchDepartments}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Department;
