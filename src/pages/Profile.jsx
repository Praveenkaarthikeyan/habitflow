import { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({ name: "Student User", email: "student@college.edu", college: "ABC Institute of Technology" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [privacy, setPrivacy] = useState({ habits: true, learning: true, achievements: true });
  const [msg, setMsg] = useState("");

  const saveProfile = (e) => {
    e.preventDefault();
    setMsg("Profile saved (temporary, no backend yet).");
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (passwords.next.length < 8) return setMsg("New password must be at least 8 characters.");
    if (passwords.next !== passwords.confirm) return setMsg("Passwords do not match.");
    setPasswords({ current: "", next: "", confirm: "" });
    setMsg("Password form validated. Real change comes in Module 5.");
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Profile & Settings</h1></div>
      </div>
      {msg && <div className="card mb" style={{ borderColor: "var(--primary)" }}>{msg}</div>}

      <div className="grid grid-2">
        <form className="card" onSubmit={saveProfile}>
          <h2>Personal Information</h2>
          <div className="row mb">
            <div className="avatar" style={{ width: 64, height: 64, fontSize: "1.5rem" }}>{profile.name[0]}</div>
            <input type="file" accept="image/*" />
          </div>
          <div className="form-group"><label>Name</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <div className="form-group"><label>College</label><input value={profile.college} onChange={(e) => setProfile({ ...profile, college: e.target.value })} /></div>
          <button className="btn" type="submit">Save Changes</button>
        </form>

        <form className="card" onSubmit={changePassword}>
          <h2>Change Password</h2>
          <div className="form-group"><label>Current password</label><input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} /></div>
          <div className="form-group"><label>New password</label><input type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} /></div>
          <div className="form-group"><label>Confirm new password</label><input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
          <button className="btn" type="submit">Update Password</button>
        </form>

        <div className="card">
          <h2>Appearance</h2>
          <div className="list-item" style={{ border: "none" }}>
            <span>Theme: {theme}</span>
            <button className="btn btn-ghost btn-sm" onClick={toggleTheme}>Switch to {theme === "light" ? "dark" : "light"}</button>
          </div>
        </div>

        <div className="card">
          <h2>Privacy (visible to friends)</h2>
          {Object.keys(privacy).map((k) => (
            <label key={k} className="list-item" style={{ margin: 0, cursor: "pointer", textTransform: "capitalize" }}>
              <span>{k}</span>
              <input type="checkbox" className="checkbox" style={{ width: 20 }} checked={privacy[k]} onChange={() => setPrivacy({ ...privacy, [k]: !privacy[k] })} />
            </label>
          ))}
          <p className="muted" style={{ marginTop: 10 }}>Expenses and account details are never shared.</p>
        </div>
      </div>
    </>
  );
}