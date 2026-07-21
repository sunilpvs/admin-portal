import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getCountryCombo } from "../../services/admin/countryService";
import { getStateCombo } from "../../services/admin/stateService";

// Add your actual services here
// import { getEntityCombo } from "../../services/admin/entityService";
// import { getDepartmentCombo } from "../../services/admin/departmentService");
// import { getDesignationCombo } from "../../services/admin/designationService");
// import { getCityCombo } from "../../services/admin/cityService";

const EmployeeForm = ({
  data,
  add,
  close,
  editMode,
}) => {

  const today = new Date()
    .toISOString()
    .split("T")[0];

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
    expiryDate: "",

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
  });

  const [states, setStates] = useState([]);
  const [countries, setCountries] =
    useState([]);

  const [entities, setEntities] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [designations, setDesignations] =
    useState([]);

  const [cities, setCities] =
    useState([]);

  /* -------------------- INITIALIZE -------------------- */

  

  

  useEffect(() => {

    if (data) {

      setFormData({
        entityId: data.entityId || "",
        departmentId:
          data.departmentId || "",
        designationId:
          data.designationId || "",

        firstName:
          data.firstName || "",
        lastName:
          data.lastName || "",

        displayName:
          data.displayName ||
          `${data.firstName || ""} ${
            data.lastName || ""
          }`.trim(),

        dob: data.dob || "",
        personalEmail:
          data.personalEmail || "",
        mobileNo:
          data.mobileNo || "",

        employeeType:
          data.employeeType || "Regular",

        joiningDate:
          data.joiningDate || today,

        expiryDate:
          data.expiryDate || "",

        add1: data.add1 || "",
        add2: data.add2 || "",

        countryId:
          data.countryId || "",

        stateId:
          data.stateId || "",

        cityId:
          data.cityId || "",

        pin: data.pin || "",

        uan: data.uan || "",
        aadharNo:
          data.aadharNo || "",
        panNo:
          data.panNo || "",
        esiNo:
          data.esiNo || "",

        bankName:
          data.bankName || "",
        accountNo:
          data.accountNo || "",
        ifscCode:
          data.ifscCode || "",
      });

    }

    fetchDropdowns();

  }, [data]);

  /* -------------------- DROPDOWNS -------------------- */

  const fetchDropdowns = async () => {

    try {

      const stateData =
        await getStateCombo([
          "id",
          "state",
        ]);

      const countryData =
        await getCountryCombo([
          "id",
          "country",
        ]);

      setStates(
        stateData.data || []
      );

      setCountries(
        countryData.data || []
      );

      /*
      Example:

      const entityData =
        await getEntityCombo(["id", "entity"]);

      const departmentData =
        await getDepartmentCombo([
          "id",
          "department"
        ]);

      const designationData =
        await getDesignationCombo([
          "id",
          "designation"
        ]);

      const cityData =
        await getCityCombo([
          "id",
          "city"
        ]);

      setEntities(entityData.data || []);
      setDepartments(
        departmentData.data || []
      );
      setDesignations(
        designationData.data || []
      );
      setCities(cityData.data || []);
      */

    } catch (error) {

      console.error(
        "Failed to load dropdowns:",
        error
      );

      toast.error(
        "Failed to load dropdowns"
      );
    }
  };

  

  /* -------------------- HANDLE CHANGE -------------------- */

  const handleChange = (e) => {
  const {
    name,
    value,
    type,
    checked,
  } = e.target;

  setFormData((prev) => {
    const updated = {
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    };

    // Automatically generate Display Name
    if (
      name === "firstName" ||
      name === "lastName"
    ) {
      const firstName =
        name === "firstName"
          ? value
          : prev.firstName || "";

      const lastName =
        name === "lastName"
          ? value
          : prev.lastName || "";

      // Display Name
      updated.displayName =
        `${firstName} ${lastName}`.trim();
    }

    return updated;
  });
};

  /* -------------------- SUBMIT -------------------- */
const handleSubmit = (e) => {
  e.preventDefault();

  /* -------------------- CONTRACT VALIDATION -------------------- */

  if (
    formData.employeeType === "Contract" &&
    !formData.expiryDate
  ) {
    toast.error(
      "Expiry Date is required for Contract employees"
    );
    return;
  }

  /* -------------------- EXPIRY DATE VALIDATION -------------------- */

  if (
    formData.employeeType === "Contract" &&
    formData.expiryDate <= formData.joiningDate
  ) {
    toast.error(
      "Expiry Date must be greater than Joining Date"
    );
    return;
  }

  /* -------------------- PERSONAL EMAIL VALIDATION -------------------- */

  if (
    formData.personalEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.personalEmail
    )
  ) {
    toast.error(
      "Please enter a valid email address"
    );
    return;
  }

  /* -------------------- M365 VALIDATION -------------------- */

  if (
    formData.m365Required &&
    !formData.domain
  ) {
    toast.error(
      "Please select a domain for the Official Email"
    );
    return;
  }

  /* -------------------- DISPLAY NAME -------------------- */

  const displayName =
    `${formData.firstName || ""} ${formData.lastName || ""}`
      .trim();

  /* -------------------- OFFICIAL EMAIL -------------------- */

  let officialEmail = "";

  if (
    formData.m365Required &&
    formData.firstName &&
    formData.lastName &&
    formData.domain
  ) {
    officialEmail =
      `${formData.firstName}.${formData.lastName}@${formData.domain}`
        .toLowerCase();
  }


  /* -------------------- UAN VALIDATION -------------------- */

if (
  formData.uan &&
  !/^\d{1,14}$/.test(formData.uan)
) {
  toast.error(
    "UAN must contain only numbers and maximum 14 digits"
  );
  return;
}


/* -------------------- ESI VALIDATION -------------------- */

if (
  formData.esiNo &&
  !/^\d{1,15}$/.test(formData.esiNo)
) {
  toast.error(
    "ESI No. must contain only numbers and maximum 15 digits"
  );
  return;
}



if (
  formData.mobileNo &&
  !/^\d{12}$/.test(formData.mobileNo)
) {
  toast.error(
    "Mobile Number must contain exactly 12 digits"
  );
  return;
}


if (
  formData.aadharNo &&
  !/^\d{16}$/.test(formData.aadharNo)
) {
  toast.error(
    "Aadhar Number must contain exactly 16 digits"
  );
  return;
}

  /* -------------------- FINAL PAYLOAD -------------------- */

  const payload = {
    ...formData,

    // Auto generated Display Name
    displayName: displayName,

    // Auto generated Official Email
    officialEmail: officialEmail,
  };

  /* -------------------- EDIT ID -------------------- */

  if (data?.id) {
    payload.id = data.id;
  }

  /* -------------------- SUBMIT -------------------- */

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
        //maxWidth: "1250px",
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

          {/* ================= HEADER ================= */}

          <div className="modal-header">
            <h5 className="modal-title">
              {editMode
                ? "Edit Employee"
                : "Create Employee"}
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={close}
            />
          </div>

          {/* ================= SCROLLABLE BODY ================= */}

          <div
            className="modal-body"
            style={{
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              padding: "24px",
            }}
          >

            {/* ================================================= */}
            {/* CONTACT DETAILS */}
            {/* ================================================= */}

            <h5 className="border-bottom pb-2 mb-3">
              Contact Details
            </h5>

            <div className="row">

              {/* Entity */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Entity
                </label>

                <select
                  name="entityId"
                  value={formData.entityId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select Entity
                  </option>

                  {entities.map((entity) => (
                    <option
                      key={entity.id}
                      value={entity.id}
                    >
                      {entity.entity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Department
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={department.id}
                        value={department.id}
                      >
                        {department.department}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Designation */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Designation
                </label>

                <select
                  name="designationId"
                  value={formData.designationId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select Designation
                  </option>

                  {designations.map(
                    (designation) => (
                      <option
                        key={designation.id}
                        value={designation.id}
                      >
                        {designation.designation}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* First Name */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Last Name */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Display Name */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Display Name
                </label>

                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  className="form-control"
                  readOnly
                />
              </div>

              {/* Date of Birth */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Personal Email */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Personal Email
                </label>

                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Mobile */}

             <div className="col-md-4 mb-3">
  <label className="form-label">
    Mobile No.
  </label>

  <input
    type="text"
    name="mobileNo"
    value={formData.mobileNo || ""}
    onChange={(e) => {
      const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 12);

      setFormData((prev) => ({
        ...prev,
        mobileNo: value,
      }));
    }}
    className="form-control"
  
    maxLength={12}
  />
</div>

              {/* Employee Type */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Employee Type
                </label>

                <select
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Regular">
                    Regular
                  </option>

                  <option value="Contract">
                    Contract
                  </option>
                </select>
              </div>

              {/* Joining Date */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Expiry Date */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Expiry Date

                  {formData.employeeType ===
                    "Contract" && (
                    <span className="text-danger">
                      {" "}*
                    </span>
                  )}
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="form-control"
                  min={formData.joiningDate}
                  required={
                    formData.employeeType ===
                    "Contract"
                  }
                  disabled={
                    formData.employeeType !==
                    "Contract"
                  }
                />
              </div>

              {/* M365 ID Required */}

<div className="col-md-4 mb-3 d-flex align-items-end">
  <div className="form-check mb-2">
    <input
      type="checkbox"
      className="form-check-input"
      id="m365Required"
      name="m365Required"
      checked={formData.m365Required || false}
      onChange={(e) => {
        const checked = e.target.checked;

        setFormData((prev) => ({
          ...prev,
          m365Required: checked,
          officialEmail: checked
            ? `${prev.firstName || ""}.${prev.lastName || ""}`.toLowerCase()
            : "",
          domain: checked
            ? prev.domain
            : "",
        }));
      }}
    />

    <label
      className="form-check-label"
      htmlFor="m365Required"
    >
      M365 ID Required?
    </label>
  </div>
</div>
{formData.m365Required && (
  <>
    {/* Official Email */}

    <div className="col-md-4 mb-3">
      <label className="form-label">
        Official Email
      </label>

      <div className="input-group">

        <input
          type="text"
          name="officialEmail"
          value={formData.officialEmail || ""}
          onChange={handleChange}
          className="form-control"
          placeholder="firstname.lastname"
          required={formData.m365Required}
        />

        <span className="input-group-text">
          @
        </span>

        <select
          name="domain"
          value={formData.domain || ""}
          onChange={handleChange}
          className="form-select"
          style={{
            maxWidth: "180px",
          }}
          required={formData.m365Required}
        >
          <option value="">
            Domains
          </option>

          <option value="company.com">
            company.com
          </option>

          <option value="company.in">
            company.in
          </option>

          <option value="company.org">
            company.org
          </option>
        </select>

      </div>
    </div>
  
  </>
)}


            </div>


            {/* ================================================= */}
            {/* COMMUNICATION ADDRESS */}
            {/* ================================================= */}

            <h5 className="border-bottom pb-2 mb-3 mt-4">
              Communication Address Details
            </h5>

            <div className="row">

              {/* Address 1 */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Address 1
                </label>

                <input
                  type="text"
                  name="add1"
                  value={formData.add1}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Address 2 */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Address 2
                </label>

                <input
                  type="text"
                  name="add2"
                  value={formData.add2}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Country */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Country
                </label>

                <select
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select Country
                  </option>

                  {countries.map((country) => (
                    <option
                      key={country.id}
                      value={country.id}
                    >
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  State
                </label>

                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select State
                  </option>

                  {states.map((state) => (
                    <option
                      key={state.id}
                      value={state.id}
                    >
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  City
                </label>

                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">
                    Select City
                  </option>

                  {cities.map((city) => (
                    <option
                      key={city.id}
                      value={city.id}
                    >
                      {city.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* PIN */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  PIN
                </label>

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


            {/* ================================================= */}
            {/* IDENTITY & FINANCIAL DETAILS */}
            {/* ================================================= */}

            <h5 className="border-bottom pb-2 mb-3 mt-4">
              Identity & Financial Details
            </h5>

            <div className="row">

                 {/* Aadhar */}

              <div className="col-md-4 mb-3">
  <label className="form-label">
    Aadhar No.
  </label>

  <input
    type="text"
    name="aadharNo"
    value={formData.aadharNo || ""}
    onChange={(e) => {
      const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 16);

      setFormData((prev) => ({
        ...prev,
        aadharNo: value,
      }));
    }}
    className="form-control"
    
    maxLength={16}
  />
</div>

              {/* UAN */}

              <div className="col-md-4 mb-3">
  <label className="form-label">
    UAN
  </label>

  <input
    type="text"
    name="uan"
    value={formData.uan || ""}
    onChange={(e) => {
      const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 14);

      setFormData((prev) => ({
        ...prev,
        uan: value,
      }));
    }}
    className="form-control"
    placeholder="Enter UAN"
    maxLength={14}
  />
</div>

             

              {/* PAN */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  PAN No
                </label>

                <input
                  type="text"
                  name="panNo"
                  value={formData.panNo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* ESI */}

             <div className="col-md-4 mb-3">
  <label className="form-label">
    ESI No.
  </label>

  <input
    type="text"
    name="esiNo"
    value={formData.esiNo || ""}
    onChange={(e) => {
      const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 15);

      setFormData((prev) => ({
        ...prev,
        esiNo: value,
      }));
    }}
    className="form-control"
    placeholder="Enter ESI Number"
    maxLength={15}
  />
</div>

             

            </div>


             <h5 className="border-bottom pb-2 mb-3 mt-4">
              Bank Account Details
            </h5>

            <div className="row">


              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Bank Name
                </label>

                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Account */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Account No
                </label>

                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* IFSC */}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  IFSC Code
                </label>

                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

            </div>

          </div>


          


          {/* ================= FOOTER ================= */}

          <div className="modal-footer">

            <button
              type="submit"
              className="btn btn-success"
            >
              {editMode
                ? "Update"
                : "Save"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={close}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  </div>
);
};

export default EmployeeForm;