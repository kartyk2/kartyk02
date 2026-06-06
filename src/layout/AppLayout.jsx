// src/layout/AppLayout.jsx

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">

      <Sidebar />

      <div className="main-shell">

        <Topbar />

        <main className="content">
          {children}
        </main>

      </div>

    </div>
  );
}