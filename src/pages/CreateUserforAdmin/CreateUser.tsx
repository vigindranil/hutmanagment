import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  User,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Building,
  Shield,
  Info,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

const API_URL =
  "http://115.187.62.16:8005/HMSRestAPI/api/user/saveHaatAdminUserDetails";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmaW5hbGFwcHJvdmFsdXNlciIsInNjb3BlIjoiVVNFUl9ST0xFIiwiaXNzIjoic2VsZiIsImV4cCI6MTc1ODA5MjE5MiwiaWF0IjoxNzU4MDA1NzkyLCJ1c2VyRGV0YWlscyI6IntcIlVzZXJJRFwiOjU0LFwiVXNlclR5cGVJRFwiOjcwLFwiVXNlclR5cG";

const districtOptions = [
  { value: 1, label: "District 1" },
  { value: 2, label: "District 2" },
  // Add more as needed
];

const psOptions = [
  { value: 1, label: "PS 1" },
  { value: 2, label: "PS 2" },
  // Add more as needed
];

const userTypeOptions = [
  { label: "Admin", value: 100 },
  { label: "Shop Owner", value: 1 },
  { label: "Checker", value: 50 },
  { label: "Hearing Officer", value: 60 },
  { label: "Approval Officer", value: 70 },
  { label: "Haat Manager", value: 10 },
  // Add more as needed
];
const haatOptions = [
  { value: 1, label: "Haat 1" },
  { value: 2, label: "Haat 2" },
  // Add more as needed
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

const CreateUser = () => {
  const [form, setForm] = useState(initialFormState);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Calculate form progress
  const formProgress = useMemo(() => {
    // Count required fields
    const requiredFields = [
      "user_type_id",
      "district_id",
      "ps_id",
      "haat_id",
      "full_name",
      "contact_number",
      "email_address",
      "username",
    ];
    let filled = 0;
    requiredFields.forEach((field) => {
      if (
        form[field] !== "" &&
        form[field] !== 0 &&
        form[field] !== null &&
        typeof form[field] !== "undefined"
      ) {
        filled += 1;
      }
    });
    return (filled / requiredFields.length) * 100;
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        ["district_id", "ps_id", "haat_id", "user_type_id"].includes(name) && value !== ""
          ? Number(value)
          : value,
    }));
  };

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
      await axios.post(API_URL, payload, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      setSuccess("User created successfully!");
      setForm(initialFormState);
    } catch (err: any) {
      setError("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

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
        {required && <span className="required">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          value={form[name] as string | number}
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
        <option value={name.includes("_id") && name !== "user_type_id" ? 0 : ""}>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-0 px-0" style={{ minHeight: "100vh", width: "100vw", overflowX: "auto" }}>
      <style>{`
        .landscape-container {
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          min-width: 100vw;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          justify-content: center;
          padding: 0;
          margin: 0;
        }
        .landscape-form-card {
          flex: 1 1 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          min-height: 0;
        }
        .form-card {
          width: 95vw;
          max-width: 1800px;
          min-height: 80vh;
          margin: 2vh auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 32px;
          padding: 3px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          align-items: stretch;
          justify-content: center;
        }
        .form-card:hover {
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        .form-inner {
          background: white;
          border-radius: 30px;
          padding: 3.5rem 3rem;
          position: relative;
          overflow: hidden;
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
        }
        .form-header {
          text-align: left;
          margin-bottom: 2.5rem;
        }
        .form-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 0.75rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .form-subtitle {
          color: #64748b;
          font-size: 1.25rem;
          margin: 0;
          font-weight: 400;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem 2.5rem;
          margin-bottom: 2.5rem;
        }
        @media (max-width: 1600px) {
          .form-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 1200px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 900px) {
          .form-card {
            width: 100vw;
            min-width: 0;
            padding: 0;
          }
          .form-inner {
            padding: 2rem 1rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
        @media (max-width: 640px) {
          .form-title {
            font-size: 1.5rem;
          }
          .form-header {
            margin-bottom: 2rem;
          }
          .form-grid {
            margin-bottom: 2rem;
          }
        }
        .form-field {
          position: relative;
        }
        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.625rem;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .label-icon {
          width: 16px;
          height: 16px;
          color: #667eea;
        }
        .required {
          color: #ef4444;
          margin-left: 0.25rem;
        }
        .form-input,
        .form-select {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          color: #374151;
          font-weight: 500;
        }
        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }
        .form-input:hover,
        .form-select:hover {
          border-color: #9ca3af;
          transform: translateY(-1px);
        }
        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.25em 1.25em;
          padding-right: 3rem;
        }
        .submit-button {
          width: 100%;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
        }
        .submit-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        .submit-button:active:not(:disabled) {
          transform: translateY(-1px);
        }
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        .submit-button:hover::before:not(:disabled) {
          left: 100%;
        }
        .message {
          margin-top: 1.25rem;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          font-weight: 600;
          text-align: center;
          animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border-width: 1px;
          border-style: solid;
        }
        .success-message {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border-color: #059669;
        }
        .error-message {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border-color: #dc2626;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff40;
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s linear infinite;
          margin-right: 0.75rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 20s infinite linear;
        }
        .circle-1 {
          width: 80px;
          height: 80px;
          background: #667eea;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        .circle-2 {
          width: 60px;
          height: 60px;
          background: #764ba2;
          top: 20%;
          right: 15%;
          animation-delay: -5s;
        }
        .circle-3 {
          width: 40px;
          height: 40px;
          background: #f093fb;
          bottom: 30%;
          left: 20%;
          animation-delay: -10s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>

      <div className="landscape-container">
        <div className="landscape-form-card">
          <div className="form-card">
            <div className="form-inner">
              <div className="floating-elements">
                <div className="floating-circle circle-1"></div>
                <div className="floating-circle circle-2"></div>
                <div className="floating-circle circle-3"></div>
              </div>

                <div className="form-header">
                  <h2 className="form-title">Create New User</h2>
                  <p className="form-subtitle">Add a new user to the administrative system</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <SelectField
                      label="User Type"
                      name="user_type_id"
                      options={userTypeOptions}
                      required
                      icon={Shield}
                    />

                    <SelectField
                      label="District"
                      name="district_id"
                      options={districtOptions}
                      required
                      icon={MapPin}
                    />

                    <SelectField
                      label="Police Station"
                      name="ps_id"
                      options={psOptions}
                      required
                      icon={Building}
                    />

                    <SelectField
                      label="Haat"
                      name="haat_id"
                      options={haatOptions}
                      required
                      icon={Building}
                    />

                    <FormField
                      label="Full Name"
                      name="full_name"
                      required
                      icon={User}
                    />

                    <FormField
                      label="Contact Number"
                      name="contact_number"
                      type="tel"
                      required
                      icon={Phone}
                    />

                    <FormField
                      label="Email Address"
                      name="email_address"
                      type="email"
                      required
                      icon={Mail}
                    />

                    <FormField
                      label="Username"
                      name="username"
                      required
                      icon={UserCheck}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                  >
                    {loading && <span className="loading-spinner"></span>}
                    {loading ? "Creating User..." : "Create User"}
                  </button>

                {success && (
                  <div className="message success-message">{success}</div>
                )}
                {error && (
                  <div className="message error-message">{error}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
