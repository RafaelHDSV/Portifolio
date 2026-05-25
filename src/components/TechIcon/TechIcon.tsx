import {
  FaCss3Alt,
  FaHtml5,
  FaReact,
  FaSass
} from 'react-icons/fa'
import { IoLibrary, IoLogoJavascript, IoSettings } from 'react-icons/io5'
import { SiSharp, SiTypescript } from 'react-icons/si'
import { VscTerminalPowershell } from 'react-icons/vsc'

const iconMap: Record<string, React.ReactNode> = {
  React: <FaReact />,
  Typescript: <SiTypescript />,
  TypeScript: <SiTypescript />,
  Javascript: <IoLogoJavascript />,
  JavaScript: <IoLogoJavascript />,
  CSS: <FaCss3Alt />,
  HTML: <FaHtml5 />,
  Sass: <FaSass />,
  SCSS: <FaSass />,
  'C#': <SiSharp />,
  PowerShell: <VscTerminalPowershell />,
  Bibliotecas: <IoLibrary />,
  API: <IoSettings />
}

interface TechIconProps {
  name: string
}

export default function TechIcon ({ name }: TechIconProps) {
  return <>{iconMap[name] ?? null}</>
}
