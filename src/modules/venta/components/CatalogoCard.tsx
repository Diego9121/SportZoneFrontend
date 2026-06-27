import { Plus } from 'lucide-react'
import ImagenFallbackIcon from '@/components/ImagenFallbackIcon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { VarianteCatalogo } from '@/modules/variante/schemas/variante.schema'

interface CatalogoCardProps {
  variante: VarianteCatalogo
  cantidadEnCarrito: number
  onAdd: (variante: VarianteCatalogo) => void
}

function CatalogoCard({ variante, cantidadEnCarrito, onAdd }: CatalogoCardProps) {
  const sinStockDisponible = cantidadEnCarrito >= variante.stock

  return (
    <Card size="sm" className="gap-2">
      <CardContent className="flex flex-col gap-2 px-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-muted">
          {variante.articuloImagen ? (
            <img
              src={variante.articuloImagen}
              alt={variante.articuloNombre}
              className="h-full w-full object-contain"
            />
          ) : (
            <ImagenFallbackIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="line-clamp-2 text-xs font-medium leading-tight">
            {variante.articuloNombre}
          </p>
          <p className="text-xs text-muted-foreground">
            {variante.color ?? 'Sin color'} · US {variante.tallaUs ?? '-'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Bs. {variante.precioVenta}</span>
            <Badge variant={sinStockDisponible ? 'destructive' : 'outline'}>
              Stock {variante.stock}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-2">
        <Button
          type="button"
          size="sm"
          className="w-full"
          disabled={sinStockDisponible}
          onClick={() => onAdd(variante)}
        >
          <Plus />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CatalogoCard
