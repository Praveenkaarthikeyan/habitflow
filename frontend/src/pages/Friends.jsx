import { useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import { initialFriends, initialRequests } from "../data/mockData.js";

export default function Friends() {
  const [friends, setFriends] = useState(initialFriends);
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState("");

  const accept = (r) => {
    setFriends([...friends, { id: r.id, name: r.name, habitRate: 0, learning: 0, points: 0 }]);
    setRequests(requests.filter((x) => x.id !== r.id));
  };
  const reject = (id) => setRequests(requests.filter((x) => x.id !== id));
  const removeFriend = (id) => setFriends(friends.filter((f) => f.id !== id));

  const shown = friends.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  const leaderboard = [...friends].sort((a, b) => b.points - a.points);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Friends</h1>
          <p className="muted">Stay accountable together. Only shared progress is visible, never expenses.</p>
        </div>
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <h2>Friend Requests ({requests.length})</h2>
          {requests.length ? requests.map((r) => (
            <div className="list-item" key={r.id}>
              <span>{r.name}</span>
              <div className="row">
                <button className="btn btn-sm" onClick={() => accept(r)}>Accept</button>
                <button className="btn btn-sm btn-ghost" onClick={() => reject(r.id)}>Reject</button>
              </div>
            </div>
          )) : <EmptyState emoji="📬" title="No pending requests" />}
        </div>

        <div className="card">
          <h2>🏆 Leaderboard</h2>
          {leaderboard.map((f, i) => (
            <div className="list-item" key={f.id}>
              <span>#{i + 1} {f.name}</span>
              <strong>{f.points} pts</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>My Friends</h2>
        <div className="form-group">
          <input placeholder="Search friends..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {shown.length ? shown.map((f) => (
          <div className="list-item" key={f.id}>
            <div className="row">
              <div className="avatar">{f.name[0]}</div>
              <div>
                <div>{f.name}</div>
                <div className="muted">Habits {f.habitRate}% · Learning {f.learning}%</div>
              </div>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => removeFriend(f.id)}>Remove</button>
          </div>
        )) : <EmptyState emoji="🔍" title="No friends found" />}
      </div>
    </>
  );
}