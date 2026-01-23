"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafafa",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ textAlign: "center", padding: "24px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 24px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: "32px", height: "32px", color: "#dc2626" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#27272a",
                margin: 0,
              }}
            >
              Critical Error
            </h1>
            <p
              style={{
                color: "#71717a",
                marginTop: "8px",
                maxWidth: "400px",
              }}
            >
              A critical error occurred. Please refresh the page or try again
              later.
            </p>
            {error.digest && (
              <p
                style={{
                  color: "#a1a1aa",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                gap: "16px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#18181b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{
                  padding: "12px 24px",
                  border: "1px solid #d4d4d8",
                  color: "#3f3f46",
                  borderRadius: "8px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Go Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
