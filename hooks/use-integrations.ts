"use client";

import * as React from 'react';
import type { Integration } from '@/lib/integrations/types';
import { defaultIntegrations } from '@/lib/integrations/config';

// Definir el tipo del contexto
interface IIntegrationsContext {
  integrations: Integration[];
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  getIntegration: (id: string) => Integration | undefined;
  getEnabledIntegrations: (category?: string) => Integration[];
}

// Crear el contexto
export const IntegrationsContext = React.createContext<IIntegrationsContext | null>(null);

// Hook personalizado para usar el contexto
export function useIntegrations() {
  const context = React.useContext(IntegrationsContext);
  if (!context) {
    throw new Error('useIntegrations must be used within an IntegrationsProvider');
  }
  return context;
}

// Componente proveedor
export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = React.useState<Integration[]>(defaultIntegrations);

  React.useEffect(() => {
    const saved = localStorage.getItem("comandero-integrations");
    if (saved) {
      try {
        const parsedIntegrations = JSON.parse(saved);
        setIntegrations(parsedIntegrations);
      } catch (error) {
        console.error("Failed to parse saved integrations:", error);
      }
    }
  }, []);

  const updateIntegration = React.useCallback((id: string, updates: Partial<Integration>): void => {
    setIntegrations(prevIntegrations => {
      const updatedIntegrations = prevIntegrations.map(integration =>
        integration.id === id ? { ...integration, ...updates } : integration
      );
      localStorage.setItem("comandero-integrations", JSON.stringify(updatedIntegrations));
      return updatedIntegrations;
    });
  }, []);

  const getIntegration = React.useCallback((id: string): Integration | undefined => {
    return integrations.find(integration => integration.id === id);
  }, [integrations]);

  const getEnabledIntegrations = React.useCallback((category?: string): Integration[] => {
    return integrations.filter(integration => 
      integration.enabled && (category ? integration.category === category : true)
    );
  }, [integrations]);

  // Crear el valor del contexto
  const contextValue: IIntegrationsContext = {
    integrations,
    updateIntegration,
    getIntegration,
    getEnabledIntegrations,
  };

  // Usar React.createElement en lugar de JSX para evitar problemas de interpretación
  return React.createElement(
    IntegrationsContext.Provider,
    { value: contextValue },
    children
  );
}

export default IntegrationsProvider;

