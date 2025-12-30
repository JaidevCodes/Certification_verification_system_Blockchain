import React, { useState } from "react";
import IssuerPanel from "./components/IssuerPanel";
import VerifierPanel from "./components/VerifierPanel";
import "./App.css";

function App() {
  const [activePanel, setActivePanel] = useState<"issuer" | "verifier">("issuer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col items-center px-4 py-8">

      {/* ===== Header ===== */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold gradient-text">
          CertChain
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Blockchain-based Certificate Issuing & Verification System
        </p>
      </header>

      {/* ===== Main Card ===== */}
      <div className="w-full max-w-6xl glass-effect rounded-2xl p-6 md:p-8">

        {/* ===== Navigation Tabs ===== */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActivePanel("issuer")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 hover-lift
              ${activePanel === "issuer"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
             Issuer Panel
          </button>

          <button
            onClick={() => setActivePanel("verifier")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 hover-lift
              ${activePanel === "verifier"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
             Verifier Panel
          </button>
        </div>

        {/* ===== Panel Content ===== */}
        <div className="transition-all duration-300 ease-in-out">
          {activePanel === "issuer" ? <IssuerPanel /> : <VerifierPanel />}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="mt-8 text-center text-gray-500 text-xs md:text-sm">
        © 2025 CertChain • Built using Blockchain & IPFS
      </footer>
    </div>
  );
}

export default App;
