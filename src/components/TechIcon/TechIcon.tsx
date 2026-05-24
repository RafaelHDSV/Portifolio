import {
  FaCss3Alt,
  FaHtml5,
  FaReact
} from 'react-icons/fa'
import { IoLibrary, IoLogoJavascript, IoSettings } from 'react-icons/io5'
import { SiTypescript } from 'react-icons/si'

const iconMap: Record<string, React.ReactNode> = {
  React: <FaReact />,
  Typescript: <SiTypescript />,
  TypeScript: <SiTypescript />,
  Javascript: <IoLogoJavascript />,
  JavaScript: <IoLogoJavascript />,
  CSS: <FaCss3Alt />,
  HTML: <FaHtml5 />,
  Bibliotecas: <IoLibrary />,
  API: <IoSettings />
}

interface TechIconProps {
  name: string
}

export default function TechIcon ({ name }: TechIconProps) {
  return <>{iconMap[name] ?? null}</>
}
