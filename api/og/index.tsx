import { ImageResponse } from '@vercel/og'
import { getOgCopy, normalizeOgLang } from './copy.js'

export default async function handler (request: Request) {
  const { searchParams } = new URL(request.url)
  const copy = getOgCopy(normalizeOgLang(searchParams.get('lang')))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background:
            'linear-gradient(145deg, #0a0a0b 0%, #141416 45%, #0f172a 100%)',
          color: '#f4f4f5',
          fontFamily: 'sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              border: '2px solid #38bdf8',
              color: '#38bdf8',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}
          >
            RV
          </div>
          <span
            style={{
              fontSize: '22px',
              color: '#a1a1aa',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            {copy.label}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em'
            }}
          >
            {copy.name}
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 600,
              color: '#38bdf8'
            }}
          >
            {copy.role}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '26px',
            color: '#e4e4e7'
          }}
        >
          <span
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'rgba(56, 189, 248, 0.12)'
            }}
          >
            {copy.stack}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control':
          'public, max-age=86400, stale-while-revalidate=604800'
      }
    }
  )
}
