const io = require('socket.io')()

io.on('connection', client => {
  client.on('subscribeToTimer', interval => {
    console.log('client is subscribing to timer rwith interval', interval)
    setInterval(() => {
      client.emit('timer', new Date())
    }, interval)
  })
})

const port = 8000
io.listen(8000)
console.log('listing on port ', port)
