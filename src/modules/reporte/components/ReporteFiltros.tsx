import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ReporteFiltrosProps {
  desde: string
  hasta: string
  onDesdeChange: (value: string) => void
  onHastaChange: (value: string) => void
}

function ReporteFiltros({ desde, hasta, onDesdeChange, onHastaChange }: ReporteFiltrosProps) {
  const tieneFiltros = desde !== '' || hasta !== ''

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor="reporte-desde">Desde</Label>
        <Input
          id="reporte-desde"
          type="date"
          className="w-[160px]"
          value={desde}
          max={hasta || undefined}
          onChange={(e) => onDesdeChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="reporte-hasta">Hasta</Label>
        <Input
          id="reporte-hasta"
          type="date"
          className="w-[160px]"
          value={hasta}
          min={desde || undefined}
          onChange={(e) => onHastaChange(e.target.value)}
        />
      </div>
      {tieneFiltros && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            onDesdeChange('')
            onHastaChange('')
          }}
        >
          <X />
          Limpiar
        </Button>
      )}
    </div>
  )
}

export default ReporteFiltros
