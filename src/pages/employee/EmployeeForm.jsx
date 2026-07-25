import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";
import { getCityCombo } from "../../services/admin/cityService";
import { getEntityCombo, getDomainsCombo } from "../../services/admin/entityService";
import { getDepartmentCombo } from "../../services/admin/departmentService";
import { getDesignationCombo } from "../../services/admin/designationService";
import {
  checkDuplicateEmail,
} from "../../services/hr/employeeService";

const normalizeCombo = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const normalizeDomains = (response) => {
  const domainList =
    response?.domain_names ||
    response?.data?.domain_names ||
    (Array.isArray(response) ? response : []);

  if (!Array.isArray(domainList)) return [];

  return domainList
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.domain_name || item?.domain || "";
    })
    .filter(Boolean);
};

const EmployeeForm = ({ data, add, close, userData }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    entityId: "",
    departmentId: "",
    designationId: "",
    firstName: "",
    lastName: "",
    displayName: "",
    dob: "",
    personalEmail: "",
    mobileNo: "",
    employeeType: "Regular",
    joiningDate: today,
    exitDate: "",
    add1: "",
    add2: "",
    countryId: "",
    stateId: "",
    cityId: "",
    pin: "",
    uan: "",
    aadharNo: "",
    panNo: "",
    esiNo: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    m365Required: false,
    officialEmail: "",
    domain: "",
    oldEmpCode: "",
  });

  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [entities, setEntities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [cities, setCities] = useState([]);
  const [domains, setDomains] = useState([]);

  const [emailCheckStatus, setEmailCheckStatus] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        entityId: data.entityId || "",
        departmentId: data.departmentId || "",
        designationId: data.designationId || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        displayName:
          data.displayName ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        dob: data.dob || "",
        personalEmail: data.personalEmail || "",
        mobileNo: data.mobileNo || "",
        employeeType: data.employeeType || "Regular",
        joiningDate: data.joiningDate || today,
        exitDate: data.exitDate || "",
        add1: data.add1 || "",
        add2: data.add2 || "",
        countryId: data.countryId || "",
        stateId: data.stateId || "",
        cityId: data.cityId || "",
        pin: data.pin || "",
        uan: data.uan || "",
        aadharNo: data.aadharNo || "",
        panNo: data.panNo || "",
        esiNo: data.esiNo || "",
        bankName: data.bankName || "",
        accountNo: data.accountNo || "",
        ifscCode: data.ifscCode || "",
        m365Required: data.m365Required || false,
        officialEmail: data.officialEmail || "",
        domain: data.domain || "",
        oldEmpCode: data.oldEmpCode || "",
      });
    }

    fetchDropdowns();
  }, [data]);

  const fetchDropdowns = async () => {
    try {
      const [
        entityResponse,
        departmentData,
        designationData,
        stateData,
        countryData,
        cityData,
        domainsData,
      ] = await Promise.all([
        getEntityCombo(["id", "entity_name"]),
        getDepartmentCombo(),
        getDesignationCombo(),
        getStateCombo(["id", "state"]),
        getCountryCombo(["id", "country"]),
        getCityCombo(["id", "city"]),
        getDomainsCombo(),
      ]);

      setEntities(normalizeCombo(entityResponse.data.entities));
      setDepartments(normalizeCombo(departmentData));
      setDesignations(normalizeCombo(designationData));
      setStates(normalizeCombo(stateData.data));
      setCountries(normalizeCombo(countryData.data));
      setCities(normalizeCombo(cityData.data));
      setDomains(normalizeDomains(domainsData.data));
    } catch (error) {
      console.error("Failed to load dropdowns:", error);
      toast.error("Failed to load dropdowns");
    }
  };

  const getFullOfficialEmail = (localPart, domain) => {
    const trimmedLocal = (localPart || "").trim();
    const trimmedDomain = (domain || "").trim();
    if (!trimmedLocal || !trimmedDomain) return "";
    return `${trimmedLocal}@${trimmedDomain}`.toLowerCase();
  };

  const handleOfficialEmailCheck = async (localPart, domain) => {
    const fullEmail = getFullOfficialEmail(localPart, domain);

    if (!fullEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) {
      setEmailCheckStatus(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const result = await checkDuplicateEmail(fullEmail);
      setEmailCheckStatus(result.exists ? "exists" : "available");
    } catch (error) {
      console.error("Failed to check email:", error);
      setEmailCheckStatus(null);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "firstName" || name === "lastName") {
        const firstName = name === "firstName" ? value : prev.firstName || "";
        const lastName = name === "lastName" ? value : prev.lastName || "";
        updated.displayName = `${firstName} ${lastName}`.trim();
      }

      if (name === "m365Required" && !checked) {
        updated.officialEmail = "";
        updated.domain = "";
        setEmailCheckStatus(null);
      }

      return updated;
    });

    if (name === "domain") {
      handleOfficialEmailCheck(formData.officialEmail, value);
    }
  };

  const handleOfficialEmailKeyUp = (e) => {
    const localPart = e.target.value;
    handleOfficialEmailCheck(localPart, formData.domain);
  };

  const isSubmitDisabled =
    formData.m365Required &&
    (emailCheckStatus === "exists" || isCheckingEmail);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.employeeType === "Contract" && !formData.exitDate) {
      toast.error("Exit Date is required for Contract employees");
      return;
    }

    if (
      formData.employeeType === "Contract" &&
      formData.exitDate <= formData.joiningDate
    ) {
      toast.error("Exit Date must be greater than Joining Date");
      return;
    }

    if (
      formData.personalEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)
    ) {
      toast.error("Please enter a valid personal email address");
      return;
    }

    if (formData.m365Required && !formData.domain) {
      toast.error("Please select a domain for the Official Email");
      return;
    }

    if (formData.m365Required && emailCheckStatus === "exists") {
      toast.error("Official email already exists");
      return;
    }

    if (formData.uan && !/^\d{1,14}$/.test(formData.uan)) {
      toast.error("UAN must contain only numbers and maximum 14 digits");
      return;
    }

    if (formData.esiNo && !/^\d{1,15}$/.test(formData.esiNo)) {
      toast.error("ESI No. must contain only numbers and maximum 15 digits");
      return;
    }

    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      toast.error("Mobile Number must contain exactly 10 digits");
      return;
    }

    if (formData.aadharNo && !/^\d{12}$/.test(formData.aadharNo)) {
      toast.error("Aadhar Number must contain exactly 12 digits");
      return;
    }

    const officialEmail = formData.m365Required
      ? getFullOfficialEmail(formData.officialEmail, formData.domain)
      : formData.personalEmail;

    const payload = {
      f_name: formData.firstName.trim(),
      l_name: formData.lastName.trim(),
      dob: formData.dob,
      mobile: formData.mobileNo,
      email: officialEmail,
      city: parseInt(formData.cityId, 10),
      state: parseInt(formData.stateId, 10),
      pin: formData.pin,
      country: parseInt(formData.countryId, 10),
      add1: formData.add1,
      add2: formData.add2,
      personal_email: formData.personalEmail,
      join_date: formData.joiningDate,
      exit_date: formData.employeeType === "Contract" ? formData.exitDate : null,
      emp_type: formData.employeeType,
      emp_status: 1,
      entity_id: parseInt(formData.entityId, 10),
      department_id: parseInt(formData.departmentId, 10),
      designation_id: parseInt(formData.designationId, 10),
      image: null,
      uan: formData.uan,
      aadhar: formData.aadharNo,
      pan_no: formData.panNo,
      esi_no: formData.esiNo,
      bank_name: formData.bankName,
      bank_account_no: formData.accountNo,
      ifsc_code: formData.ifscCode,
      m365: formData.m365Required ? "yes" : "no",
      old_emp_code: formData.oldEmpCode,
      created_by: userData?.id || userData?.user_id || 1,
      module: "Human Resource Management",
      username: userData?.user_name || userData?.username || "admin",
    };

    add(payload);
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        position: "fixed",
        top: 0,
        left: "150px",
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog modal-xl"
        style={{
          width: "calc(100% - 40px)",
          margin: "30px auto",
        }}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create Employee</h5>
              <button type="button" className="btn-close" onClick={close} />
            </div>

            <div
              className="modal-body"
              style={{
                maxHeight: "calc(100vh - 180px)",
                overflowY: "auto",
                padding: "24px",
              }}
            >
              <h5 className="border-bottom pb-2 mb-3">Contact Details</h5>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Entity</label>
                  <select
                    name="entityId"
                    value={formData.entityId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Entity</option>
                    {entities.map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.entity_name || entity.entity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Department</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name || department.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Designation</label>
                  <select
                    name="designationId"
                    value={formData.designationId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.name || designation.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Personal Email</label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Mobile No.</label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={formData.mobileNo || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                      setFormData((prev) => ({
                        ...prev,
                        mobileNo: value,
                      }));
                    }}
                    className="form-control"
                    maxLength={12}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Employee Type</label>
                  <select
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Regular">Regular</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Exit Date
                    {formData.employeeType === "Contract" && (
                      <span className="text-danger"> *</span>
                    )}
                  </label>
                  <input
                    type="date"
                    name="exitDate"
                    value={formData.exitDate}
                    onChange={handleChange}
                    className="form-control"
                    min={formData.joiningDate}
                    required={formData.employeeType === "Contract"}
                    disabled={formData.employeeType !== "Contract"}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Old Employee Code</label>
                  <input
                    type="text"
                    name="oldEmpCode"
                    value={formData.oldEmpCode}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3 d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="m365Required"
                      name="m365Required"
                      checked={formData.m365Required || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="m365Required">
                      M365 ID Required?
                    </label>
                  </div>
                </div>

                {formData.m365Required && (
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Official Email</label>
                    <div className="input-group">
                      <input
                        type="text"
                        name="officialEmail"
                        value={formData.officialEmail || ""}
                        onChange={handleChange}
                        onKeyUp={handleOfficialEmailKeyUp}
                        className={`form-control ${
                          emailCheckStatus === "exists"
                            ? "is-invalid"
                            : emailCheckStatus === "available"
                              ? "is-valid"
                              : ""
                        }`}
                        placeholder="firstname.lastname"
                        required={formData.m365Required}
                      />
                      <span className="input-group-text">@</span>
                      <select
                        name="domain"
                        value={formData.domain || ""}
                        onChange={handleChange}
                        className="form-select"
                        style={{ maxWidth: "180px" }}
                        required={formData.m365Required}
                      >
                        <option value="">Domains</option>
                        {domains.map((domain, index) => (
                          <option key={domain || index} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </select>
                    </div>
                    {isCheckingEmail && (
                      <small className="text-muted">Checking email availability...</small>
                    )}
                    {!isCheckingEmail && emailCheckStatus === "available" && (
                      <small className="text-success">Email is available</small>
                    )}
                    {!isCheckingEmail && emailCheckStatus === "exists" && (
                      <small className="text-danger">
                        Email already exists
                      </small>
                    )}
                  </div>
                )}
              </div>

              <h5 className="border-bottom pb-2 mb-3 mt-4">
                Communication Address Details
              </h5>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Address 1</label>
                  <input
                    type="text"
                    name="add1"
                    value={formData.add1}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Address 2</label>
                  <input
                    type="text"
                    name="add2"
                    value={formData.add2}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Country</label>
                  <select
                    name="countryId"
                    value={formData.countryId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">State</label>
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">City</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">PIN</label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <h5 className="border-bottom pb-2 mb-3 mt-4">
                Identity & Financial Details
              </h5>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Aadhar No.</label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData.aadharNo || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setFormData((prev) => ({
                        ...prev,
                        aadharNo: value,
                      }));
                    }}
                    className="form-control"
                    maxLength={16}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">UAN</label>
                  <input
                    type="text"
                    name="uan"
                    value={formData.uan || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 14);
                      setFormData((prev) => ({
                        ...prev,
                        uan: value,
                      }));
                    }}
                    className="form-control"
                    placeholder="Enter UAN"
                    maxLength={14}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">PAN No</label>
                  <input
                    type="text"
                    name="panNo"
                    value={formData.panNo}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">ESI No.</label>
                  <input
                    type="text"
                    name="esiNo"
                    value={formData.esiNo || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 15);
                      setFormData((prev) => ({
                        ...prev,
                        esiNo: value,
                      }));
                    }}
                    className="form-control"
                    placeholder="Enter ESI Number"
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              <h5 className="border-bottom pb-2 mb-3 mt-4">Bank Account Details</h5>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Account No</label>
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitDisabled}
              >
                Save
              </button>

              <button type="button" className="btn btn-secondary" onClick={close}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EmployeeForm.propTypes = {
  data: PropTypes.object,
  add: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  userData: PropTypes.object,
};

export default EmployeeForm;
