import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Logger, OnApplicationShutdown} from "@nestjs/common";
import {Server, Socket} from 'socket.io';
import {ServerToClientDevtoolsEvents, SocketMessage} from "@kraken/types";

@WebSocketGateway({cors: true})
export class WebsocketProvider implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnApplicationShutdown {

  @WebSocketServer() private server: Server;

  private clients: Socket[] = []

  private logger: Logger = new Logger('MessageGateway');

  afterInit(server: any): any {
    this.logger.log('WebsocketProvider.afterInit')
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log('WebsocketProvider.handleConnection')
    this.clients.push(client)
  }

  handleDisconnect(client: Socket): any {
    this.logger.log('WebsocketProvider.handleDisconnect')
    const index = this.clients.findIndex(it => it.id === client.id);
    this.clients.splice(index, 1)
  }

  onApplicationShutdown(signal?: string): any {
    this.logger.log('WebsocketProvider.onApplicationShutdown')
  }

  emit(type: keyof ServerToClientDevtoolsEvents, message?: SocketMessage) {
    this.clients.forEach(it => it.emit(type, message))
  }
}
