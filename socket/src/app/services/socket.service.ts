import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private connectionError: boolean = false; // Variable para gestionar el estado de la conexión

  constructor() {
    // Reemplaza con la URL de tu servidor Express y el puerto
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'], // Se asegura de usar WebSocket para la comunicación
    });

    // Escuchar eventos de conexión y error
    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión al servidor de sockets:');
      this.connectionError = true; // Marcamos que ocurrió un error de conexión

      alert(
        'No se pudo conectar al servidor de sockets. Intenta de nuevo más tarde.'
      );
    });

    this.socket.on('connect_timeout', (timeout) => {
      console.error(
        'Tiempo de conexión agotado al servidor de sockets:',
        timeout
      );
      this.connectionError = true;
      if (typeof window !== 'undefined') {
        alert(
          'No se pudo conectar al servidor de sockets. Intenta de nuevo más tarde.'
        );
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Desconectado del servidor de sockets por:', reason);
      if (reason !== 'transport close') {
        this.connectionError = true; // Marca un error si la desconexión no fue por cierre normal
        if (typeof window !== 'undefined') {
          alert(
            'No se pudo conectar al servidor de sockets. Intenta de nuevo más tarde.'
          );
        }
      }
    });
  }

  // Conectar al socket
  connect() {
    if (this.connectionError) {
      console.warn('No se puede conectar debido a un error anterior.');
      return; // Si hubo un error previo de conexión, no intentamos conectar de nuevo
    }
    this.socket.connect();
  }

  // Desconectar del socket
  disconnect() {
    this.socket.disconnect();
  }

  // Emitir un evento al servidor
  sendEvent(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Escuchar eventos desde el servidor
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Dejar de escuchar un evento específico
  off(event: string) {
    this.socket.off(event);
  }

  // Verificar si el socket está conectado
  isConnected(): boolean {
    return this.socket.connected;
  }
}
