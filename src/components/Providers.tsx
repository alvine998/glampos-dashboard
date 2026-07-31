"use client";

import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "nprogress/nprogress.css";
import ProgressBar from "./ProgressBar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ProgressBar />
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#0a3632",
            borderRadius: "8px",
            border: "1px solid #dde8e1",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#0dae3f", secondary: "#fff" } },
          error: { iconTheme: { primary: "#b9594b", secondary: "#fff" } },
        }}
      />
      {children}
    </>
  );
}
