import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Home";
import RevisionMapper from "./pages/RevisionMapper";
import Projects from "./pages/Projects";
import Media from "./pages/Media";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/revision" element={<RevisionMapper />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/media" element={<Media />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}