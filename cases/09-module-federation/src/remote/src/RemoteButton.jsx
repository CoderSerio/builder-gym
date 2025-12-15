import React from "react";

export function RemoteButton({ label = "Remote Button" }) {
  return (
    <button
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #333",
        background: "#fff"
      }}
      onClick={() => alert("Hello from Remote!")}
    >
      {label}
    </button>
  );
}


