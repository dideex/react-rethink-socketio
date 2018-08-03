import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

const port = parseInt(window.location.search.replace('?', ''), 10) || 8000
const socket = openSocket('192.168.1.2:'+ port)

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
  const lineStream = Rx.Observable.fromEventPattern(
    h => socket.on(`drawingLine:${drawingId}`, h),
    h => socket.off(`drawingLine:${drawingId}`, h),
  )

  const bufferedTimeStream = lineStream
    .bufferTime(100)
    .map(lines => ({ lines }))

  bufferedTimeStream.subscribe(linesEvent => cb(linesEvent))
  socket.emit('subscribeToDrawingLines', drawingId)
}

function subscribeToConnectionEvent(cb) {
  socket.on('connect', () => cb({
    state: 'connected',
    port,
  }))
  socket.on('disconnect', () => cb({
    state: 'disconnected',
    port,
  }))
  socket.on('connect_error', () => cb({
    state: 'disconnected',
    port,
  }))
}


export {
  subscribeToDrawings,
  createDrawing,
  publishLine,
  subscribeToDrawingLines,
  subscribeToConnectionEvent,
}