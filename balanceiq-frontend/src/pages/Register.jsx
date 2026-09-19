import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/balanceiq.css";

function Register() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
department: "",
role: "EMPLOYEE"
});

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const handleRegister = async () => {
if (
!form.name ||
!form.email ||
!form.password ||
!form.department
) {
alert("Please fill all fields");
return;
}

setLoading(true);
console.log("Navigate:", navigate);
console.log("API:", api);
try {
  await api.post("/auth/register", form);

  alert("Registration successful!");
  navigate("/");
} catch (err) {
  console.log("Register Error:", err);
  console.log("Response:", err.response);

  alert(
    JSON.stringify(err.response?.data) ||
    err.message ||
    "Registration failed"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="biq-login-page">
<div
className="biq-login-panel"
style={{ background: "var(--cream-100)" }}
> <div className="biq-login-form-wrap">

      <div style={{ marginBottom: "40px" }}>
        <div className="biq-login-logo">
          Balance<span style={{ color: "var(--green-500)" }}>IQ</span>
        </div>

        <div className="biq-login-tagline">
          Employee Registration
        </div>
      </div>

      <h2>Create Account</h2>

      <div className="biq-form-group">
        <label>Name</label>
        <input
          className="biq-input"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="biq-form-group">
        <label>Email</label>
        <input
          className="biq-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="biq-form-group">
        <label>Password</label>
        <input
          className="biq-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <div className="biq-form-group">
        <label>Department</label>
        <input
          className="biq-input"
          name="department"
          value={form.department}
          onChange={handleChange}
        />
      </div>

      <div className="biq-form-group">
        <label>Role</label>
        <select
          className="biq-input"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="MANAGER">MANAGER</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <button
        className="biq-btn biq-btn-primary"
        style={{ width: "100%" }}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating..." : "Register"}
      </button>

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/">Login</Link>
      </p>

    </div>
  </div>
</div>
);
}

export default Register;
