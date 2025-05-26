"use client";

import { Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { checkTrialStatus, EstablishmentWithTrial, SubscriptionPlan } from '@/lib/utils/subscription';
import { useRouter } from 'next/navigation';

interface TrialStatusBannerProps {
  establishment: EstablishmentWithTrial;
}

export function TrialStatusBanner({ establishment: initialData }: TrialStatusBannerProps) {
  const [status, setStatus] = useState<{
    isTrialActive: boolean;
    daysRemaining: number | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStatus = async () => {
      if (!initialData) return;
      
      const trialStatus = await checkTrialStatus(initialData.id);
      if (trialStatus) {
        setStatus({
          isTrialActive: trialStatus.isTrialActive,
          daysRemaining: trialStatus.daysRemaining
        });
      }
      setIsLoading(false);
    };
    
    loadStatus();
  }, [initialData.id]);

  if (isLoading || !status || initialData.plan !== SubscriptionPlan.trial) {
    return null;
  }

  const { isTrialActive, daysRemaining } = status;

  if (!isTrialActive) {
    return (
      <Card className="border-red-200 bg-red-50 mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">
              Tu período de prueba ha finalizado. Actualiza tu plan para seguir disfrutando de todas las funcionalidades.
            </p>
          </div>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => router.push('/billing/plans')}
          >
            Actualizar plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-blue-600" />
          <p className="text-sm font-medium text-blue-800">
            Tienes {daysRemaining} días restantes de prueba
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/billing/plans')}
        >
          Ver planes
        </Button>
      </CardContent>
    </Card>
  );
}
