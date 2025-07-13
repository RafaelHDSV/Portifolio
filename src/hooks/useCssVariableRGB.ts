export function getRGBFromCSSVariable(variableName: string): string {
  const style = getComputedStyle(document.documentElement)
  const value = style.getPropertyValue(variableName).trim()

  if (value.startsWith('#')) {
    const hex = value.replace('#', '')
    const bigint = parseInt(hex, 16)

    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return `${r},${g},${b}`
  }

  if (value.startsWith('rgb')) {
    const match = value.match(/\((.*?)\)/)
    return match ? match[1] : '0,0,0'
  }

  const temp = document.createElement('div')
  temp.style.color = value
  document.body.appendChild(temp)

  const rgb = getComputedStyle(temp).color
  document.body.removeChild(temp)

  const match = rgb.match(/\((.*?)\)/)
  return match ? match[1] : '0,0,0'
}
