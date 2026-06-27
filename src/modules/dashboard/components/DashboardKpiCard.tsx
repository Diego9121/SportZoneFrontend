import { TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardKpiCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: number
}

function DashboardKpiCard({ title, value, description, icon: Icon, trend }: DashboardKpiCardProps) {
  const esPositivo = (trend ?? 0) >= 0

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-sm font-normal text-muted-foreground">
          <span>{title}</span>
          <Icon className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend !== undefined && (
          <Badge
            variant="outline"
            className={cn(
              'w-fit',
              esPositivo
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-600'
                : 'border-destructive/30 bg-destructive/10 text-destructive',
            )}
          >
            {esPositivo ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}% vs. mes anterior
          </Badge>
        )}
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </CardContent>
    </Card>
  )
}

export default DashboardKpiCard
