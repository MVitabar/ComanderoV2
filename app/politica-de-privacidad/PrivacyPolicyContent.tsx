
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyContent() {
  return (
    <div className="container max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/auth/register" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al registro
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6">Política de Privacidad</h1>
        <p className="text-muted-foreground">
          Última actualización: 25 de Mayo de 2025
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Información que recopilamos</h2>
          <p className="mb-4">
            Recopilamos información que nos proporcionas al registrarte en nuestro servicio, incluyendo:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Nombre y apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Información de contacto</li>
            <li>Datos de tu establecimiento</li>
            <li>Información de pago (procesada de forma segura por nuestro proveedor de pagos)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Cómo utilizamos tu información</h2>
          <p className="mb-4">
            Utilizamos la información que recopilamos para:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Proporcionar, operar y mantener nuestro servicio</li>
            <li>Mejorar, personalizar y expandir nuestro servicio</li>
            <li>Comprender y analizar cómo utilizas nuestro servicio</li>
            <li>Desarrollar nuevos productos, servicios, características y funcionalidades</li>
            <li>Comunicarnos contigo, ya sea directamente o a través de uno de nuestros socios</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Divulgación de datos</h2>
          <p className="mb-4">
            No compartimos tu información personal con terceros, excepto en los siguientes casos:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
            <li>Para cumplir con la ley o procedimientos legales</li>
            <li>Para proteger los derechos o la propiedad de nuestra empresa</li>
            <li>En conexión con una fusión, adquisición o venta de activos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Seguridad de los datos</h2>
          <p className="mb-6">
            Valoramos tu confianza al proporcionarnos tu información personal, por lo que nos esforzamos por utilizar medios comercialmente aceptables para protegerla. Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cambios a esta política</h2>
          <p className="mb-6">
            Podemos actualizar nuestra Política de Privacidad periódicamente. Te notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización" en la parte superior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contáctanos</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-6">
            <li>Por correo electrónico: privacidad@tudominio.com</li>
            <li>Visitando esta página en nuestro sitio web: <Link href="/contacto" className="text-primary hover:underline">Contáctanos</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
