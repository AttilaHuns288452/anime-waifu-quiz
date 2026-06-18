"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("Quiz error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: "500px",
          margin: "100px auto",
          padding: "24px",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          fontFamily: "system-ui",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "24px", margin: "0 0 8px" }}>
            🚨 Oops! Something crashed
          </h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Error: <code style={{ color: "#e53e3e", fontSize: "13px" }}>{this.state.errorMessage}</code>
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
