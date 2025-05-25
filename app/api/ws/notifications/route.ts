import { WebSocketServer, WebSocket } from 'ws';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { createClient } from '@supabase/supabase-js';

// Tipos para TypeScript
type UserId = string;
type ClientId = string;
type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
};

// In-memory store for connected clients
const clients = new Map<UserId, Set<ClientId>>();
const clientToUserMap = new Map<ClientId, UserId>();

// Create HTTP server for WebSocket upgrade
const server = createServer();
const io = new SocketIOServer(server, {
  path: '/api/ws/notifications',
  addTrailingSlash: false,
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      : '*',
    methods: ['GET', 'POST'],
  },
});

// Handle WebSocket connections
io.on('connection', (socket: any) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Handle authentication
  socket.on('authenticate', async (token: string) => {
    try {
      // Verificar el token con Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        socket.emit('auth_error', 'Invalid authentication token');
        socket.disconnect(true);
        return;
      }
      
      const userId = user.id;
      
      // Add client to the user's client list
      if (!clients.has(userId)) {
        clients.set(userId, new Set());
      }
      clients.get(userId)?.add(socket.id);
      clientToUserMap.set(socket.id, userId);
      
      console.log(`User ${userId} authenticated with client ${socket.id}`);
      socket.emit('authenticated', { userId });
      
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth_error', 'Authentication failed');
      socket.disconnect(true);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const userId = clientToUserMap.get(socket.id);
    if (userId) {
      const userClients = clients.get(userId);
      if (userClients) {
        userClients.delete(socket.id);
        if (userClients.size === 0) {
          clients.delete(userId);
        }
      }
      clientToUserMap.delete(socket.id);
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
  
  // Handle errors
  socket.on('error', (error: Error) => {
    console.error('Socket error:', error);
  });
});

/**
 * Send a notification to a specific user
 */
function sendNotificationToUser(userId: string, notification: Notification): void {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.forEach(clientId => {
      io.to(clientId).emit('notification', notification);
    });
  }
}

/**
 * Broadcast a notification to all connected users
 */
function broadcastNotification(notification: Notification): void {
  io.emit('notification', notification);
}

// Handle HTTP requests
export async function GET(req: NextRequest) {
  // Handle WebSocket upgrade
  if (req.headers.get('upgrade') !== 'websocket') {
    return new NextResponse(
      JSON.stringify({ error: 'WebSocket upgrade required' }),
      { status: 426, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Get the auth token from the request headers
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Verify the token with Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // If we get here, the token is valid
  const res = new NextResponse(null, { status: 101 });
  // @ts-ignore - This is a special Next.js response for WebSocket upgrade
  res.socket.server = server;
  return res;
}

// Handle WebSocket server errors
server.on('error', (error: Error) => {
  console.error('WebSocket server error:', error);
});

// Start the server
const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

// Cleanup on process exit
process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  io.close();
  server.close();
  process.exit(0);
});

// Export the WebSocket server for use in other files
export const webSocketServer = {
  sendNotificationToUser,
  broadcastNotification,
  io,
};
