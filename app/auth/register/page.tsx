// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChefHat, ArrowLeft, Building, User, Mail, Lock, Phone, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthService } from "@/lib/supabase/auth";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";

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

    // Establishment Info
    establishmentName: "",
    establishmentType: "restaurant",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Argentina",
    timezone: "America/Argentina/Buenos_Aires",

    // Terms
    acceptTerms: false,
  });

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, password: value }));
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

    if (!isPasswordValid) {
      toast.error("La contraseña no cumple con los requisitos mínimos");
      return;
    }

    setIsSubmitting(true);

    try {
      const { user, profile, establishment, error } = await AuthService.signUp({
        ...formData,
        plan: 'free', // Asegurémonos de incluir la propiedad plan que espera RegisterData
      });

      if (error) {
        throw new Error(error);
      }

      toast.success("¡Registro exitoso! Por favor verifica tu correo electrónico.");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Error al registrarse. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />}
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
                  <ChefHat className="h-5 w-5" />
                  Términos y Condiciones
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ingresa tus datos personales"}
              {step === 2 && "Configura tu establecimiento"}
              {step === 3 && "Últimos pasos para comenzar"}
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
                      placeholder="tu@ejemplo.com"
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
                      placeholder="+54 9 11 1234-5678"
                      className="pl-10"
                    />
                  </div>
                </div>

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
            )}

            {/* Paso 2: Información del Establecimiento */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="establishmentName">Nombre del Establecimiento</Label>
                  <Input
                    id="establishmentName"
                    value={formData.establishmentName}
                    onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
                    placeholder="Ej: Mi Restaurante"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishmentType">Tipo de Establecimiento</Label>
                  <Select
                    value={formData.establishmentType}
                    onValueChange={(value) => setFormData({ ...formData, establishmentType: value })}
                  >
                    <SelectTrigger>
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="C.P."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="País"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Términos y Condiciones */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms">Términos y Condiciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Acepto los{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Términos de Servicio
                        </Link>{' '}
                        y la{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Política de Privacidad
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={step === 1 || isSubmitting}>
                Anterior
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Siguiente
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.acceptTerms || isSubmitting || !isPasswordValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}