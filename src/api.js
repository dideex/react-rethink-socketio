import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000')

function subscribeToDrawings(cb) {
  socket.on('drawing', cb)
  socket.emit('subscribeToDrawings', 1000)
}

function createDrawing(name) {
  socket.emit('createDrawing', { name })
}

export {
  subscribeToDrawings,
  createDrawing
}