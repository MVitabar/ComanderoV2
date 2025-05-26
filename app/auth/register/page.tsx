// app/auth/register/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChefHat, ArrowLeft, Building, User, Mail, Lock, Phone, MapPin, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthService } from "@/lib/supabase/auth";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { PlanSelector } from "@/components/subscription/PlanSelector";
import { SubscriptionPlan } from "@/lib/utils/subscription";
import { TermsModal } from "@/components/modals/TermsModal";
import countries from 'world-countries';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    plan: 'trial' as SubscriptionPlan,

    // Establishment Info
    establishmentName: "",
    establishmentType: "restaurant",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    timezone: "America/Argentina/Buenos_Aires",

    // Terms
    acceptTerms: false,
  });

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const router = useRouter();

  const establishmentTypes = [
    { value: "restaurant", label: "Restaurante" },
    { value: "cafe", label: "Cafetería" },
    { value: "bar", label: "Bar" },
    { value: "fastfood", label: "Comida Rápida" },
    { value: "pizzeria", label: "Pizzería" },
    { value: "bakery", label: "Panadería" },
    { value: "other", label: "Otro" },
  ];

  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const countryInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1); // Cambiado de 3 a 4 pasos
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, password: value }));
  };

  const handlePlanChange = (plan: SubscriptionPlan) => {
    setFormData(prev => ({ ...prev, plan }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, country: value });
    
    if (value.length > 0) {
      const filtered = countries
        .map(country => country.name.common)
        .filter(name => 
          name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setCountrySuggestions(filtered);
    } else {
      setCountrySuggestions([]);
    }
  };

  const selectCountry = (country: string) => {
    setFormData({ ...formData, country });
    setCountrySuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await AuthService.signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        establishmentName: formData.establishmentName,
        establishmentType: formData.establishmentType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        plan: formData.plan,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Añadimos la zona horaria del navegador
      });

      if (error) throw error;

      // Redirigir a la página de verificación
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
      
    } catch (error: any) {
      console.error("Error durante el registro:", error);
      toast.error(error.message || "Error al crear la cuenta. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Comandero</span>
          </div>
          <h1 className="text-3xl font-bold">Crear tu cuenta</h1>
          <p className="text-muted-foreground">Comienza a gestionar tu restaurante</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && (
                <>
                  <User className="h-5 w-5" />
                  Información Personal
                </>
              )}
              {step === 2 && (
                <>
                  <Building className="h-5 w-5" />
                  Información del Establecimiento
                </>
              )}
              {step === 3 && (
                <>
                  <Check className="h-5 w-5" />
                  Elige tu Plan
                </>
              )}
              {step === 4 && (
                <>
                  <ChefHat className="h-5 w-5" />
                  Términos y Condiciones
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ingresa tus datos personales"}
              {step === 2 && "Configura tu establecimiento"}
              {step === 3 && "Selecciona el plan que mejor se adapte a tus necesidades"}
              {step === 4 && "Últimos pasos para comenzar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Paso 1: Información Personal */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Tu nombre"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Tu apellido"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tucorreo@ejemplo.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                    <PasswordStrengthMeter 
                      password={formData.password} 
                      onChange={setIsPasswordValid}
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Información del Establecimiento */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="establishmentName">Nombre del Establecimiento</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="establishmentName"
                      value={formData.establishmentName}
                      onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
                      placeholder="Ej: Mi Restaurante"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishmentType">Tipo de Establecimiento</Label>
                    <Select
                      value={formData.establishmentType}
                      onValueChange={(value) => setFormData({ ...formData, establishmentType: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {establishmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="country">País</Label>
                    <div className="relative">
                      <Input
                        id="country"
                        ref={countryInputRef}
                        value={formData.country}
                        onChange={handleCountryChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Escribe tu país"
                        autoComplete="off"
                      />
                      {showSuggestions && countrySuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                          {countrySuggestions.map((country) => (
                            <div
                              key={country}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                selectCountry(country);
                              }}
                            >
                              {country}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle y número"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ciudad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Provincia</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Provincia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="Código postal"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Selección de Plan */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Elige el plan perfecto para tu negocio</h3>
                  <p className="text-muted-foreground">
                    Comienza con una prueba gratuita de 14 días. Sin tarjeta de crédito requerida.
                  </p>
                </div>
                
                <PlanSelector 
                  value={formData.plan} 
                  onChange={handlePlanChange} 
                  className="mt-6"
                />
                
                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium mb-2">Resumen de tu selección:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium">
                        {formData.plan === 'trial' ? 'Prueba Gratuita (14 días)' : 
                         formData.plan === 'starter' ? 'Starter' :
                         formData.plan === 'professional' ? 'Professional' : 'Enterprise'}
                      </span>
                    </div>
                    {formData.plan === 'trial' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="font-medium">14 días</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-medium">
                        {formData.plan === 'trial' ? 'Gratis' : 
                         formData.plan === 'starter' ? 'ARS 2,999/mes' :
                         formData.plan === 'professional' ? 'ARS 5,999/mes' : 'Personalizado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 4: Términos y Condiciones */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Términos y Condiciones</h3>
                  <div className="bg-muted/50 p-4 rounded-lg max-h-60 overflow-y-auto text-sm">
                    <p className="mb-4">
                      Al crear una cuenta, aceptas nuestros{" "}
                      <button 
                        type="button"
                        className="text-primary hover:underline font-medium"
                        onClick={() => setIsTermsModalOpen(true)}
                      >
                        Términos de Servicio
                      </button>{" "}
                      y{" "}
                      <button 
                        type="button"
                        className="text-primary hover:underline font-medium"
                        onClick={() => window.open('/politica-de-privacidad', '_blank')}
                      >
                        Política de Privacidad
                      </button>.{" "}
                      Tu información será utilizada para proporcionar y mejorar nuestros servicios.
                    </p>
                    <p>
                      La prueba gratuita de 14 días te da acceso completo a todas las funciones. 
                      No se requiere tarjeta de crédito para comenzar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: !!checked })}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los Términos de Servicio y la Política de Privacidad
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Debes aceptar los términos para continuar con el registro.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1 || isLoading}
              >
                Anterior
              </Button>
              
              {step < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword)) ||
                    (step === 2 && (!formData.establishmentName || !formData.address || !formData.city || !formData.state || !formData.zipCode)) ||
                    isLoading
                  }
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={!formData.acceptTerms || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : 'Crear cuenta'}
                </Button>
              )}
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
              <Link href="/auth/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
    </div>
  );
}