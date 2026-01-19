import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-72px)] bg-muted/10">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
