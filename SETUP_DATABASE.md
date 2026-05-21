# Configuración de Base de Datos - Comandero V2

## Instrucciones para configurar Supabase

### 1. Crear el proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que el proyecto se inicialice (puede tardar unos minutos)

### 2. Obtener las credenciales

Una vez creado el proyecto, ve a:
- **Settings** → **API**
- Copia los siguientes valores:
  - `Project URL` (ej: https://tiygsfgqgqswrvkjihzd.supabase.co)
  - `anon public key` (ej: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)

### 3. Configurar las variables de entorno

El archivo `.env.local` ya está configurado en tu proyecto con el formato correcto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

**IMPORTANTE:** Reemplaza los valores con tus credenciales reales de Supabase.

### 4. Ejecutar el script SQL

1. En tu dashboard de Supabase, ve a **SQL Editor**
2. Crea un nuevo query
3. Copia todo el contenido del archivo `supabase-schema.sql`
4. Pégalo en el editor SQL
5. Haz clic en **Run** para ejecutar el script

El script creará:
- ✅ 9 tablas principales (profiles, establishments, tables, orders, order_items, inventory_items, inventory_categories, suppliers, stock_movements)
- ✅ Triggers para actualizar timestamps automáticamente
- ✅ Funciones para gestión de stock
- ✅ Row Level Security (RLS) para proteger los datos
- ✅ Índices para mejorar el rendimiento

### 5. Configurar autenticación en Supabase

Ve a **Authentication** → **Providers** y configura:

#### Email Provider
- Habilita el provider de Email
- Configura el email de confirmación (opcional pero recomendado)
- Asegúrate de que "Confirm email" esté deshabilitado durante el desarrollo si quieres evitar verificaciones

#### Site URL
En **Authentication** → **URL Configuration**:
- **Site URL**: `http://localhost:3000` (para desarrollo)
- **Redirect URLs**: Agrega `http://localhost:3000/auth/callback`

### 6. Reiniciar el servidor de desarrollo

Después de configurar las variables de entorno:

```bash
# Detén el servidor actual (Ctrl+C)
# Luego reinícialo:
npm run dev
```

### 7. Verificar la configuración

1. Abre `http://localhost:3000` en tu navegador
2. La aplicación debería cargar sin errores
3. Intenta registrar un nuevo usuario para verificar que todo funciona

## Estructura de la Base de Datos

### Tablas Principales

#### `profiles`
Extiende la información de autenticación de Supabase auth.users
- Almacena información del usuario (nombre, teléfono, avatar)
- Define el rol (owner, manager, chef, waiter, bartender, cashier)
- Permisos individuales por módulo
- Estado del usuario (active, inactive, suspended, pending_verification)

#### `establishments`
Información de los restaurantes/establecimientos
- Datos de contacto y ubicación
- Tipo de establecimiento (restaurant, cafe, bar, etc.)
- Plan de suscripción (free, starter, professional, enterprise)
- Configuraciones en formato JSONB

#### `tables`
Mesas del establecimiento
- Número y capacidad
- Estado (available, occupied, reserved, cleaning)
- Posición en el plano (coordenadas x, y)
- Mesero asignado

#### `orders`
Pedidos realizados
- Mesa y mesero asignado
- Estado del pedido (pending, preparing, ready, served, paid, cancelled)
- Totales (subtotal, tax, total)
- Tiempos (creación, actualización, completado)

#### `order_items`
Items individuales de cada pedido
- Producto, cantidad, precio
- Notas y modificaciones

#### `inventory_items`
Items del inventario
- Nombre, categoría, stock actual
- Stock mínimo y unidad
- Costo y proveedor
- Estado automático según stock (good, medium, low, out)

#### `inventory_categories`
Categorías para organizar el inventario

#### `suppliers`
Proveedores de productos

#### `stock_movements`
Registro de movimientos de stock
- Tipo (in, out, adjustment)
- Cantidad y razón
- Usuario que realizó el movimiento

## Solución de Problemas

### Error: "Your project's URL and API key are required"
- Verifica que el archivo `.env.local` exista
- Asegúrate de que las variables estén correctamente nombradas:
  - `NEXT_PUBLIC_SUPABASE_URL` (no NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
- Reinicia el servidor después de modificar el archivo `.env.local`

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script SQL completo
- Verifica en el SQL Editor que todas las tablas fueron creadas
- Revisa que no haya errores en la ejecución del script

### La aplicación queda en loading
- Verifica que las variables de entorno estén cargadas correctamente
- Revisa la consola del navegador para ver errores específicos
- Asegúrate de que el servidor de desarrollo esté corriendo

### Error de autenticación
- Verifica que el Email Provider esté habilitado en Supabase
- Configura correctamente las Redirect URLs
- Durante el desarrollo, puedes deshabilitar "Confirm email" para facilitar las pruebas

## Próximos Pasos

Una vez configurada la base de datos:

1. **Crear un usuario de prueba**
   - Regístrate en la aplicación
   - Verifica que se cree el perfil en la tabla `profiles`
   - Verifica que se cree el establecimiento en `establishments`

2. **Probar las funcionalidades**
   - Crear mesas
   - Crear pedidos
   - Gestionar inventario
   - Ver reportes

3. **Configurar para producción**
   - Cambiar las URLs de desarrollo a producción
   - Habilitar confirmación de email
   - Configurar políticas de seguridad más estrictas
   - Configurar backups automáticos

## Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador para errores
2. Revisa la consola del servidor de desarrollo
3. Verifica el SQL Editor de Supabase para ver si hay errores en las consultas
4. Revisa los logs de Supabase en el dashboard
