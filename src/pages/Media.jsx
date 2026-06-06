import { useState } from 'react'
import PdfEmbed from '../components/PdfEmbed'
import Divider from '../components/Divider'
import { PDFS, IMAGES, VIDEOS, LINKS } from '../data/content'
import './Media.css'

const TABS = ['PDFs', 'Images', 'Videos', 'Links']

const TAG_COLOR = { tool: 'blue', learning: 'green', reference: 'amber' }

export default function Media() {
  const [tab, setTab] = useState('PDFs')

  return (
    <div className="page-wrap">
      <div className="page-head fade-up">
        <span className="eyebrow">Library</span>
        <h1 className="page-title">Media &amp; Docs</h1>
        <p className="page-sub">PDFs, images, videos, and saved resources — all in one place.</p>
      </div>

      <div className="tabs fade-up d1">
        {TABS.map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'PDFs' && (
        <div className="fade-up">
          {PDFS.length === 0
            ? <Empty>Drop PDFs into assets/pdfs/ and add them to content.js</Empty>
            : PDFS.map(p => <PdfEmbed key={p.id} {...p} />)
          }
        </div>
      )}

      {tab === 'Images' && (
        <div className="img-grid fade-up">
          {IMAGES.length === 0
            ? <Empty>Add images to assets/images/ and content.js</Empty>
            : IMAGES.map(img => (
                <div key={img.id} className="img-item">
                  <img src={img.src} alt={img.caption} />
                  <div className="img-cap">{img.caption}</div>
                </div>
              ))
          }
        </div>
      )}

      {tab === 'Videos' && (
        <div className="fade-up">
          {VIDEOS.length === 0
            ? <Empty>Add YouTube video IDs to content.js</Empty>
            : VIDEOS.map(v => (
                <div key={v.id} className="yt-block">
                  <div className="yt-title">{v.title}</div>
                  <div className="yt-desc">{v.desc}</div>
                  <div className="yt-frame">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {tab === 'Links' && (
        <div className="links-grid fade-up">
          {LINKS.length === 0
            ? <Empty>Add bookmarks to content.js</Empty>
            : LINKS.map(l => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-top">
                    <span className="link-title">{l.title}</span>
                    <span className={`link-tag tag-${l.tag || 'default'}`}>{l.tag}</span>
                  </div>
                  <div className="link-desc">{l.desc}</div>
                  <div className="link-url">{l.url.replace('https://', '')}</div>
                </a>
              ))
          }
        </div>
      )}
    </div>
  )
}

function Empty({ children }) {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      background: 'var(--surface)', border: '1px dashed var(--border)',
      borderRadius: 'var(--radius)',
      fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)',
    }}>
      {children}
    </div>
  )
}
