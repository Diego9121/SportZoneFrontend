import { Dumbbell } from 'lucide-react'
import ElectricBorder from '@/components/ElectricBorder'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import FormLogin from '@/modules/auth/components/FormLogin'

function LoginPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4">
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.12}
        borderRadius={16}
        className="w-full max-w-sm"
      >
        <Card className="w-full border-none shadow-none">
          <CardHeader className="items-center text-center">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="size-5" />
            </div>
            <CardTitle className="text-xl">Sport Zone</CardTitle>
            <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <FormLogin />
          </CardContent>
        </Card>
      </ElectricBorder>
    </div>
  )
}

export default LoginPage