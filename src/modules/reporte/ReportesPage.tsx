import { PageHeader } from '@/components/layout/page-header'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import ReporteVentasTab from './components/ReporteVentasTab'
import ReporteComprasTab from './components/ReporteComprasTab'

function ReportesPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Reportes"
        description="Resumen de ventas y compras por periodo."
      />
      <Tabs defaultValue="ventas">
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="compras">Compras</TabsTrigger>
        </TabsList>
        <TabsContent value="ventas">
          <ReporteVentasTab />
        </TabsContent>
        <TabsContent value="compras">
          <ReporteComprasTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportesPage
