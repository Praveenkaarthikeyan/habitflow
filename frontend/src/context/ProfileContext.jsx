import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { loadPref, savePref, removePref } from "../services/preferences.js";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const avatarKey = user ? `avatar.${user.id}` : null;
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setAvatar(avatarKey ? loadPref(avatarKey, null) : null);
  }, [avatarKey]);

  // Pass null to remove. Returns true on success, false if browser storage failed.
  // Later: upload to your backend instead and store the returned image URL.
  const updateAvatar = (dataUrl) => {
    if (!avatarKey) return false;
    if (dataUrl === null) {
      removePref(avatarKey);
      setAvatar(null);
      return true;
    }
    const ok = savePref(avatarKey, dataUrl);
    if (ok) setAvatar(dataUrl);
    return ok;
  };

  const profile = {
    name: user?.name || "",
    email: user?.email || "",
    college: user?.college || "",
    avatar,
  };

  return <ProfileContext.Provider value={{ profile, updateAvatar }}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);