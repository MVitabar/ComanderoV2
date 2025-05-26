"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Términos y Condiciones de Uso
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="prose dark:prose-invert max-h-[70vh] overflow-y-auto pr-2">
                  <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">1. Aceptación de los Términos</h4>
                      <p>
                        Al acceder y utilizar Comandero (el "Servicio"), usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">2. Uso del Servicio</h4>
                      <p>
                        El Servicio está destinado para su uso en la gestión de restaurantes y establecimientos de alimentos y bebidas. Usted se compromete a utilizar el Servicio solo con fines legales y de acuerdo con estos Términos y todas las leyes y regulaciones aplicables.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">3. Cuenta de Usuario</h4>
                      <p>
                        Es necesario crear una cuenta para acceder a ciertas funciones del Servicio. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y acepta notificarnos inmediatamente de cualquier uso no autorizado de su cuenta.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">4. Prueba Gratuita</h4>
                      <p>
                        Ofrecemos un período de prueba gratuito de 14 días. No se requiere tarjeta de crédito para comenzar. Al finalizar el período de prueba, deberá seleccionar un plan de pago para continuar utilizando el Servicio.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">5. Facturación y Pagos</h4>
                      <p>
                        Los planes de pago se facturan por adelantado según el ciclo de facturación seleccionado. Los precios están sujetos a cambios con 30 días de notificación previa. No se realizan reembolsos por períodos parciales de servicio.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">6. Propiedad Intelectual</h4>
                      <p>
                        El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Comandero y sus licenciantes. Nuestro logotipo y nombre son marcas registradas de Comandero.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">7. Limitación de Responsabilidad</h4>
                      <p>
                        En la máxima medida permitida por la ley, en ningún caso Comandero será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, o cualquier pérdida de beneficios o ingresos.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">8. Cambios en los Términos</h4>
                      <p>
                        Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos sobre cambios importantes publicando los nuevos Términos en este sitio y actualizando la fecha de "Última actualización".
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">9. Contacto</h4>
                      <p>
                        Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en soporte@comandero.app
                      </p>
                    </section>

                    <div className="pt-4 text-xs text-gray-500 dark:text-gray-400">
                      <p>Última actualización: 25 de Mayo de 2025</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="button" onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
