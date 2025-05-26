'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, Mail, User, Briefcase, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Tipo para el perfil de usuario
type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

// Tipo para los datos del establecimiento
type EstablishmentData = {
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  zip_code: string;
};

// Hook personalizado para el cliente de Supabase
function useSupabaseClient() {
  return useMemo(() => createClientComponentClient(), []);
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [establishmentData, setEstablishmentData] = useState<EstablishmentData | null>(null);

  // Cargar datos del usuario y verificar el token
  useEffect(() => {
    const verifyAndLoadData = async () => {
      if (!tokenHash || type !== 'signup') {
        setVerificationError('Enlace de verificación inválido o expirado.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Verificar el token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'signup',
        });

        if (error) throw error;
        if (!data.user) throw new Error('No se pudo verificar el token');

        // Obtener datos del perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError || !profile) throw new Error('No se pudo cargar el perfil del usuario');

        // Actualizar el perfil para marcar el correo como verificado
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', data.user.id);

        if (updateError) throw updateError;

        // Establecer datos del usuario
        setUserProfile({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: data.user.email || '',
          phone: profile.phone || ''
        });

        // Cargar datos del establecimiento si existe
        if (profile.establishment_id) {
          const { data: establishment, error: estError } = await supabase
            .from('establishments')
            .select('*')
            .eq('id', profile.establishment_id)
            .single();

          if (!estError && establishment) {
            setEstablishmentData({
              name: establishment.name || '',
              type: establishment.type || '',
              address: establishment.address || '',
              city: establishment.city || '',
              state: establishment.state || '',
              country: establishment.country || '',
              phone: establishment.phone || '',
              email: establishment.email || '',
              zip_code: establishment.zip_code || ''
            });
          }
        }


        setIsVerified(true);
      } catch (error) {
        console.error('Error al verificar el correo:', error);
        setVerificationError('No se pudo verificar el correo. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndLoadData();
  }, [tokenHash, type]);

  const handleContinue = () => {
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando tu correo electrónico...</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Error de Verificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <p className="text-muted-foreground">
              {verificationError}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white">
            <div className="flex flex-col items-center text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-white" />
              <CardTitle className="text-3xl font-bold">¡Correo Verificado!</CardTitle>
              <CardDescription className="text-white/90">
                Tu cuenta ha sido verificada exitosamente. Revisa la información de tu cuenta a continuación.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            {/* Sección de información del usuario */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Tus Datos</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre completo</p>
                  <p className="font-medium">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correo electrónico</p>
                  <p className="font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> {userProfile?.email}
                  </p>
                </div>
                {userProfile?.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> {userProfile.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de información del establecimiento */}
            {establishmentData && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Datos del Establecimiento</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Nombre del establecimiento</p>
                    <p className="font-medium">{establishmentData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de establecimiento</p>
                    <Badge variant="outline" className="mt-1">
                      {establishmentData.type || 'No especificado'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Correo electrónico</p>
                    <p className="font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-1" /> {establishmentData.email}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span>
                        {establishmentData.address}, {establishmentData.city}<br />
                        {establishmentData.state}, {establishmentData.country} {establishmentData.zip_code}
                      </span>
                    </p>
                  </div>
                  {establishmentData.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-1" /> {establishmentData.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="bg-gray-50 px-6 py-4 border-t">
            <div className="w-full flex justify-end">
              <Button onClick={handleContinue}>
                Continuar al Inicio de Sesión
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
