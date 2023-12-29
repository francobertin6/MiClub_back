import { Server } from "socket.io";

let io;

export const init = (httpserver) => {

    io = new Server(httpserver);

    io.on('connection', (clienteSocket) => {

        console.log('nuevo cliente conectado', clienteSocket.id);

        clienteSocket.emit('inicio', 'hola desde el servidor');

        clienteSocket.on('mensaje-cliente', (data) => {

            console.log('data: ' + data);
            
        })
    })
}