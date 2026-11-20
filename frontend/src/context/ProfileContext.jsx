import { createContext, useContext, useState } from "react";
import { loadPref, savePref } from "../services/preferences.js";

const defaults = {
  name: "Student User",
  email: "student@college.edu",
  college: "ABC Institute of Technology",
  avatar: null, // data URL now, image URL once a backend exists
};

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => ({ ...defaults, ...loadPref("profile", {}) }));

  // Returns true if saved, false if browser storage failed.
  const updateProfile = (patch) => {
    const next = { ...profile, ...patch };
    const ok = savePref("profile", next);
    if (ok) setProfile(next);
    return ok;
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);