import { supabase } from '@/lib/supabase/client';

export enum SubscriptionPlan {
  trial = 'trial',
  starter = 'starter',
  professional = 'professional',
  enterprise = 'enterprise'
}

export interface EstablishmentWithTrial {
  id: string;
  plan: SubscriptionPlan;
  trial_ends_at: string | null;
  status: string;
  // Agrega otros campos según sea necesario
}

export function isTrialActive(establishment: EstablishmentWithTrial): boolean {
  if (establishment.plan !== SubscriptionPlan.trial) return false;
  if (!establishment.trial_ends_at) return false;
  
  const trialEndsAt = new Date(establishment.trial_ends_at);
  const now = new Date();
  return now < trialEndsAt;
}

export function getTrialDaysRemaining(establishment: EstablishmentWithTrial): number | null {
  if (establishment.plan !== SubscriptionPlan.trial || !establishment.trial_ends_at) return null;
  
  const trialEndsAt = new Date(establishment.trial_ends_at);
  const now = new Date();
  const diffTime = trialEndsAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Días restantes
}

export async function checkTrialStatus(establishmentId: string) {
  const { data, error } = await supabase
    .from('establishments')
    .select('id, plan, trial_ends_at, status')
    .eq('id', establishmentId)
    .single();

  if (error || !data) return null;
  
  return {
    ...data,
    isTrialActive: isTrialActive(data as EstablishmentWithTrial),
    daysRemaining: getTrialDaysRemaining(data as EstablishmentWithTrial)
  };
}
