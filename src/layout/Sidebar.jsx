// src/layout/Sidebar.jsx

import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/revision", label: "Revision" },
  { to: "/projects", label: "Projects" },
  { to: "/media", label: "Media" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        kartik.
      </div>

      <nav>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className="side-link"
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}