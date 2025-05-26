'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailCheck, MailOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegistryEndPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Obtener el correo del almacenamiento local si está disponible
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('registerEmail') : null;
    if (storedEmail) {
      setEmail(storedEmail);
      // Limpiar el correo del almacenamiento después de usarlo
      localStorage.removeItem('registerEmail');
    }
    setIsLoading(false);
  }, []);

  const handleOpenEmail = () => {
    // Abrir el cliente de correo predeterminado
    window.location.href = 'mailto:';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">¡Revisa tu correo!</CardTitle>
            <CardDescription className="mt-2">
              Hemos enviado un enlace de verificación a tu dirección de correo electrónico.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-800">{email || 'tucorreo@ejemplo.com'}</p>
            </div>
            
            <p className="text-muted-foreground text-sm">
              Haz clic en el enlace que te enviamos para verificar tu cuenta y comenzar a usar nuestros servicios.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    ¿No ves el correo? Revisa tu carpeta de <span className="font-medium">correo no deseado</span> o <span className="font-medium">spam</span>.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handleOpenEmail}
              className="w-full"
            >
              <MailOpen className="h-4 w-4 mr-2" />
              Abrir mi correo
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>¿No recibiste el correo? </p>
              <Button 
                variant="link" 
                className="text-primary p-0 h-auto font-normal"
                onClick={() => router.push('/auth/resend-verification')}
              >
                Reenviar correo de verificación
              </Button>
            </div>
            
            <div className="w-full border-t pt-4 mt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>¿Tienes problemas? <a href="mailto:soporte@comandero.com" className="text-primary hover:underline">Contáctanos</a></p>
        </div>
      </div>
    </div>
  );
}
