"use client";

import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';
import { SubscriptionPlan } from "@/lib/utils/subscription";

const PLANS = [
  {
    id: 'trial',
    name: 'Prueba',
    description: '14 días de prueba gratuita',
    price: 'Gratis',
    features: [
      'Hasta 5 mesas',
      'Hasta 50 productos',
      'Soporte por correo electrónico',
      'Acceso básico al panel'
    ],
    recommended: true
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Para pequeños negocios',
    price: 'ARS 2,999/mes',
    features: [
      'Mesas ilimitadas',
      'Hasta 200 productos',
      'Soporte prioritario',
      'Informes básicos'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para restaurantes establecidos',
    price: 'ARS 5,999/mes',
    features: [
      'Mesas ilimitadas',
      'Productos ilimitados',
      'Soporte prioritario 24/7',
      'Informes avanzados',
      'Integración con delivery'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para cadenas de restaurantes',
    price: 'Personalizado',
    features: [
      'Todo en Professional',
      'Soporte dedicado',
      'Personalización avanzada',
      'API completa',
      'Entrenamiento personalizado'
    ]
  }
] as const;

interface PlanSelectorProps {
  value: SubscriptionPlan;
  onChange: (value: SubscriptionPlan) => void;
  className?: string;
}

export function PlanSelector({ value, onChange, className }: PlanSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as SubscriptionPlan)}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {PLANS.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
            <Label
              htmlFor={plan.id}
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full",
                plan.id === 'trial' && "border-primary"
              )}
            >
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{plan.name}</span>
                  {plan.id === 'trial' && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-2 text-2xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
