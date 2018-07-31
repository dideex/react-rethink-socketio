import openSocket from 'socket.io-client';
const socket = openSocket('192.168.1.2:8000')

function subscribeToDrawings(cb) {
  socket.on('drawing', cb)
  socket.emit('subscribeToDrawings', 1000)
}

function createDrawing(name) {
  socket.emit('createDrawing', { name })
}

function publishLine({drawingId, line}) {
  socket.emit('publishLine', {drawingId, ...line})
}

function subscribeToDrawingLines(drawingId, cb) {
  socket.on(`drawingLine:${drawingId}`, line => cb(line))
  socket.emit('subscribeToDrawingLines', drawingId)
  console.log(" api ___ drawingId ", drawingId );
}

export {
  subscribeToDrawings,
  createDrawing,
  publishLine,
  subscribeToDrawingLines
}