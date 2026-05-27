import type { OgCopy } from './copy.js'

type OgNode = {
  type: string
  props: {
    style?: Record<string, string | number>
    src?: string
    children?: OgNode | OgNode[] | string
  }
}

export interface OgTemplateOptions {
  avatarSrc: string
}

function el (
  type: string,
  style: Record<string, string | number> | undefined,
  children: OgNode | OgNode[] | string,
  extra?: { src?: string }
): OgNode {
  return {
    type,
    props: {
      style,
      children,
      ...extra
    }
  }
}

export function buildOgElement (
  copy: OgCopy,
  options: OgTemplateOptions
): OgNode {
  return el('div', {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '56px 64px',
    background:
      'linear-gradient(145deg, #0a0a0b 0%, #141416 45%, #0f172a 100%)',
    color: '#f4f4f5',
    fontFamily: 'sans-serif'
  }, [
    el('div', {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }, [
      el('div', {
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
      }, 'RV'),
      el('span', {
        fontSize: '22px',
        color: '#a1a1aa',
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }, copy.label)
    ]),
    el('div', {
      display: 'flex',
      alignItems: 'center',
      gap: '48px',
      flex: 1
    }, [
      el('img', {
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid #38bdf8',
        flexShrink: 0
      }, '', { src: options.avatarSrc }),
      el('div', {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        flex: 1
      }, [
        el('div', {
          fontSize: '68px',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em'
        }, copy.name),
        el('div', {
          fontSize: '34px',
          fontWeight: 600,
          color: '#38bdf8'
        }, copy.role)
      ])
    ]),
    el('div', {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '26px',
      color: '#e4e4e7'
    }, el('span', {
      padding: '10px 20px',
      borderRadius: '999px',
      border: '1px solid rgba(56, 189, 248, 0.35)',
      background: 'rgba(56, 189, 248, 0.12)'
    }, copy.stack))
  ])
}
