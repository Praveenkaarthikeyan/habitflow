import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import Avatar from "../components/Avatar.jsx";
import { validateImage, cropImageToSquare, ACCEPT_ATTR, MAX_SIZE_MB } from "../utils/image.js";
import { loadPref, savePref } from "../services/preferences.js";

export default function Profile() {
  const { theme, toggleTheme, accent, toggleAccent } = useTheme();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { profile, updateAvatar } = useProfile();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: user.name, college: user.college || "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [privacy, setPrivacy] = useState(() =>
    loadPref("privacy", { habits: true, learning: true, achievements: true })
  );
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "error" | "success", text }

  const notify = (type, text) => {
    setMsg({ type, text });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const errorText = (err) => [err.message, ...(err.details || [])].join(" ");

  // ----- picture (stored in this browser for now) -----
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateImage(file);
    if (problem) return notify("error", problem);
    try {
      setBusy(true);
      setPreview(await cropImageToSquare(file));
      setMsg(null);
    } catch (err) {
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const applyPreview = () => {
    if (updateAvatar(preview)) {
      setPreview(null);
      notify("success", "Profile picture updated.");
    } else {
      notify("error", "Could not save the picture. Browser storage may be full.");
    }
  };

  const removeAvatar = () => {
    updateAvatar(null);
    setPreview(null);
    notify("success", "Profile picture removed.");
  };

  // ----- profile (saved on the server) -----
  const saveProfile = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return notify("error", "Name must be at least 2 characters.");
    try {
      setSavingProfile(true);
      await updateProfile({ name: form.name.trim(), college: form.college.trim() });
      notify("success", "Profile updated.");
    } catch (err) {
      notify("error", errorText(err));
    } finally {
      setSavingProfile(false);
    }
  };

  // ----- password (saved on the server) -----
  const handlePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current) return notify("error", "Enter your current password.");
    if (passwords.next.length < 8) return notify("error", "New password must be at least 8 characters.");
    if (passwords.next === passwords.current) return notify("error", "New password must be different from the current one.");
    if (passwords.next !== passwords.confirm) return notify("error", "Passwords do not match.");
    try {
      setSavingPassword(true);
      await changePassword({ currentPassword: passwords.current, newPassword: passwords.next });
      setPasswords({ current: "", next: "", confirm: "" });
      notify("success", "Password changed. Your other devices have been logged out.");
    } catch (err) {
      notify("error", errorText(err));
    } finally {
      setSavingPassword(false);
    }
  };

  const togglePrivacy = (key) => {
    const next = { ...privacy, [key]: !privacy[key] };
    setPrivacy(next);
    savePref("privacy", next);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Profile & Settings</h1></div>
      </div>

      {msg && (
        <div
          className="card mb"
          role="status"
          style={{ borderColor: msg.type === "error" ? "var(--danger)" : "var(--success)" }}
        >
          {msg.text}
        </div>
      )}

      <div className="card mb">
        <h2>Profile Picture</h2>
        <div className="row" style={{ flexWrap: "wrap", gap: 18 }}>
          <Avatar size={96} />
          <div>
            <p className="muted" style={{ marginBottom: 10 }}>
              JPG, JPEG, PNG or WebP, up to {MAX_SIZE_MB} MB. Cropped to a square. Saved in this browser only.
            </p>
            <div className="row">
              <button className="btn btn-sm" type="button" disabled={busy} onClick={() => fileRef.current.click()}>
                {busy ? "Reading..." : profile.avatar ? "Change photo" : "Upload photo"}
              </button>
              {profile.avatar && (
                <button className="btn btn-sm btn-ghost" type="button" onClick={removeAvatar}>Remove</button>
              )}
            </div>
            <input ref={fileRef} type="file" accept={ACCEPT_ATTR} onChange={handleFile} hidden />
          </div>
        </div>

        {preview && (
          <div className="preview-box">
            <img src={preview} alt="New profile picture preview" />
            <div>
              <strong>Preview</strong>
              <p className="muted" style={{ marginBottom: 10 }}>This is exactly how it will look.</p>
              <div className="row">
                <button className="btn btn-sm" type="button" onClick={applyPreview}>Use this photo</button>
                <button className="btn btn-sm btn-ghost" type="button" onClick={() => setPreview(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-2">
        <form className="card" onSubmit={saveProfile}>
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="p-name">Name</label>
            <input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="p-email">Email</label>
            <input id="p-email" value={user.email} disabled readOnly />
            <div className="field-hint">Your email is your login and can't be changed.</div>
          </div>
          <div className="form-group">
            <label htmlFor="p-college">College</label>
            <input id="p-college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
          </div>
          <button className="btn" type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <form className="card" onSubmit={handlePassword}>
          <h2>Change Password</h2>
          <div className="form-group"><label htmlFor="pw-current">Current password</label>
            <input id="pw-current" type="password" autoComplete="current-password" value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} /></div>
          <div className="form-group"><label htmlFor="pw-new">New password</label>
            <input id="pw-new" type="password" autoComplete="new-password" value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
            <div className="field-hint">At least 8 characters.</div></div>
          <div className="form-group"><label htmlFor="pw-confirm">Confirm new password</label>
            <input id="pw-confirm" type="password" autoComplete="new-password" value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
          <button className="btn" type="submit" disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="card">
          <h2>Account</h2>
          <div className="list-item"><span className="muted">Signed in as</span><strong>{user.email}</strong></div>
          <div className="list-item" style={{ border: "none" }}>
            <span className="muted">Member since</span>
            <strong>{new Date(user.createdAt).toLocaleDateString("en-IN")}</strong>
          </div>
          <button className="btn btn-ghost" type="button" onClick={handleLogout} style={{ marginTop: 12 }}>Log out</button>
        </div>

        <div className="card">
          <h2>Appearance</h2>
          <div className="list-item">
            <span>Mode: {theme}</span>
            <button className="btn btn-ghost btn-sm" type="button" onClick={toggleTheme}>
              Switch to {theme === "light" ? "dark" : "light"}
            </button>
          </div>
          <div className="list-item" style={{ border: "none" }}>
            <span>Color style: {accent === "mono" ? "Black & White" : "Colorful"}</span>
            <button className="btn btn-ghost btn-sm" type="button" onClick={toggleAccent}>
              Switch to {accent === "mono" ? "Colorful" : "Black & White"}
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Privacy (visible to friends)</h2>
          {Object.keys(privacy).map((k) => (
            <label key={k} className="list-item" style={{ margin: 0, cursor: "pointer", textTransform: "capitalize" }}>
              <span>{k}</span>
              <input type="checkbox" className="checkbox" style={{ width: 20 }} checked={privacy[k]} onChange={() => togglePrivacy(k)} />
            </label>
          ))}
          <p className="muted" style={{ marginTop: 10 }}>Expenses and account details are never shared.</p>
        </div>
      </div>
    </>
  );
}