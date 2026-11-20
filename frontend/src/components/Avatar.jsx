import { useProfile } from "../context/ProfileContext.jsx";

export default function Avatar({ size = 38 }) {
  const { profile } = useProfile();
  const style = { width: size, height: size, fontSize: size * 0.42 };

  if (profile.avatar) {
    return <img className="avatar avatar-img" src={profile.avatar} alt={`${profile.name}'s profile`} style={style} />;
  }
  const initial = (profile.name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="avatar" style={style} aria-label="Default avatar">
      {initial}
    </div>
  );
}