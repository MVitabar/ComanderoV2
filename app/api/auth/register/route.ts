import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, email, firstName, lastName, phone, establishmentName, establishmentType, address, city, state, zipCode, country, timezone, plan } = body

    // Crear cliente con Service Role Key (solo disponible en servidor)
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 1. Crear/Actualizar perfil
    console.log('Creando/Actualizando perfil...')
    const profileData = {
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: phone || '',
      status: 'pending_verification',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'owner',
      tables: true,
      orders: true,
      kitchen: true,
      inventory: true,
      reports: true,
      users: true,
      settings: true,
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData)

    if (profileError) {
      console.error('Error al crear/actualizar perfil:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    console.log('Perfil creado/actualizado correctamente')

    // 2. Crear establecimiento
    console.log('Creando establecimiento...')
    const establishmentData = {
      name: establishmentName,
      type: establishmentType,
      address,
      city,
      state,
      zip_code: zipCode,
      country,
      phone,
      timezone: timezone || 'America/Argentina/Buenos_Aires',
      owner_id: userId,
      status: 'active',
      plan: plan || 'trial',
      trial_ends_at: plan === 'trial'
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      currency: 'ARS',
      language: 'es',
      settings: {},
      email
    }

    const { data: establishmentResult, error: establishmentError } = await supabase
      .from('establishments')
      .insert([establishmentData])
      .select('*')
      .single()

    if (establishmentError) {
      console.error('Error al crear el establecimiento:', establishmentError)
      return NextResponse.json({ error: establishmentError.message }, { status: 400 })
    }

    console.log('Establecimiento creado con ID:', establishmentResult.id)

    // 3. Asociar el usuario al establecimiento
    const { error: userEstablishmentError } = await supabase
      .from('profiles')
      .update({ establishment_id: establishmentResult.id })
      .eq('id', userId)

    if (userEstablishmentError) {
      console.error('Error al asociar usuario con establecimiento:', userEstablishmentError)
      // No lanzamos error aquí para no interrumpir el flujo
    }

    return NextResponse.json({ 
      success: true, 
      establishmentId: establishmentResult.id 
    })

  } catch (error) {
    console.error('Error en el registro:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
