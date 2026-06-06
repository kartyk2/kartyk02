import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Media from './pages/Media'
import RevisionMapper from "./pages/RevisionMapper";
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects"    element={<Projects />} />
        <Route path="/media"    element={<Media />} />
        <Route path="/revision" element={<RevisionMapper />} />
      </Routes>
      <footer style={{
        textAlign: 'center', padding: '24px',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--mono)', fontSize: 10,
        color: 'var(--dim)', letterSpacing: '.06em',
      }}>
        personal space · vite + react · cloudflare pages
      </footer>
    </BrowserRouter>
  )
}