import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*', // Replace with your frontend origin
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true, // Allow credentials (cookies, authorization headers)
      },
    });
    return server;
  }
}
