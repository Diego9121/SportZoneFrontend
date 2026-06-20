import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ArticuloDetalle } from '../schemas/articulo.schema'
import type { Variante } from '@/modules/variante/schemas/variante.schema'

type VarianteResumen = ArticuloDetalle['variantes'][number]

interface InfoVarianteProps {
  variante: VarianteResumen | Variante
  compact?: boolean
}

function tieneArticulo(
  variante: VarianteResumen | Variante,
): variante is Variante {
  return 'articuloNombre' in variante
}

function InfoVariante({ variante, compact = false }: InfoVarianteProps) {
  const tallas = [
    variante.tallaUs && `US ${variante.tallaUs}`,
    variante.tallaEu && `EU ${variante.tallaEu}`,
    variante.tallaUk && `UK ${variante.tallaUk}`,
    variante.tallaCm && `${variante.tallaCm} cm`,
  ].filter(Boolean)

  if (compact) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>{variante.color ?? 'Sin color'}</span>
            {variante.stockBajo && <Badge variant="destructive">Stock bajo</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>{tallas.join(' · ') || 'Sin tallas registradas'}</span>
          <span>Stock: {variante.stock}</span>
          <span className="font-medium text-foreground">$ {variante.precioVenta}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Variante {variante.color ?? ''}</span>
          {variante.stockBajo && <Badge variant="destructive">Stock bajo</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {tieneArticulo(variante) && (
          <div className="col-span-2 sm:col-span-3">
            <div className="text-muted-foreground">Artículo</div>
            <div className="font-medium">
              {variante.articuloNombre} ({variante.articuloCodigo})
            </div>
          </div>
        )}
        <div>
          <div className="text-muted-foreground">Talla</div>
          <div>{tallas.join(' · ') || '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Color</div>
          <div>{variante.color ?? '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Código de barras</div>
          <div>{variante.codigoBarras ?? '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Stock</div>
          <div>{variante.stock}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Stock mínimo</div>
          <div>{variante.stockMinimo}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Precio venta</div>
          <div>$ {variante.precioVenta}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Precio costo</div>
          <div>$ {variante.precioCosto}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InfoVariante
