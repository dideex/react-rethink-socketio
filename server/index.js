const r = require("rethinkdb");
const io = require("socket.io")();

function handleLinePublish({ connection, line }) {
  console.log(" LOG ___ 'saveing line to db ");
  r.table("lines")
    .insert({ ...line, timestamp: new Date() })
    .run(connection);
}

function createDrawing({ connection, name }) {
  r.table("drawings")
    .insert({
      name,
      timestamp: new Date()
    })
    .run(connection)
    .then(() => console.log("created a drawing witn name", name));
}

function subscribeToDrawings({ client, connection }) {
  r.table("drawings")
    .changes({ include_initial: true })
    .run(connection)
    .then(cursor => {
      cursor.each((_, drawingsRow) =>
        client.emit("drawing", drawingsRow.new_val)
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
    client.on("subscribeToDrawings", () =>
      subscribeToDrawings({
        client,
        connection
      })
    );
    client.on("publishLine", line =>
      handleLinePublish({
        line,
        connection
      })
    );
  });
});

const port = 8000;
io.listen(port);
console.log("listening on port ", port);
