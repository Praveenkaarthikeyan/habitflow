import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import Avatar from "../components/Avatar.jsx";
import { validateImage, cropImageToSquare, ACCEPT_ATTR, MAX_SIZE_MB } from "../utils/image.js";
import { loadPref, savePref } from "../services/preferences.js";

export default function Profile() {
  const { theme, toggleTheme, accent, toggleAccent } = useTheme();
  const { profile, updateProfile } = useProfile();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: profile.name, email: profile.email, college: profile.college });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [privacy, setPrivacy] = useState(() =>
    loadPref("privacy", { habits: true, learning: true, achievements: true })
  );
  const [preview, setPreview] = useState(null); // cropped image waiting for confirmation
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "error" | "success", text }

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again later
    if (!file) return;
    const problem = validateImage(file);
    if (problem) return setMsg({ type: "error", text: problem });
    try {
      setBusy(true);
      setPreview(await cropImageToSquare(file));
      setMsg(null);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const applyPreview = () => {
    if (updateProfile({ avatar: preview })) {
      setPreview(null);
      setMsg({ type: "success", text: "Profile picture updated." });
    } else {
      setMsg({ type: "error", text: "Could not save the picture. Browser storage may be full." });
    }
  };

  const removeAvatar = () => {
    updateProfile({ avatar: null });
    setPreview(null);
    setMsg({ type: "success", text: "Profile picture removed." });
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setMsg({ type: "error", text: "Name must be at least 2 characters." });
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setMsg({ type: "error", text: "Enter a valid email address." });
    updateProfile({ name: form.name.trim(), email: form.email.trim(), college: form.college.trim() });
    setMsg({ type: "success", text: "Profile saved on this device (no backend yet)." });
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (passwords.next.length < 8) return setMsg({ type: "error", text: "New password must be at least 8 characters." });
    if (passwords.next !== passwords.confirm) return setMsg({ type: "error", text: "Passwords do not match." });
    setPasswords({ current: "", next: "", confirm: "" });
    setMsg({ type: "success", text: "Password form validated. Real change comes in Module 5." });
  };

  const togglePrivacy = (key) => {
    const next = { ...privacy, [key]: !privacy[key] };
    setPrivacy(next);
    savePref("privacy", next);
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
              JPG, JPEG, PNG or WebP, up to {MAX_SIZE_MB} MB. It will be cropped to a square.
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
          <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label>College</label><input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} /></div>
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