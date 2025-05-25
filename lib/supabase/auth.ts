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
  plan: string;
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

  static async signUp(registerData: RegisterData): Promise<{
    user: any;
    profile: any;
    userRecord: any;
    establishment: any;
    requiresEmailVerification: boolean;
    error?: string;
  }> {
    const registrationInProgress = sessionStorage.getItem('registrationInProgress');
    
    try {
      console.log('Iniciando registro para:', registerData.email);
      
      // Si ya hay un registro en proceso, verificamos si es el mismo usuario
      if (registrationInProgress) {
        const existingData = JSON.parse(registrationInProgress);
        if (existingData.email === registerData.email) {
          console.log('Registro ya en proceso para este usuario, omitiendo...');
          throw new Error('El registro ya está en proceso');
        }
      }
      
      // Marcamos que hay un registro en proceso
      sessionStorage.setItem('registrationInProgress', JSON.stringify({
        email: registerData.email,
        timestamp: new Date().toISOString()
      }));
      
      // Validar contraseña
      const passwordValidation = AuthService.validatePassword(registerData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0] || 'La contraseña no cumple con los requisitos');
      }

      console.log('Creando usuario en Auth...');
      
      // 1. Crear usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            phone: registerData.phone || '',
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        console.error('Error en signUp de Auth:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No se pudo crear el usuario');
      }

      console.log('Usuario creado en Auth, ID:', data.user.id);
      
      try {
        // 2. Crear o actualizar el perfil
        console.log('Creando/Actualizando perfil...');
        const profileData = {
          id: data.user.id,
          email: registerData.email,
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          phone: registerData.phone || null,
          role: 'owner',
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, {
            onConflict: 'id',
            ignoreDuplicates: false
          });

        if (profileError) {
          // Si el error es porque el perfil ya existe, continuamos de todos modos
          if (profileError.code !== '23505') {
            console.error('Error al crear/actualizar perfil:', profileError);
            throw new Error('Error al procesar el perfil del usuario');
          }
          console.log('El perfil ya existe, continuando...');
        }

        // 3. Crear usuario en la tabla users
        console.log('Creando usuario en tabla users...');
        const userData = {
          id: data.user.id,
          email: registerData.email,
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          phone: registerData.phone || null,
          role: 'owner',  // Aseguramos que el rol sea 'owner'
          status: 'active',
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        try {
          const { error: userError } = await supabase
            .from('users')
            .upsert(userData, {
              onConflict: 'id',
              ignoreDuplicates: false
            });

          if (userError) {
            console.error('Error al crear/actualizar usuario:', userError);
            // No lanzamos error para no interrumpir el flujo
          } else {
            console.log('Usuario creado/actualizado en tabla users');
          }
        } catch (userError) {
          console.error('Excepción al crear/actualizar usuario:', userError);
        }

        // 4. Crear establecimiento
        console.log('Creando establecimiento...');
        
        // Crear cliente con rol de servicio para saltar RLS
        const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
          throw new Error('Falta la clave de servicio de Supabase');
        }
        
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceRoleKey,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );
        
        const { data: establishment, error: establishmentError } = await supabaseAdmin
          .from('establishments')
          .insert({
            name: registerData.establishmentName,
            type: registerData.establishmentType,
            address: registerData.address || null,
            city: registerData.city || null,
            state: registerData.state || null,
            zip_code: registerData.zipCode || null,
            country: registerData.country || null,
            phone: registerData.phone || '',
            email: registerData.email,
            timezone: registerData.timezone || 'America/Argentina/Buenos_Aires',
            currency: 'ARS',
            language: 'es',
            plan: 'free',
            status: 'pending_verification',
            owner_id: data.user.id,
            settings: {},
          })
          .select()
          .single();

        if (establishmentError) {
          console.error('Error al crear establecimiento:', establishmentError);
          throw new Error('Error al crear el establecimiento: ' + establishmentError.message);
        }

        console.log('Establecimiento creado con éxito:', establishment);

        // 5. Actualizar el usuario con el ID del establecimiento
        console.log('Actualizando usuario con ID de establecimiento...');
        const { error: updateUserError } = await supabase
          .from('users')
          .update({ 
            establishment_id: establishment.id,
            role: 'owner'  // Aseguramos nuevamente el rol
          })
          .eq('id', data.user.id);

        if (updateUserError) {
          console.error('Error al actualizar usuario:', updateUserError);
          // No lanzamos error para no interrumpir el flujo
        }

        // 6. Actualizar el perfil con el ID del establecimiento
        console.log('Actualizando perfil con ID de establecimiento...');
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ 
            establishment_id: establishment.id,
            role: 'owner'  // Aseguramos el rol también en el perfil
          })
          .eq('id', data.user.id);

        if (updateProfileError) {
          console.error('Error al actualizar perfil:', updateProfileError);
          // No lanzamos error para no interrumpir el flujo
        }

        console.log('Registro completado exitosamente');
        
        // Limpiamos el indicador de registro en proceso
        sessionStorage.removeItem('registrationInProgress');
        
        // 7. Obtener el perfil actualizado
        let updatedProfile = null;
        let userRecord = null;
        
        try {
          // Obtener el perfil
          const [{ data: profileData }, { data: userData }] = await Promise.all([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single(),
            supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()
          ]);
          
          updatedProfile = profileData;
          userRecord = userData;
        } catch (error) {
          console.log('Error al obtener datos actualizados:', error);
        }
        
        // Combinar datos de usuario, perfil y registro
        const userResponse = {
          ...data.user,
          ...(updatedProfile || {}),
          ...(userRecord || {})
        };
        
        return {
          user: userResponse,
          profile: updatedProfile || {
            id: data.user.id,
            email: registerData.email,
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            phone: registerData.phone || null,
            role: 'owner',
          },
          userRecord: userRecord || {
            id: data.user.id,
            email: registerData.email,
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            phone: registerData.phone || null,
            role: 'owner',
            status: 'active'
          },
          establishment,
          requiresEmailVerification: true,
        };
      } catch (error) {
        console.error('Error durante el registro:', error);
        
        // Si hay un error pero el usuario ya existe en Auth, intentamos continuar
        if (data?.user?.id) {
          console.log('Recuperando información existente...');
          
          // Intentamos obtener el perfil existente
          let existingProfile = null;
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            existingProfile = profileData;
          } catch (profileError) {
            console.log('No se pudo obtener el perfil existente:', profileError);
          }
            
          // Intentamos obtener el establecimiento existente
          let existingEstablishment = null;
          try {
            const { data: establishmentData } = await supabase
              .from('establishments')
              .select('*')
              .eq('owner_id', data.user.id)
              .single();
            existingEstablishment = establishmentData;
          } catch (establishmentError) {
            console.log('No se pudo obtener el establecimiento existente:', establishmentError);
          }
            
          return {
            user: { ...data.user, ...existingProfile },
            profile: existingProfile || {
              id: data.user.id,
              email: registerData.email,
              first_name: registerData.firstName,
              last_name: registerData.lastName,
              phone: registerData.phone || null,
              role: 'owner',
            },
            userRecord: existingProfile || {
              id: data.user.id,
              email: registerData.email,
              first_name: registerData.firstName,
              last_name: registerData.lastName,
              phone: registerData.phone || null,
              role: 'owner',
              status: 'active'
            },
            establishment: existingEstablishment,
            requiresEmailVerification: true,
          };
        }
        
        throw error;
      }
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      
      // Limpiamos el indicador de registro en proceso en caso de error
      sessionStorage.removeItem('registrationInProgress');
      
      let errorMessage = 'Error al registrarse. Por favor, inténtalo de nuevo.';
      
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        
        if (error.message.includes('already registered')) {
          errorMessage = 'Este correo electrónico ya está registrado.';
        } else if (error.message.includes('password')) {
          errorMessage = 'La contraseña no cumple con los requisitos mínimos.';
        } else if (error.message.includes('Database')) {
          errorMessage = 'Error en la base de datos: ' + error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        user: null,
        profile: null,
        userRecord: null,
        establishment: null,
        requiresEmailVerification: false,
        error: errorMessage
      };
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async verifyEmail(token: string) {
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

    return { success: true };
  }

  static async resendVerificationEmail(email: string) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectTo = `${siteUrl}/auth/verify-email?type=signup&email=${encodeURIComponent(email)}`;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) throw error;
    return { success: true };
  }

  static async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profile) return null;

    // Verificar si el correo está verificado
    if (!user.email_confirmed_at) {
      return null;
    }

    return { ...profile, email: user.email || profile.email };
  }

  static async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
