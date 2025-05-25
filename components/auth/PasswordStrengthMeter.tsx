// components/auth/PasswordStrengthMeter.tsx
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface PasswordStrengthMeterProps {
  password: string;
  onChange: (isValid: boolean) => void;
  className?: string;
}

export function PasswordStrengthMeter({ 
  password, 
  onChange,
  className 
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<{
    score: number;
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  }>({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    setStrength({
      score,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    });

    // Notificar al componente padre si la contraseña es válida
    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    onChange(isValid);
  }, [password, onChange]);

  const getStrengthColor = () => {
    if (strength.score === 0) return 'bg-gray-200';
    if (strength.score <= 2) return 'bg-red-500';
    if (strength.score <= 3) return 'bg-yellow-500';
    if (strength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength.score === 0) return 'Muy débil';
    if (strength.score <= 2) return 'Débil';
    if (strength.score <= 3) return 'Moderada';
    if (strength.score <= 4) return 'Fuerte';
    return 'Muy fuerte';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getStrengthColor()}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Fortaleza: {getStrengthText()}</span>
        <span>{strength.score}/5</span>
      </div>
      
      <div className="mt-4 space-y-1 text-sm">
        <PasswordRequirement 
          isValid={strength.hasMinLength} 
          text="Al menos 6 caracteres" 
        />
        <PasswordRequirement 
          isValid={strength.hasUpperCase} 
          text="Al menos una letra mayúscula" 
        />
        <PasswordRequirement 
          isValid={strength.hasLowerCase} 
          text="Al menos una letra minúscula" 
        />
        <PasswordRequirement 
          isValid={strength.hasNumber} 
          text="Al menos un número" 
        />
        <PasswordRequirement 
          isValid={strength.hasSpecialChar} 
          text="Al menos un carácter especial (!@#$%^&*)" 
        />
      </div>
    </div>
  );
}

function PasswordRequirement({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div className="flex items-center">
      <span 
        className={cn(
          'w-5 h-5 flex items-center justify-center mr-2 rounded-full',
          isValid 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-400'
        )}
      >
        {isValid ? '✓' : '•'}
      </span>
      <span className={cn(isValid ? 'text-foreground' : 'text-muted-foreground')}>
        {text}
      </span>
    </div>
  );
}