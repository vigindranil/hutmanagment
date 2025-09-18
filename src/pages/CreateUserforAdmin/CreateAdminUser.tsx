import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { commonApi } from "../../Service/commonAPI";
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const userTypeOptions = [
  { label: "Admin", value: 100 },
  { label: "Shop Owner", value: 1 },
  { label: "Checker", value: 50 },
  { label: "Hearing Officer", value: 60 },
  { label: "Approval Officer", value: 70 },
  { label: "Haat Manager", value: 10 },
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
  user_password: "admin@123", // hardcoded
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

  // Calculate form progress
  // const formProgress = useMemo(() => {
  //   const requiredFields = [
  //     "user_type_id",
  //     "district_id",
  //     "ps_id",
  //     "haat_id",
  //     "full_name",
  //     "contact_number",
  //     "email_address",
  //     "username",
  //   ];
  //   let filled = 0;
  //   requiredFields.forEach((field) => {
  //     if (
  //       form[field] !== "" &&
  //       form[field] !== 0 &&
  //       form[field] !== null &&
  //       typeof form[field] !== "undefined"
  //     ) {
  //       filled += 1;
  //     }
  //   });
  //   return (filled / requiredFields.length) * 100;
  // }, [form]);

  // Use the correct API for user creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const token = Cookies.get("token");
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
          value={form[name]}
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
        value={form[name] as string | number}
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
      <style>{`
        .landscape-table-container {
          width: 100%;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
        }
        .form-table-card {
          width: 100%;
          max-width: 1100px;
          margin: 4vh auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 2px;
          box-shadow: 0 10px 24px -8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          display: flex;
          align-items: stretch;
          justify-content: center;
          overflow: hidden;
        }
        .form-table-inner {
          background: white;
          border-radius: 22px;
          padding: 1.5rem 1.25rem;
          position: relative;
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-header {
          text-align: left;
          margin-bottom: 1rem;
        }
        .form-title {
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem 0;
        }
        .form-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }
        /* ✅ Responsive table wrapper */
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        .form-table {
          width: 100%;
          min-width: 600px; /* keeps columns readable */
          border-collapse: separate;
          border-spacing: 0 1rem;
          margin-bottom: 1rem;
        }
        .form-table th, .form-table td {
          padding: 0.5rem 0.75rem;
          text-align: left;
          vertical-align: middle;
          white-space: nowrap; /* prevents ugly wrapping */
        }
        .form-table th {
          background: #f3f4f6;
          font-weight: 700;
          border-radius: 6px 6px 0 0;
        }
        .form-table td {
          background: #f9fafb;
          border-radius: 6px;
        }
        .submit-button {
          width: 100%;
          padding: 0.8rem 1.2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 700px) {
          .form-table-card {
            max-width: 100vw;
            margin: 0;
            border-radius: 0;
          }
          .form-table-inner {
            padding: 1rem 0.5rem;
            border-radius: 0;
          }
        }
      `}</style>

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
              {/* ✅ Wrapped table in scrollable div */}
              <div className="table-wrapper">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <th>User Type <span className="text-red-600">*</span></th>
                      <td>
                        <SelectField name="user_type_id" options={userTypeOptions} required />
                      </td>
                      <th>District <span className="text-red-600">*</span></th>
                      <td>
                        <SelectField name="district_id" options={districtOptions} required />
                      </td>
                    </tr>
                    {userTypeID == 10 && <tr>
                      <th>Police Station <span className="text-red-600">*</span></th>
                      <td>
                        <SelectField name="ps_id" options={psOptions} required />
                      </td>
                      <th>Haat <span className="text-red-600">*</span></th>
                      <td>
                        <SelectField name="haat_id" options={haatOptions} required />
                      </td>
                    </tr>}
                    <tr>
                      <th>Full Name <span className="text-red-600">*</span></th>
                      <td>
                        <div className="form-field">
                          <input
                            type="text"
                            name="full_name"
                            value={form.full_name}
                            onChange={(e: any) => setForm({...form, [e.target.name] : e.target.value})}
                            required={true}
                            className="form-input"
                          />
                        </div>
                      </td>
                      <th>Contact Number <span className="text-red-600">*</span></th>
                      <td>
                        <div className="form-field">
                          <input
                            type="tel"
                            name="contact_number"
                            value={form.contact_number}
                            onChange={(e: any) => setForm({...form, [e.target.name] : e.target.value})}
                            required={true}
                            className="form-input"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Email <span className="text-red-600">*</span></th>
                      <td>
                        <div className="form-field">
                          <input
                            type="email"
                            name="email_address"
                            value={form.email_address}
                            onChange={(e: any) => setForm({...form, [e.target.name] : e.target.value})}
                            required={true}
                            className="form-input"
                          />
                        </div>
                      </td>
                      <th>Username <span className="text-red-600">*</span></th>
                      <td>
                        <div className="form-field">
                          <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={(e: any) => setForm({...form, [e.target.name] : e.target.value})}
                            required={true}
                            className="form-input"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminUser;
