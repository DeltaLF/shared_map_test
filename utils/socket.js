const SocketServer = require("ws").Server;

function isJSONObject(string) {
  try {
    const o = JSON.parse(string);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}
  return false;
}

module.exports.socket = function (httpServer) {
  const wss = new SocketServer({ server: httpServer });
  console.log(wss);
  wss.on("connection", (ws) => {
    console.log("Server socket: client is connected");

    ws.on("message", (dataBuffer) => {
      const data = dataBuffer.toString();
      const jsonData = isJSONObject(data);
      if (jsonData && jsonData.type === "markers") {
        wss.clients.forEach((client) => {
          client.send(data);
        });
      }
    });

    ws.on("close", () => {
      console.log("Server socket: client left");
    });
  });
};
