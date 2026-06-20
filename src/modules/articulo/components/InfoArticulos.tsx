import { ImageOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ArticuloDetalle } from '../schemas/articulo.schema'

interface InfoArticulosProps {
  articulo: ArticuloDetalle
}

function InfoArticulos({ articulo }: InfoArticulosProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center self-center rounded-md border bg-muted sm:self-start">
          {articulo.imagen ? (
            <img
              src={articulo.imagen}
              alt={articulo.nombre}
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <CardHeader className="p-0">
            <CardTitle>{articulo.nombre}</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
              {articulo.categoriaNombre}
            </span>
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
              {articulo.marcaNombre}
            </span>
            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
              {articulo.codigo}
            </span>
          </div>
          {articulo.descripcion && (
            <p className="text-sm text-muted-foreground">{articulo.descripcion}</p>
          )}
          <div className="mt-2 flex gap-6 text-sm">
            <div>
              <div className="text-muted-foreground">Variantes</div>
              <div className="font-medium">{articulo.totalVariantes}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Stock total</div>
              <div className="font-medium">{articulo.stockTotal}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InfoArticulos
