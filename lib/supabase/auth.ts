import { createClient, supabase } from './client';

export type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = SignInCredentials & {
  firstName: string;
  lastName: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  establishmentName: string;
  establishmentType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  timezone: string;
  plan: 'trial' | 'starter' | 'professional' | 'enterprise';
};

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  establishment_id: string;
  status: string;
  phone: string;
  email_verified?: boolean;
  permissions: {
    tables: boolean;
    orders: boolean;
    kitchen: boolean;
    inventory: boolean;
    reports: boolean;
    users: boolean;
    settings: boolean;
  };
};

type AuthResponse = {
  data: {
    user: User | null;
    session: any;
  } | null;
  error: Error | null;
};

type ProfileResponse = {
  data: any | null;
  error: Error | null;
};

type EstablishmentResponse = {
  data: any | null;
  error: Error | null;
};

export class AuthService {
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  static async signIn(credentials: LoginCredentials) {
    try {
      // Primero intentamos autenticar al usuario
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Authentication error:', error);
        throw error;
      }

      // Verificar que data.user existe
      if (!data?.user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      // Verificar si el correo está verificado
      if (!data.user.email_confirmed_at) {
        // Si el correo no está verificado, forzamos el cierre de sesión
        await this.signOut();
        throw new Error("Por favor, verifica tu correo electrónico antes de iniciar sesión.");
      }

      // Obtener el perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error al obtener el perfil del usuario:', profileError);
        throw new Error('Error al cargar la información del perfil');
      }

      if (!profile) {
        await this.signOut();
        throw new Error('No se encontró el perfil de usuario. Por favor, contacta al soporte.');
      }

      // Combinar la información del usuario de autenticación con el perfil
      return { 
        user: { 
          ...data.user, 
          ...profile 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Correo o contraseña incorrectos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      return { 
        user: null, 
        error: new Error(errorMessage) 
      };
    }
  }

  static async signUp(data: RegisterData) {
    try {
      console.log('Iniciando registro para:', data.email);

      // 1. Crear usuario en Auth
      console.log('Creando usuario en Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || '',
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      console.log('Usuario creado en Auth, ID:', authData.user.id);

      // 2. Crear perfil y establecimiento vía API route (servidor)
      console.log('Creando perfil y establecimiento...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          establishmentName: data.establishmentName,
          establishmentType: data.establishmentType,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          timezone: data.timezone,
          plan: data.plan,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear perfil y establecimiento');
      }

      const result = await response.json();
      console.log('Perfil y establecimiento creados correctamente');

      // 5. Enviar correo de verificación
      console.log('Enviando correo de verificación...');
      const { error: verificationError } = await supabase.auth.resend({
        type: 'signup',
        email: data.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (verificationError) {
        console.error('Error al enviar correo de verificación:', verificationError);
        // No lanzamos error aquí para no interrumpir el flujo
      }

      return {
        user: authData.user,
        establishment: { id: result.establishmentId },
        session: authData.session
      };
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error;
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async verifyEmail(token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) throw error;
      if (!data.user) throw new Error("User not found");

      // Actualizar el estado de verificación en la base de datos
      const { error: updateError } = await supabase
        .from("users")
        .update({ status: "active" })
        .eq("id", data.user.id);

      if (updateError) throw updateError;

      // Actualizar el establecimiento a estado activo
      const { error: estError } = await supabase
        .from("establishments")
        .update({ status: "active" })
        .eq("owner_id", data.user.id);

      if (estError) console.error("Error updating establishment status:", estError);

      return { 
        success: true, 
        user: data.user,
        session: data.session 
      };
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      throw error;
    }
  }

  static async resendVerificationEmail(email: string) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const redirectTo = `${siteUrl}/auth/callback`;
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error reenviando correo de verificación:', error);
      return { data: null, error };
    }
  }

  static async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return { data: null, error };
    }
  }

  static async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return { data: null, error };
    }
  }

  static async getCurrentUser(): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.getUser();

    // 403 es normal cuando no hay sesión - no es un error real
    if (error) {
      if (error.status === 403) {
        return { data: null, error: null };
      }
      console.error('Error al obtener usuario:', error);
      return { data: null, error };
    }

    if (!data.user) {
      return { data: null, error: null };
    }
  
    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      return { data: null, error: profileError };
    }
  
    // Combinar datos de auth y perfil
    const userData = {
      ...data.user,
      ...profile,
      email: data.user.email || '',
    };
  
    return { 
      data: { 
        user: userData as User,
        session: null 
      }, 
      error: null 
    };
  }

  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  static async getEstablishment(establishmentId: string) {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', establishmentId)
      .single();

    return { data, error };
  }

  static async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  // Verificar OTP (One Time Password)
  static async verifyOtp(params: {
    token_hash: string;
    type: 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change';
  }) {
    const { data, error } = await supabase.auth.verifyOtp(params);
    return { data, error };
  }
}
