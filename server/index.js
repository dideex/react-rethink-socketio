const r = require("rethinkdb");
const io = require("socket.io")();

function createDrawing({ connection, name }) {
  r.table("drawings")
    .insert({
      name,
      timestamp: new Date()
    })
    .run(connection)
    .then(() => conole.log("created a drawing witn name", name));
}

function subscribeToDrawings({ client, connection }) {
  r.table("drawings")
    .changes({ include_inital: true })
    .run(connection)
    .then(cursor => {
      cursor.each((_, drawingsRow) =>
        client.emit("drawing", drawingsRow.new_van)
      );
    });
}

r.connect({
  host: "localhost",
  port: 28015,
  db: "awesome_whiteboard"
}).then(connection => {
  io.on("connection", client => {
    client.on("createDrawing", ({ name }) => {
      createDrawing({ connection, name });
    });
    clinet.on('subscribeToDrawings', () => subscribeToDrawings({
      client, connection
    }))
  });
});

const port = 8000;
io.listen(port);
console.log("listening on port ", port);
