import { createFileRoute } from '@tanstack/react-router'
import ReportesPage from '@/modules/reporte/ReportesPage'

export const Route = createFileRoute('/reportes/')({
  component: ReportesPage,
})
