import { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import LeaveCalendarForm from "./LeaveCalendarForm";
import LeaveCalendarTable from "./LeaveCalendarTable";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";
import {
  getPaginatedHolidays,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  importHolidaysFromFile,
} from "../../services/hr/holidayCalendarService";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

const LeaveCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const fetchHolidays = useCallback(async () => {
    try {
      const trimmedSearch = searchTerm.trim().toLowerCase();

      if (trimmedSearch) {
        const firstPageRes = await getPaginatedHolidays(1, limit);
        const totalRecords = firstPageRes?.total || 0;
        let allHolidays = firstPageRes?.data || [];

        if (totalRecords > allHolidays.length) {
          const allRes = await getPaginatedHolidays(1, totalRecords);
          allHolidays = allRes?.data || [];
        }

        const filtered = allHolidays.filter((holiday) => {
          const branchText = Array.isArray(holiday.branches)
            ? holiday.branches.join(", ")
            : holiday.branches || "";

          return (
            holiday.holiday_name?.toLowerCase().includes(trimmedSearch) ||
            holiday.description?.toLowerCase().includes(trimmedSearch) ||
            holiday.holiday_date?.toLowerCase().includes(trimmedSearch) ||
            branchText.toLowerCase().includes(trimmedSearch)
          );
        });

        const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * limit;

        if (safePage !== page) {
          setPage(safePage);
        }

        setHolidays(filtered.slice(start, start + limit));
        setTotal(filtered.length);
        return;
      }

      const res = await getPaginatedHolidays(page, limit);
      setHolidays(res?.data || []);
      setTotal(res?.total || 0);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      toast.error(getErrorMessage(error, "Failed to load holidays."));
    }
  }, [page, limit, searchTerm]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleDelete = async (holidayId) => {
    try {
      const res = await deleteHoliday(holidayId);
      toast.success(res?.message || "Holiday deleted successfully");
      fetchHolidays();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(getErrorMessage(error, "Failed to delete holiday."));
    }
  };

  const handleSubmit = async (formData) => {
    const payload = {
      holiday_name: formData.holiday_name,
      holiday_date: formData.holiday_date,
      branches: formData.branches,
      description: formData.description,
    };

    try {
      if (editMode) {
        const res = await updateHoliday(formData.holiday_id, payload);
        toast.success(res?.message || "Holiday updated successfully");
      } else {
        const res = await addHoliday(payload);
        toast.success(res?.message || "Holiday added successfully");
      }

      setOpenForm(false);
      setSelectedHoliday(null);
      setEditMode(false);
      setPage(1);
      fetchHolidays();
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error(getErrorMessage(error, "Failed to save holiday."));
    }
  };

  const handleEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedHoliday({
      holiday_name: "",
      holiday_date: "",
      branches: [],
      description: "",
    });
    setEditMode(false);
    setOpenForm(true);
  };

  const handleFileImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const res = await importHolidaysFromFile(file);
      toast.success(res?.message || "Import completed");

      if (res?.row_errors?.length) {
        toast.error(res.row_errors.join(", "));
      }

      setPage(1);
      fetchHolidays();
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(getErrorMessage(error, "Failed to import file."));
    } finally {
      event.target.value = "";
    }
  };

  const handleSearchChange = (value) => {
    if (value !== searchTerm) {
      setSearchTerm(value);
      setPage(1);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <Header
            title="Holiday Calendar"
            subtitle="Leave Management / Holiday Calendar"
          />
        </div>

        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary" onClick={handleAdd}>
            + Add Holiday
          </button>

          <label className="btn btn-success mb-0">
            Import CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileImport}
            />
          </label>
        </div>
      </div>

      <LeaveCalendarTable
        holidays={holidays}
        deleteHoliday={handleDelete}
        editHoliday={handleEdit}
        currentPage={page}
        itemsPerPage={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        onSearch={handleSearchChange}
        searchTerm={searchTerm}
      />

      {openForm && (
        <LeaveCalendarForm
          data={selectedHoliday}
          add={handleSubmit}
          close={() => {
            setOpenForm(false);
            setSelectedHoliday(null);
            setEditMode(false);
          }}
          editMode={editMode}
        />
      )}
    </div>
  );
};

export default LeaveCalendar;
