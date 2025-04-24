import { ModeToggle } from "./mode-toggle"

type TitleProps = {
  title: string
}

const HeaderPages = ({ title }: TitleProps) => {
  return (
    <header className="relative w-full h-14 lg:h-[60px] lg:px-6 border-b bg-muted/40">
      <h2
        className='w-full py-3.5 text-dark font-play text-center pr-6 md:pr-0 md:text-xl tracking-wide font-bold uppercase'
      >
        {title}
      </h2>
      <div className="absolute top-2 right-2">
        <ModeToggle />
      </div>
    </header>
  )
}

export default HeaderPages

