"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Table {
  id: number
  number: number
  capacity: number
}

interface NewOrderDialogProps {
  table: Table | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewOrderDialog({ table, open, onOpenChange }: NewOrderDialogProps) {
  if (!table) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Comanda - Mesa {table.number}</DialogTitle>
          <DialogDescription>Crear una nueva comanda para la mesa seleccionada</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="waiter">Mesero</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mesero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juan">Juan Pérez</SelectItem>
                  <SelectItem value="maria">María García</SelectItem>
                  <SelectItem value="carlos">Carlos López</SelectItem>
                  <SelectItem value="ana">Ana Martín</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Número de comensales</Label>
              <Input type="number" placeholder="2" min="1" max={table.capacity} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas especiales</Label>
            <Textarea placeholder="Alergias, preferencias, etc." />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="flex-1">Crear Comanda</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
