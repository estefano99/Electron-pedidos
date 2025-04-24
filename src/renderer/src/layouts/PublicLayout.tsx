import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

const PublicLayout = () => {
  return (
    <div className='flex w-full min-h-screen'>
      <Outlet/>
      <Toaster/>
    </div>
  )
}

export default PublicLayout
