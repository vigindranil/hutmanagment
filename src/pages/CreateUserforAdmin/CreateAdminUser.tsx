import React, { useState, useEffect } from "react";
import { commonApi } from "../../Service/surveyAPI";


const userTypeOptions = [
  { label: "Admin", value: 100 },
  { label: "Shop Owner", value: 1 },
  { label: "Checker", value: 50 },
  { label: "Hearing Officer", value: 60 },
  { label: "Approval Officer", value: 70 },
  { label: "Haat Manager", value: 10 },
  { label: "Maker User", value: 80 },
];

const initialFormState = {
  user_id: 0,
  user_type_id: "",
  district_id: 0,
  ps_id: 0,
  haat_id: 0,
  full_name: "",
  contact_number: "",
  email_address: "",
  username: "",
  user_password: "",
  designation: "",
};

const CreateAdminUser = () => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [psOptions, setPsOptions] = useState([]);
  const [haatOptions, setHaatOptions] = useState([]);
  const [userTypeID, setUserTypeID] = useState(0);


  // Use the correct API for user creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // Prepare payload: ensure correct types for IDs
      const payload = {
        ...form,
        user_type_id: Number(form.user_type_id),
        district_id: Number(form.district_id),
        ps_id: Number(form.ps_id),
        haat_id: Number(form.haat_id),
      };
      // Use the working API endpoint for user creation
      const res = await commonApi("user/saveHaatAdminUserDetails", payload, "POST");
      const data = await res.json();
      if (res.ok) {
        setSuccess("User created successfully!");
        setForm(initialFormState);
      } else {
        setError(data?.message);
      }
      } catch (err: any) {
      setError("Failed to create user.");
      } finally {
      setLoading(false);
    }
  };

  const getDistrictList = async () => {
    const result = await commonApi("user/getAllDistrictList", {}, "GET");
    const distList = result.data.map((dist: any) => ({
      value: dist.district_id,
      label: dist.district_name,
    }));
    setDistrictOptions(distList || []);
  };

  // FIX: Use correct keys for PS list (should be thana_id and thana_name)
  const getThanaListByDistrictID = async (district_id: any) => {
    const result = await commonApi(
      `user/getThanaListByDistrictID?DistrictID=${district_id}`,
      { DistrictID: district_id },
      "POST"
    );
    // The API returns thana_id and thana_name, not district_id/district_name
    if (result?.data?.length > 0) {
      const psList = result.data.map((ps: any) => ({
        value: ps.thana_id,
        label: ps.thana_name,
      }));
      setPsOptions(psList);
    } else {
      setPsOptions([]);
    }
  };

  // FIX: Use correct keys for PS list (should be thana_id and thana_name)
  const getHaatListByThanaID = async (ps_id: any) => {
    const result = await commonApi(
      `user/getHaatListByThanaID?ThanaID=${ps_id}`,
      {},
      "POST"
    );
    // The API returns thana_id and thana_name, not district_id/district_name
    if (result?.data?.length) {
      const haatList = result.data.map((ps: any) => ({
        value: ps.haat_id,
        label: ps.haat_name,
      }));
      setHaatOptions(haatList);
    } else {
      setHaatOptions([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "district_id") {
      getThanaListByDistrictID(value);
      // Reset PS when district changes
      setForm((prev) => ({
        ...prev,
        ps_id: 0,
        haat_id: 0,
      }));
    } else if (name === "ps_id") {
      getHaatListByThanaID(value);
      setForm((prev) => ({
        ...prev,
        haat_id: 0,
      }));
    } else if (name === "user_type_id") {
      setUserTypeID(parseInt(value));
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getDistrictList();
  }, []);

  // Remove duplicate FormField definition and add types
  type FormFieldProps = {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    children?: React.ReactNode;
    icon?: React.ElementType;
  };

  const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type = "text",
    required = false,
    children,
    icon: Icon,
  }) => (
    <div className="form-field">
      <label className="form-label">
        {Icon && <Icon className="label-icon" />}
        {label}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          value={form[name as keyof typeof form]}
          onChange={handleChange}
          required={required}
          className="form-input"
        />
      )}
    </div>
  );

  type SelectFieldProps = {
    label: string;
    name: string;
    options: { value: number | string; label: string }[];
    required?: boolean;
    icon?: React.ElementType;
  };

  const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    options,
    required = false,
    icon: Icon,
  }) => (
    <FormField label={label} name={name} required={required} icon={Icon}>
      <select
        name={name}
        value={form[name as keyof typeof form] as string | number}
        onChange={handleChange}
        required={required}
        className="form-select"
      >
        <option
          key="default"
          value={name.includes("_id") && name !== "user_type_id" ? 0 : ""}
        >
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-0 px-0">

      <div className="landscape-table-container">
        <div className="form-table-card">
          <div className="form-table-inner">
            <div className="form-header">
              <h2 className="form-title">Create New User</h2>
              <p className="form-subtitle">
                Add a new user to the administrative system
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="table-wrapper">
                <div className="responsive-form-table">
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        User Type <span className="text-red-600">*</span>
                      </label>
                      <SelectField name="user_type_id" options={userTypeOptions} required label="User Type" />
                    </div>
                    <div className="form-group">
                      <label>
                        District <span className="text-red-600">*</span>
                      </label>
                      <SelectField name="district_id" options={districtOptions} required label="District" />
                    </div>
                  </div>
                  {userTypeID == 10 && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>
                          Police Station <span className="text-red-600">*</span>
                        </label>
                        <SelectField name="ps_id" options={psOptions} required label="Police Station" />
                      </div>
                      <div className="form-group">
                        <label>
                          Haat <span className="text-red-600">*</span>
                        </label>
                        <SelectField name="haat_id" options={haatOptions} required label="Haat" />
                      </div>
                    </div>
                  )}
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={(e: any) => setForm({ ...form, [e.target.name]: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter full name"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Contact Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contact_number"
                        value={form.contact_number}
                        onChange={(e: any) => setForm({ ...form, [e.target.name]: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter contact number"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email_address"
                        value={form.email_address}
                        onChange={(e: any) => setForm({ ...form, [e.target.name]: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter email address"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Username <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={(e: any) => setForm({ ...form, [e.target.name]: e.target.value })}
                        required
                        className="form-input"
                        placeholder="Enter username"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? "Creating User..." : "Create User"}
                </button>
                {success && <div className="message success-message">{success}</div>}
                {error && <div className="message error-message">{error}</div>}
              </div>
            </form>
          </div >
        </div >
      </div >
    </div >
  );
};

export default CreateAdminUser;
