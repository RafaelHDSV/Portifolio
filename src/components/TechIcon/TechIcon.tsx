import {
  FaCss3Alt,
  FaHtml5,
  FaJava,
  FaNode,
  FaPython,
  FaReact,
  FaSass
} from 'react-icons/fa'
import { IoLibrary, IoLogoJavascript, IoSettings } from 'react-icons/io5'
import {
  SiGnubash,
  SiKotlin,
  SiMongodb,
  SiMysql,
  SiPhp,
  SiPostgresql,
  SiSharp,
  SiTypescript
} from 'react-icons/si'
import { VscTerminalCmd, VscTerminalPowershell } from 'react-icons/vsc'

function TsqlIcon () {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden
    >
      <path d='M12 2C8.686 2 6 3.343 6 5v14c0 1.657 2.686 3 6 3s6-1.343 6-3V5c0-1.657-2.686-3-6-3zm0 2c2.559 0 4 .895 4 1.5S14.559 7 12 7 8 6.105 8 5.5 9.441 4 12 4zM8 8.832C9.214 9.584 10.55 10 12 10s2.786-.416 4-1.168V11c0 .605-1.441 1.5-4 1.5S8 11.605 8 11V8.832zM8 14.832C9.214 15.584 10.55 16 12 16s2.786-.416 4-1.168V17c0 .605-1.441 1.5-4 1.5S8 17.605 8 17v-2.168z' />
    </svg>
  )
}

/** Chaves em lowercase para lookup case-insensitive. */
const iconMap: Record<string, React.ReactNode> = {
  react: <FaReact />,
  typescript: <SiTypescript />,
  javascript: <IoLogoJavascript />,
  css: <FaCss3Alt />,
  html: <FaHtml5 />,
  sass: <FaSass />,
  scss: <FaSass />,
  'c#': <SiSharp />,
  csharp: <SiSharp />,
  php: <SiPhp />,
  powershell: <VscTerminalPowershell />,
  tsql: <TsqlIcon />,
  't-sql': <TsqlIcon />,
  kotlin: <SiKotlin />,
  plpgsql: <SiPostgresql />,
  postgresql: <SiPostgresql />,
  postgres: <SiPostgresql />,
  python: <FaPython />,
  java: <FaJava />,
  shell: <SiGnubash />,
  bash: <SiGnubash />,
  batchfile: <VscTerminalCmd />,
  node: <FaNode />,
  'node.js': <FaNode />,
  mongodb: <SiMongodb />,
  mysql: <SiMysql />,
  bibliotecas: <IoLibrary />,
  api: <IoSettings />
}

interface TechIconProps {
  name: string
}

export function resolveTechIconKey (name: string): string | null {
  const key = name.trim().toLowerCase()
  return key in iconMap ? key : null
}

export default function TechIcon ({ name }: TechIconProps) {
  const key = resolveTechIconKey(name)
  if (!key) return null
  return <>{iconMap[key]}</>
}
