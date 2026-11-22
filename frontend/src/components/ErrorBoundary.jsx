import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("UI crashed:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="auth-wrap">
        <div className="card auth-card" style={{ textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p className="muted" style={{ margin: "8px 0 16px" }}>An unexpected error occurred. Reloading usually fixes it.</p>
          <button className="btn" onClick={() => window.location.assign("/")}>Reload HabitFlow</button>
        </div>
      </div>
    );
  }
}