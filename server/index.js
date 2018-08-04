const http = require('http');
const r = require("rethinkdb");
const server = http.createServer(handler)
const io = require("socket.io")(server);

function handler(req, res) {
  res.writeHead(200);
  res.end('Hello Http');
}
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

function subscribeToDrawingLines({client, connection, drawingId, from}) {
  query = r.row('drawingId').eq(drawingId)

  if(from) {
    query = queyr.and(
      r.row('timestamp').ge(new Date(from))
    )
  }

  return r.table('lines')
    .filter(query)
    .changes({include_initial: true})
    .run(connection)
    .then(cursor => {
      cursor.each((_, lineRow) => client.emit(`drawingLine:${drawingId}`, lineRow.new_val))
    })

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
    client.on('subscribeToDrawingLines', ({drawingId, from}) => {
      subscribeToDrawingLines({client, connection, drawingId, from})
    })
  });
});

const port = parseInt(process.argv[2], 10) ||  8000;
io.listen(port);
console.log("listening on port ", port);
